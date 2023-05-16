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
		fontFamily: '"Cascadia Code", Menlo, monospace',
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

	let con = {
		Write: (text, style) => {
			text = text.replaceAll("\n", "\n\r");
			term.write(text);
		},
		Input: (callback) => {
			promptCallback = callback;
			promptOn = true;
		},
		AbortInput: ()=>{}
	}

	function _recordCommandHistory() {
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
			_recordCommandHistory();
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
		for (let i = 0; i < command.length; i++) {
			term.write('\b \b');
		}
		command = "";
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

	function moveCursorToInputLeftMost() {
		while (cursor > 0) {
			cursor--;
			term.write('\x1b[D');
		}
	}

	function moveCursorToInputRightMost() {
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
		let text = command;
		let tokens = parseCmdInput(text);
		if (tokens.length === 0 || text.length > 0 && text[text.length-1] === " ") {
			return;
		}
		let lastToken = tokens[tokens.length-1];
		let isProgramFromPath = tokens.length===1 && lastToken.indexOf('/') === -1
		runtime.executeFuncCall('get_autocomplete', [lastToken, isProgramFromPath?1:0]);
		let suggestions = evaluator.expr('$autocomplete_');

		console.log(suggestions)

		if (suggestions.length === 1) {
			// found exactly one candidate
			let theCandidate = suggestions[0];
			moveCursorTo(command.length);
			let lastWord = lastToken.split('/').slice(-1)[0]
			theCandidate = theCandidate.slice(lastWord.length, theCandidate.length)
			command = text + theCandidate;
			cursor = command.length;
			term.write(theCandidate);
		}
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
		default: // all other characters
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
		/* pause execution for waiting for ajax result */
		env._pause = true;
		let paramsObject =  evaluator.expr(args[0]);
		if ("with_credential" in paramsObject) {
			paramsObject.xhrFields = {withCredentials: true};
			delete paramsObject.with_credential;
		}
		$.ajax(paramsObject)
		.done(function(resp) {
			env._global[args[1]] = resp;
			/* resume execution */
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

	evaluator.extend("log", (env, args) => {
		console.log(args.map((a)=> {evaluator.expr(a)}));
	});
	
	evaluator.extend("con", (env, args) => {
		/* console operations */
		let type = evaluator.expr(args[0]);
		if (type === "mask") {
			inputMask = evaluator.expr(args[1]);
		} else if (type === "color_print") {
			let text = evaluator.expr(args[1]);
			text = text + "";
			text = text.replaceAll("\n", "\n\r");
			let fgColor = evaluator.expr(args[2]);
			let bgColor = evaluator.expr(args[3]);
			let sequence = "";
			let styled = false;
			if (fgColor != null) {
				sequence += ("\u001b[38;5;" + fgColor + "m");
				styled = true;
			}
			if (bgColor != null) {
				sequence += ("\u001b[48;5;" + bgColor + "m");
				styled = true;
			}
			sequence += text;
			if (styled) {
				sequence += "\u001b[0m";
			}
			term.write(sequence);
		} else if (type === "buffer") {
			let mode = evaluator.expr(args[1]);
			if (mode === "primary") {
				term.write('\x9B?1049l');
			} else if (mode === "alternate") {
				term.write('\x9B?1049h');
			}
		} else if (type === "arrow") {
			let direction = evaluator.expr(args[1]);
			let arrowMap = {"up": "A", "down": "B", "right": "C", "left": "D"};
			term.write("\x1b[" + arrowMap[direction]);
		} else if (type === "clear") {
			let mode = evaluator.expr(args[1]);
			if (mode === "line") {
				term.write("\033[2K");
			} else if (mode === "screen") {
				//term.write("\033[2H");
				term.write('\x1b[A\033[2K')
				term.clear();
			}
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
