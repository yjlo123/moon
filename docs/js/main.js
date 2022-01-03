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

	jqconsole.custom_control_key_handler = function(e) {
		if (e.which === 9) {
			// tab key
            let env = runtime.getEnv(false);
            let path = env.global.path;
            let root = env.global.root;
            let text = jqconsole.GetPromptText();
            let tokens = text.split(" ");
            if (tokens.length <= 1 || (text.length > 0 && text[text.length-1] === " ")) {
                return false;
            }
            let lastToken = tokens[tokens.length-1];
            let currentDir = root;
            for (let i = 0; i < path.length; i++) {
                currentDir = currentDir[path[i]];
            }
            let candidate = []
            for (const [key, value] of Object.entries(currentDir)) {
                if (key.startsWith(lastToken)) {
                    candidate.push(key);
                }
            }
            if (candidate.length === 1) {
                let lastIndexSpace = text.lastIndexOf(' ');
                text = text.slice(0, lastIndexSpace + 1);
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
