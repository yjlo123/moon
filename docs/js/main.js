(function() {
	let runtime = runtimeExecuter();
	let evaluator = runtimeEvaluator();
	let parser = runtimeParser();

	let consoleHistory = [];
	let consoleHistoryIndex = -1;
	const MaxHistorySize = 20;

	let jqconsole = $('#console').jqconsole();
	jqconsole.SetPromptLabel('');

	runtime.config(parser, evaluator, null, jqconsole, null, {});

	jqconsole.Prompt(true, function (input) {
		jqconsole.Write('[Session Ended]\nPlease refresh this page to start a new session.', 'console-default');
	});

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

	jqconsole.custom_control_key_handler = function(e) {
		if (e.which === 9) {
			// tab key
			let env = runtime.getEnv(false);
			let path = env.global.path; 
			let root = env.global.root;
			let text = jqconsole.GetPromptText();
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
					} else {
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
				text = text.slice(0, text.length-lastToken.length);
				text += candidate[0];
				jqconsole.SetPromptText(text);
			}
			return false;
		}
		if (e.which === 13) {
			// enter key
			let promptText = jqconsole.GetPromptText();
			if (promptText.length > 0) {
				consoleHistory.push(promptText);
				if (consoleHistory.length > MaxHistorySize) {
					consoleHistory.shift();
				}
				consoleHistoryIndex = consoleHistory.length;
			}
		}
		if (e.which === 38) {
			// up arrow key
			if (consoleHistoryIndex > 0) {
				consoleHistoryIndex -= 1;
				jqconsole.SetPromptText(consoleHistory[consoleHistoryIndex]);
			}
		}
		if (e.which === 40) {
			// down arrow key
			if (consoleHistoryIndex < consoleHistory.length) {
				consoleHistoryIndex += 1;
				if (consoleHistoryIndex === consoleHistory.length) {
					jqconsole.SetPromptText("");
				} else {
					jqconsole.SetPromptText(consoleHistory[consoleHistoryIndex]);
				}
			}
		}
	};

	runtime.restart();
	runtime.executeAll(null, moonSrc);

	let ledClock = setInterval(function(){
		let env = runtime.getEnv(false);
		let leds = env.global.leds;
		for (let i = 0; i < 3; i++) {
			let color = "rgb(129, 129, 129)"
			if (leds[i] === 1) {
				color = "#eee";
			}
			$(`.monitor-led div:nth-child(${i+1})`).css( "background", color);
		}
	}, 1000);
})();

/*
(function() {
	let runtime = runtimeExecuter();
	let evaluator = runtimeEvaluator();
	let parser = runtimeParser();

	let chat_console = $('#chat-console').jqconsole();
	chat_console.SetPromptLabel('');

	runtime.config(parser, evaluator, null, chat_console, null, {});

	(function () {
		chat_console.Prompt(true, function (input) {
		});
	})();
	runtime.restart();
	runtime.executeAll(null, chatSrc);
})();

let chatOpened = true;
$('#chat-btn').click(function() {
	if (chatOpened) {
		$('.chat-view').addClass('chat-collapsed');
		chatOpened = false;
	} else {
		$('.chat-view').removeClass('chat-collapsed');
		chatOpened = true;
	}
});
*/
