(function() {
	let runtime = runtimeExecuter();
	let evaluator = runtimeEvaluator();
	let parser = runtimeParser();

	let consoleHistory = [];
	let consoleHistoryIndex = -1;
	const MaxHistorySize = 20;

	const TERM_COLS = 51;
	const TERM_ROWS = 19;

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
		fontFamily: '"Cascadia Code", Menlo, monospace', /* Ubuntu Mono, courier-new, courier, monospace', "Cascadia Code", Menlo, monospace */
		fontSize: 16,
		lineHeight: 1,
		theme: baseTheme,
		cursorBlink: true,
		cols: TERM_COLS,
		rows: TERM_ROWS
	});
	let command = '';
	let cursor = 0;
	let promptCallback = null;
	let promptOn = false;
	let inputMask = null;

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
				} else if (lineContent === '\\033[2H') {
					// clear screen
					//term.write('\033[2H\033[F');
					term.clear();
					return;
				} else if (lineContent === '\\u001b[7m') {
					// reverse
					term.write('\u001b[7m');
					return;
				} else if (lineContent.startsWith('\u001b[38;5;')) {
					term.write('\u001b[38;5;87m');
				} else if (lineContent === "\\x9B?47h") {
					// alternate buffer
					term.write('\x9B?1049h');
					return;
				} else if (lineContent === "\\x9B?47l") {
					// primary buffer
					term.write('\x9B?1049l');
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
		if (inputMask === null) {
			recordCommandHistory();
		}
		promptCallback(command);
		command = '';
		cursor = 0;
	}

	function insertToCommand(text) {
		let left = command.slice(0, cursor);
		let right = command.slice(cursor, command.length);
		command = left + text + right;
		if (inputMask) {
			term.write(inputMask.repeat(text.length));
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

	function moveCursorToInputLeftMost(pos) {
		while (cursor > 0) {
			cursor--;
			term.write('\x1b[D');
		}
	}

	function moveCursorToInputRightMost(pos) {
		while (cursor < command.length) {
			term.write('\x1b[C');
			cursor++;
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

	function onTab() {
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

	function onCtrlC() {
		let env = runtime.getEnv(false);
		term.write('\n\r');
		command = '';
		cursor = 0;
		inputMask = null;
		// clean temp status in Runtime Script env
		if (env.global.runtime_running === 1) {
			env.global.sig_interrupt = 1;
			env.global.prt_delay_disabled = 0;
			//env.global.runtime_running = 0;
		}
		promptCallback("");
	}

	function onArrowUp() {
		if (consoleHistoryIndex > 0) {
			consoleHistoryIndex -= 1;
			setPromptText(consoleHistory[consoleHistoryIndex]);
		}
	}

	function onArrowDown() {
		if (consoleHistoryIndex < consoleHistory.length) {
			consoleHistoryIndex += 1;
			if (consoleHistoryIndex === consoleHistory.length) {
				clearInput();
			} else {
				setPromptText(consoleHistory[consoleHistoryIndex]);
			}
		}
	}

	function onArrowRight() {
		if (cursor < command.length) {
			term.write('\x1b[C');
			cursor++;
		}
	}

	function onArrowLeft() {
		if (cursor > 0) {
			term.write('\x1b[D');
			cursor--;
		}
	}

	function sendKeyEventToEnv(keyCode) {
		let env = runtime.getEnv(false);
		if (env.global.runtime_running === 1) {
			// key press captured by runtime program
			env.global.key_press.push(keyCode);
			env.global.key_press = env.global.key_press.slice(0,5);
			return true;
		}
		// key press can be processed by terminal
		return false;
	}

	$('#key-tab').click(()=>{
		if (inputMask) { return; }
		onTab();
		term.focus();
	});
	$('#key-ctl-c').click(()=>{
		onCtrlC();
		term.focus();
	});
	$('#key-up').click(()=>{
		if (inputMask) { return; }
		if (!sendKeyEventToEnv(38)) {
			onArrowUp();
		}
		term.focus();
	});
	$('#key-down').click(()=>{
		if (inputMask) { return; }
		if (!sendKeyEventToEnv(40)) {
			onArrowDown();
		}
		term.focus();
	});
	$('#key-left').click(()=>{
		if (inputMask) { return; }
		if (!sendKeyEventToEnv(37)) {
			onArrowLeft();
		}
		term.focus();
	});
	$('#key-right').click(()=>{
		if (inputMask) { return; }
		if (!sendKeyEventToEnv(39)) {
			onArrowRight();
		}
		term.focus();
	});


	term.open(document.getElementById('terminal'));

	term.onKey(function (ev) {
		sendKeyEventToEnv(ev.domEvent.keyCode);
	});

	term.onData(e => {
		if (!promptOn && e !== '\u0003') {
			// unless Ctrl+c
			return;
		}
		switch (e) {
		case '\u0003': // Ctrl+C
			onCtrlC();
			break;
		case '\u0001': // Ctrl+A
			moveCursorToInputLeftMost();
			break;
		case '\u0005': // Ctrl+E
			moveCursorToInputRightMost();
			break;
		case '\r': // Enter
			term.write('\n\r');
			executeCommand();
			break;
		case '\t': // Tab
			if (inputMask) { break; }
			onTab();
			break;
		case '\u001b[A': // Up Arrow
			if (inputMask) { break; }
			onArrowUp();
			break;
		case '\u001b[B': // Down Arrow
			if (inputMask) { break; }
			onArrowDown();
			break;
		case '\x1b[C': // Right Arrow
			if (inputMask) { break; }
			onArrowRight();
			break;
		case '\x1b[D': // Left Arrow
			if (inputMask) { break; }
			onArrowLeft();
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
			
			if (val === '0' || val === 0) {
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

	evaluator.extend("net", (env, args) => {
		let env_paused_status = env._pause;
		env._pause = true; /* pause execution for waiting for ajax result */
		let paramsObject =  evaluator.expr(args[0]);
		if ("with_credential" in paramsObject) {
			paramsObject.xhrFields = {withCredentials: true};
			delete paramsObject.with_credential;
		}
		$.ajax(paramsObject)
		.done(function(resp) {
			env._global[args[1]] = resp;
			// resume execution
			env._pause = env_paused_status;
			env._resume.call();
		})
	});

	evaluator.extend("led", (env, args) => {
		let ledId = parseInt(evaluator.expr(args[0]));
		let ledVal = parseInt(evaluator.expr(args[1]));
		let color = $(`.monitor-led div:nth-child(4)`).css("background");
		if (ledVal === 1) {
			color = "#eee";
		}
		$(`.monitor-led div:nth-child(${ledId+1})`).css("background", color);
	});
	
	evaluator.extend("con", (env, args) => {
		let type = evaluator.expr(args[0]);
		if (type === "mask") {
			inputMask = evaluator.expr(args[1]);
		}
	});

	// parser, evaluator, editor, console, canvas, controls, options
	runtime.config(parser, evaluator, null, con, canvas, {}, {});
	runtime.restart();
	runtime.executeAll({
		term_w: TERM_COLS,
		term_h: TERM_ROWS
	}, moonSrc);
	
})();
