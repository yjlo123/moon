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
	let promptCallback = null;
	let promptOn = false;

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
			promptOn = false;
			promptCallback(command);
			// record history
			if (command.length > 0) {
				consoleHistory.push(command);
				if (consoleHistory.length > MaxHistorySize) {
					consoleHistory.shift();
				}
				consoleHistoryIndex = consoleHistory.length;
			}
			command = '';
			break;
		case '\t': // Tab
			processTab();
			break;
		case '\u001b[A': // Left Arrow
			if (consoleHistoryIndex > 0) {
				consoleHistoryIndex -= 1;
				setPromptText(consoleHistory[consoleHistoryIndex]);
			}
			break;
		case '\u001b[B': // Down Arrow
			if (consoleHistoryIndex < consoleHistory.length) {
				consoleHistoryIndex += 1;
				if (consoleHistoryIndex === consoleHistory.length) {
					clearInput();
				} else {
					setPromptText(consoleHistory[consoleHistoryIndex]);
				}
			}
			break;
		case '\u007F': // Backspace (DEL)
			// Do not delete the prompt
			if (term._core.buffer.x > 2) {
				if (command.length > 0) {
					term.write('\b \b');
					command = command.slice(0, command.length - 1);
				}
			}
			break;
		case 'x':
			// line up
			term.write('\033[1A');
			// start of the previous line
			term.write('\033[F');
			// clear line
			term.write('\x1b[2K');
			break;
		default: // Print all other characters for demo
			if (e >= String.fromCharCode(0x20) && e <= String.fromCharCode(0x7B) || e >= '\u00a0') {
				command += e;
				term.write(e);
			}
		}
	});

	let con = {
		Write: (text, style) => {
			term.write(text.replace("\n", "\n\r"));
		},
		Input: (callback) => {
			promptCallback = callback;
			promptOn = true;
		},
		AbortInput: ()=>{}
	}

	runtime.config(parser, evaluator, null, con, null, {});

	function clearInput() {
		while (command.length > 0) {
			term.write('\b \b');
			command = command.slice(0, command.length - 1);
		}
	}

	function setPromptText(text) {
		clearInput();
		term.write(text);
		command = text;
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
			let currentTextLen = text.length;
			text = text.slice(0, text.length-lastToken.length);
			let theCandidate = candidate[0];
			text += theCandidate;
			command = text;
			term.write(theCandidate.slice(lastToken.length, theCandidate.length));
			console.log(command);
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
