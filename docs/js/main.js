(function() {
	let runtime = runtimeExecuter();
	let evaluator = runtimeEvaluator();
	let parser = runtimeParser();

	let consoleHistory = [];
	let consoleHistoryIndex = -1;
	const MaxHistorySize = 20;
	const API_AUTH_HOST = "https://siwei.dev";
	const API_AUTH_SESSION = API_AUTH_HOST + "/session";
	const API_AUTH_LOGIN = API_AUTH_HOST + "/login";
	const API_AUTH_LOGOUT = API_AUTH_HOST + "/logout";
	const API_FILES_LOAD = API_AUTH_HOST + "/api/fs/load"
	const API_FILES_SAVE= API_AUTH_HOST + "/api/fs/save"

	const TERM_COLS = 51;
	const TERM_ROWS = 20;

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
		cols: TERM_COLS,
		rows: TERM_ROWS
	});
	let command = '';
	let cursor = 0;
	let promptCallback = null;
	let promptOn = false;
	let loggingIn = 0;
	let inputMask = false;
	let loginUsername = undefined;
	let loggedIn = undefined;
	const escapeMap = {
		'\\x1b[A': '\x1b[A',
		'\\x1b[B': '\x1b[B',
		'\\x1b[C': '\x1b[C',
		'\\x1b[D': '\x1b[D',
	}

	let con = {
		Write: (text, style) => {
			if (text.length > 0) {
				let w = text.slice(0,text.length-1);
				if (w.slice(0,4) === '\\x1b') {
					term.write(escapeMap[w]);
					return;
				}

				let lineContent = text.slice(0,text.length-1);
				if (lineContent === '\\033[F') {
					// prev line
					term.write('\033[F');
					return;
				} else if (lineContent === '\\033[2K') {
					// clear line
					term.write('\033[2K');
					return;
				} else if (lineContent === '\\u001b[7m') {
					term.write('\u001b[7m');
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

	function checkLogin(callback) {
		$.ajax({
			url: API_AUTH_SESSION,
			type: "post"
		}).done(function( data ) {
			if (data.status === "0") {
				loginUsername = data.username;
				loggedIn = true;
			} else {
				loggedIn = false;
			}
			callback();
		}).error(function(){
			console.log("Check login status failed.");
			loggedIn = false;
			callback();
		});
		return null;
	}

	function loadUserFiles(callback) {
		$.ajax({
			url: API_FILES_LOAD,
			type: "get"
		}).done(function( data ) {
			if (data.status === 0) {
				let env = runtime.getEnv(false);
				env.global.root.env.user = loginUsername;
				env.global.root.home[loginUsername] = JSON.parse(data.home);
				callback();
			} else {
				term.write("\n\rLoad files error status.\n\r");
			}
		}).error(function(){
			term.write("\n\rRequest files failed.\n\r");
		});
	}

	function executeSync(callback) {
		let env = runtime.getEnv(false);
		$.ajax({
			url: API_FILES_SAVE,
			type: "post",
			data: {
				data: JSON.stringify(env.global.root.home[loginUsername])
			}
		}).done(function( data ) {
			if (data.status === 0) {
				term.write("Saved files successfully.\n\r");
			} else {
				term.write("Save files error status.\n\r");
			}
			callback();
		}).error(function(){
			term.write("\n\rRequest saving files failed.\n\r");
			callback();
		});
	}

	function executeLogin() {
		if (typeof loggedIn === "undefined") {
			// checkLogin sets loggedIn true/false
			return checkLogin(executeLogin);
		}
		if (loggedIn) {
			term.writeln("Already logged in as " + loginUsername);
			loggingIn = 0;
			return loadUserFiles(()=>{
				promptCallback("cd");
			});
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
				url: API_AUTH_LOGIN,
				type: "post",
				data: {
					username: loginUsername,
					password: command
				}
			}).done(function( data ) {
				if (data.status === 'success' || data.status === 'already logged in') {
					term.write(`Logged in as ${loginUsername}\n\r`);
					loggedIn = true;
					loadUserFiles(()=>{
						loggingIn = 0;
						return promptCallback("cd"); // go to user home
					});
				} else {
					term.write(data.status+"\n\r");
				}
			}).error(function(){
				term.write("Login failed.\n\r");
				loggingIn = 0;
				return promptCallback(""); // resume normal prompt
			});
		}
		loggingIn++;
	}

	function executeLogout() {
		$.ajax({
			url: API_AUTH_LOGOUT,
			type: "get",
			data: {}
		}).done(()=>{
			let env = runtime.getEnv(false);
			delete env.global.root.home[loginUsername];
			env.global.root.env.user = "guest";
			loggedIn = false;
			loginUsername = undefined;
			promptCallback("cd"); // go to guest home
		});
	}

	function recordCommandHistory() {
		if (command.length > 0) {
			consoleHistory.push(command);
			if (consoleHistory.length > MaxHistorySize) {
				consoleHistory.shift();
			}
			consoleHistoryIndex = consoleHistory.length;
		}
	}

	function executeCommand() {
		promptOn = false;
		if (command === "login" || loggingIn > 0) {
			executeLogin();
			if (command === "login") {
				recordCommandHistory();
			}
		} else {
			if (command === "logout") {
				executeSync(()=>{
					executeLogout();
				});
			} else if (command === "sync") {
				executeSync(()=>{
					promptCallback("");
				});
			} else {
				promptCallback(command);
			}
			recordCommandHistory();
		} 
		command = '';
		cursor = 0;
	}

	function insertToCommand(text) {
		let left = command.slice(0, cursor);
		let right = command.slice(cursor, command.length);
		command = left + text + right;
		if (inputMask) {
			term.write("*".repeat(text.length));
		} else {
			term.write(text);
		}
		term.write(right);
		cursor += text.length;
		for (let i = 0; i < right.length; i++) {
			term.write('\x1b[D');
		}
	}

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
		let path = env.global.path.slice(); // copy path
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
				// absolute path, from root
				pathTokens = lastToken.slice(1).split('/');
				path = [];
			}
			for (let i = 0; i < pathTokens.length-1; i++) {
				if (pathTokens[i] == '..') {
					path.pop();
				} else if (pathTokens[i] == '~') {
					// home dir
					let envUserNameDir = env.global.env_user.split("/").filter(i => i);
					let tempPath = root;
					for (let i = 0; i < envUserNameDir.length; i++) {
						tempPath = tempPath[envUserNameDir[i]];
					}
					path = ['home'];
					path.push(tempPath);
					console.log(path);
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
		let pathStack = path.reverse();
		while (pathStack.length > 0) {
			let p = pathStack.pop();
			currentDir = currentDir[p];
			if (Array.isArray(currentDir) && currentDir.length > 0 &&
				Array.isArray(currentDir[0]) && currentDir[0][0] === "lnk") {
					let linkToPathStr = currentDir[0][1];
					if (linkToPathStr[0] === "/") {
						currentDir = root
						let linkPath = linkToPathStr.split("/").filter(i => i);
						for (let i = linkPath.length-1; i >= 0; i--) {
							pathStack.push(linkPath[i]);
						}
					}
			}
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

	term.open(document.getElementById('terminal'));

	term.onKey(function (ev) {
		let env = runtime.getEnv(false);
		if (env.global.runtime_running === 1) {
			env.global.key_press.push(ev.domEvent.keyCode);
			env.global.key_press = env.global.key_press.slice(0,5);
		}
	});

	term.onData(e => {
		let env = runtime.getEnv(false);
		if (!promptOn && e !== '\u0003') {
			// unless Ctrl+c
			return;
		}
		switch (e) {
		case '\u0003': // Ctrl+C
			term.write('\n\r');
			command = '';
			cursor = 0;
			loggingIn = 0;
			inputMask = false;
			// clean temp status in Runtime Script env
			env.global.sig_interrupt = 1;
			env.global.prt_delay_disabled = 0;
			env.global.runtime_running = 0;
			promptCallback("");
			break;
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
			if (e >= String.fromCharCode(0x20) && e <= String.fromCharCode(0x7E) || e >= '\u00a0') {
				// 0x20 ~ 0x7e : 32 ~ 126
				insertToCommand(e);
			}
		}
	});

	term.focus();

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

	let pixels = [];
	let widthInBlocks = 20;
	let canvas = {
		drawPixel: (x, y, val) => {
			/* x: col, y: row*/
			x = parseInt(x)
			y = parseInt(y)
			pixels[widthInBlocks*x+y] = val;

			let up = widthInBlocks-y;
			for (let i = 0; i < up; i++) {
				term.write('\x1b[A');
			}
			for (let i = 0; i < x-1; i++) {
				term.write('\x1b[C');
			}
			
			if (val === '0') {
				term.write(' ');
			} else if (val !== ''){
				term.write('#');
			}

			for (let i = 0; i < up; i++) {
				term.write('\x1b[B');
			}
			for (let i = 0; i < x; i++) {
				term.write('\x1b[D');
			}
			
		},
		getPixel: (x, y) => {
			x = parseInt(x)
			y = parseInt(y)
			return pixels[widthInBlocks*x+y] | '0';
		},
		clearCanvas: (size=20) => {
			widthInBlocks = size;
			for (let i = 0; i < size; i++) {
				term.write('\033[F');
				term.write('\033[2K');
			}
		}
	}

	// parser, evaluater, editor, consl, canvas, controls, options
	runtime.config(parser, evaluator, null, con, canvas, {}, {});
	runtime.restart();
	runtime.executeAll({
		term_w: TERM_COLS,
		term_h: TERM_ROWS
	}, moonSrc);
})();
