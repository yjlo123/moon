(function() {
	let runtime = runtimeExecuter();
	let evaluator = runtimeEvaluator();
	let parser = runtimeParser();

	let consoleHistory = [];
	let consoleHistoryIndex = -1;
	const MaxHistorySize = 20;

	let baseTheme = {
		foreground: '#F8F8F8',
		background: '#2D2E2C',
		selection: '#5DA5D533',
		black: '#1E1E1D',
		brightBlack: '#262625',
		red: '#CE5C5C',
		brightRed: '#FF7272',
		green: '#5BCC5B',
		brightGreen: '#72FF72',
		yellow: '#CCCC5B',
		brightYellow: '#FFFF72',
		blue: '#5D5DD3',
		brightBlue: '#7279FF',
		magenta: '#BC5ED1',
		brightMagenta: '#E572FF',
		cyan: '#5DA5D5',
		brightCyan: '#72F0FF',
		white: '#F8F8F8',
		brightWhite: '#FFFFFF'
	};
	let term = new Terminal({
		fontFamily: '"Cascadia Code", Menlo, monospace',
		theme: baseTheme,
		cursorBlink: true,
		cols: 51,
		rows: 20
	});
	let command = '';
	let cursor = 0;
	let promptCallback = null;
	let promptOn = false;
	let loggingIn = 0;
	let inputMask = false;
	let loginUsername = null;
	let loggedIn = undefined;

	function checkLogin() {
		$.ajax({
			url: "https://siwei.dev/session",
			type: "post"
		}).done(function( data ) {
			if (data.status === "0") {
				loginUsername = data.username;
				loggedIn = true;
			} else {
				loggedIn = false;
			}
			executeLogin();
		}).error(function(){
			console.log("Check login status failed.");
			loggedIn = false;
			executeLogin();
		});
		return null;
	}

	function loadUserFiles() {
		$.ajax({
			url: "https://siwei.dev/api/fs/load",
			type: "get"
		}).done(function( data ) {
			if (data.status === 0) {
				let env = runtime.getEnv(false);
				env.global.root.home = JSON.parse(data.home);
				console.log(env.global.root.env.home);
				let envHomePath = env.global.root.env.home.split("/");
				let homePath = env.global.root;
				for (let i = 0; i < envHomePath.length-1; i++) {
					homePath = homePath[envHomePath[i]];
				}
				homePath[envHomePath[envHomePath.length-1]] = '/home';
				env.global.path = ["home"]
			} else {
				term.write("\n\rLoad files error status.\n\r");
			}
		}).error(function(){
			term.write("\n\rRequest files failed.\n\r");
		});
	}

	function executeLogin() {
		if (typeof loggedIn === "undefined") {
			console.log("check login")
			return checkLogin();
		}
		if (loggedIn) {
			term.writeln("Already logged in as " + loginUsername);
			loadUserFiles();
			return promptCallback("");
		}
		if (loggingIn === 0) {
			term.write("Username:");
			promptOn = true;
		} else if (loggingIn === 1) {
			loginUsername = command;
			term.write("Password:");
			inputMask = true;
			promptOn = true;
		} else if (loggingIn === 2) {
			inputMask = false;
			term.write("Logging in...\n\r");
			$.ajax({
				url: "https://siwei.dev/login",
				type: "post",
				data: {
					username: loginUsername,
					password: command
				}
			}).done(function( data ) {
				if (data.status === 'success' || data.status === 'already logged in') {
					term.write(`Logged in as ${loginUsername}\n\r`);
					loggedIn = true;
					loadUserFiles();
				} else {
					term.write(data.status+"\n\r");
				}
				loggingIn = 0;
				return promptCallback(""); // resume normal prompt
			}).error(function(){
				term.write("Login failed.\n\r");
				loggingIn = 0;
				return promptCallback(""); // resume normal prompt
			});
		}
		loggingIn++;
	}

	function executeCommand() {
		promptOn = false;
		if (command === "login" || loggingIn > 0) {
			executeLogin();
		} else {
			promptCallback(command);
			// record history
			if (command.length > 0) {
				consoleHistory.push(command);
				if (consoleHistory.length > MaxHistorySize) {
					consoleHistory.shift();
				}
				consoleHistoryIndex = consoleHistory.length;
			}
		}
		command = '';
		cursor = 0;
	}

	term.open(document.getElementById('terminal'));
	term.onData(e => {
		if (!promptOn) {
			return;
		}
		switch (e) {
		// case '\u0003': // Ctrl+C
		// 	term.write('^C');
		// 	prompt(term);
		// 	break;
		case '\r': // Enter
			term.write('\n\r');
			executeCommand();
			break;
		case '\t': // Tab
			if (inputMask) { break; }
			processTab();
			break;
		case '\u001b[A': // Up Arrow
		if (inputMask) { break; }
			if (consoleHistoryIndex > 0) {
				consoleHistoryIndex -= 1;
				setPromptText(consoleHistory[consoleHistoryIndex]);
			}
			break;
		case '\u001b[B': // Down Arrow
			if (inputMask) { break; }
			if (consoleHistoryIndex < consoleHistory.length) {
				consoleHistoryIndex += 1;
				if (consoleHistoryIndex === consoleHistory.length) {
					clearInput();
				} else {
					setPromptText(consoleHistory[consoleHistoryIndex]);
				}
			}
			break;
		case '\x1b[C': // Right Arrow
			if (inputMask) { break; }
			if (cursor < command.length) {
				term.write('\x1b[C');
				cursor++;
			}
			break;
		case '\x1b[D': // Left Arrow
			if (inputMask) { break; }
			if (cursor > 0) {
				term.write('\x1b[D');
				cursor--;
			}
			break;
		case '\u007F': // Backspace (DEL)
			if (command.length > 0 && cursor > 0) {
				term.write('\b \b');
				let left = command.slice(0, cursor-1);
				let right = command.slice(cursor, command.length);
				command = left + right;
				term.write(right + ' ');
				for (let i = 0; i < right.length+1; i++) {
					term.write('\x1b[D');
				}
				cursor--;
			}
			break;
		default: // Print all other characters for demo
			if (e >= String.fromCharCode(0x20) && e <= String.fromCharCode(0x7B) || e >= '\u00a0') {
				let left = command.slice(0, cursor);
				let right = command.slice(cursor, command.length);
				command = left + e + right;
				if (inputMask) {
					term.write("*");
				} else {
					term.write(e);
				}
				term.write(right);
				cursor++;
				for (let i = 0; i < right.length; i++) {
					term.write('\x1b[D');
				}
			}
		}
	});

	let con = {
		Write: (text, style) => {
			if (text.length > 0) {
				let lineContent = text.slice(0,text.length-1);
				if (lineContent === '\\033[F') {
					term.write('\033[F');
					return;
				} else if (lineContent === '\\033[2K') {
					term.write('\033[2K');
					return;
				}
			}
			// text = text.replaceAll('[x1b', '\x1b');
			text = text.replaceAll("\n", "\n\r");
			term.write(text);
		},
		Input: (callback) => {
			promptCallback = callback;
			promptOn = true;
		},
		AbortInput: ()=>{}
	}

	runtime.config(parser, evaluator, null, con, null, {});

	function clearInput() {
		while (cursor < command.length) {
			term.write('\x1b[C');
			cursor++;
		}
		while (command.length > 0) {
			term.write('\b \b');
			command = command.slice(0, command.length - 1);
		}
		cursor = 0;
	}

	function setPromptText(text) {
		clearInput();
		term.write(text);
		command = text;
		cursor = command.length;
	}

	function moveCursorTo(pos) {
		while (cursor < pos) {
			cursor++;
			term.write('\x1b[C');
		}
		while (cursor > pos) {
			cursor--;
			term.write('\x1b[D');
		}
	}

	function parseCmdInput(str) {
		let result = [];
		let token = ''
		for (let i = 0; i < str.length; i++) {
			if (str[i] === ' ') {
				if (token.length > 0) {
					result.push(token);
					token = '';
				}
			} else if (str[i] === '\'' || str[i] === '"') {
				const q = str[i];
				i += 1;
				while (i < str.length && str[i] !== q) {
					token += str[i];
					i+=1;
				}
				result.push(token);
				token = '';
			} else {
				token += str[i];
			}
		}
		if (token.length > 0) {
			result.push(token);
		}
		return result;
	}

	function processTab() {
		let env = runtime.getEnv(false);
		let path = env.global.path; 
		let root = env.global.root;
		let text = command;
		let tokens = parseCmdInput(text);
		if (tokens.length < 1 || text.length > 0 && text[text.length-1] === " ") {
			return false;
		}
		let lastToken = tokens[tokens.length-1];
		let currentDir = root;

		if (lastToken.indexOf('/') > -1) {
			// specified path
			let pathTokens = lastToken.split('/');
			if (lastToken[0] === '/') {
				// from root
				pathTokens = lastToken.slice(1).split('/');
				path = [];
			}
			path = path.slice(); // copy path
			for (let i = 0; i < pathTokens.length-1; i++) {
				if (pathTokens[i] == '..') {
					path.pop();
				} else if (pathTokens[i] == '~') {
					// home dir
					let envHomeDir = env.global.env_home.split("/").filter(i => i);
					let tempPath = root;
					for (let i = 0; i < envHomeDir.length; i++) {
						tempPath = tempPath[envHomeDir[i]];
					}
					path = tempPath.split("/").filter(i => i);
				} else if (pathTokens[i] !== '.') {
					path.push(pathTokens[i]);
				}
			}
			lastToken = pathTokens[pathTokens.length-1];

		} else if (tokens.length === 1) {
			// find program in env path
			let envPathDir = env.global.env_path.split("/").filter(i => i);
			let tempPath = root;
			for (let i = 0; i < envPathDir.length; i++) {
				tempPath = tempPath[envPathDir[i]];
			}
			path = tempPath.split("/").filter(i => i);
		}

		// go to path
		for (let i = 0; i < path.length; i++) {
			currentDir = currentDir[path[i]];
			if (!currentDir) {
				return false;
			}
		}

		let candidate = []
		for (const [key, value] of Object.entries(currentDir)) {
			if (key.startsWith(lastToken)) {
				candidate.push(key);
			}
		}
		if (candidate.length === 1) {
			// found exact one candidate
			moveCursorTo(command.length);
			text = text.slice(0, text.length-lastToken.length);
			let theCandidate = candidate[0];
			text += theCandidate;
			command = text;
			cursor = command.length;
			term.write(theCandidate.slice(lastToken.length, theCandidate.length));
		}
		return false;
	}

	runtime.restart();
	runtime.executeAll(null, moonSrc);

	let ledClock = setInterval(function(){
		let env = runtime.getEnv(false);
		let leds = env.global.leds;
		let devLed = env.global.root.dev.led;
		leds[0] = parseInt(devLed) === 1 ? 1 : 0;
		for (let i = 0; i < 3; i++) {
			let color = "rgb(129, 129, 129)"
			if (leds[i] === 1) {
				color = "#eee";
			}
			$(`.monitor-led div:nth-child(${i+1})`).css( "background", color);
		}
	}, 1000);

	term.focus();
})();
