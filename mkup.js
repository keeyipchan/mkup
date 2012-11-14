var mkup = (function() {
	var kSeparator = /[() ]/
	
	// Number of iterations per step before calling next(), which continues in the next tick
	var kStepSize = 20
	
	function readSelector (str, i)
	{
		var j=i, n=str.length
		for (; j < n && !kSeparator.test(str[j]); j++);
		return str.substring(i,j)
	}

	return function(str, config)
	{
		var path = [config.makeRoot()]
		var i = 0, n = str.length

		function next()
		{
			if (i >= n) { config.onFinish(path[0]); return }
			else setTimeout(step, 0)
		}

		function step()
		{
			// Bring helpers to local scope, speedier
			var beginNode = step.beginNode, endNode = step.endNode, skipSpaces = step.skipSpaces
			
			var j = Math.min(i+kStepSize,n)
			while (i < j)
			{
				var c = str[i]
				if      (c == ' ') {      endNode(1); skipSpaces()
				
					// Skip ')', we've already called endNode(1)
					// Example: 'div.one(a ) div.two' -> {div.one:a, div.two}
					// endNode(1) gets called for the 2 spaces in ' ) ', so we don't want the ')' to cause another endNode(1), which would total 3 calls.
					if (str[i] == ')') i++
				}
				else if (c == ')') { i++; endNode(1);                }
				else if (c == '(') { i++;             skipSpaces()
				
					if (!beginNode())
					{
						i+=2; // Skip ')'
						endNode(1)
					}
				}
				else beginNode()
			}

			next()
		}

		step.beginNode = function() {
			var selector = readSelector(str, i)
			var newNode = config.beginNode(selector, path.slice(-1)[0])
			if (newNode) path.push(newNode)
			i += selector.length
			return newNode
		}

		step.endNode = function(walks) {
			// Ensure path[0], the root, is not removed
			walks = Math.min(walks, path.length-1)
			
			config.endNode && config.endNode(walks)
			path.splice(-walks)
		}

		step.skipSpaces = function() { for (; str[i] == ' '; i++); }

		next()
	}
})();

mkup.dom = (function() {
	var kSelector = /^([a-z].*?)?(#.*?)?(\..*?)?$/

	function make$FromSelector(selector)
	{
		var parts = selector.match(kSelector)
		if (parts && parts[0].length)
		{
			var $el = parts[1] ? $('<' + parts[1] + '>') : $('<div>')

			if (parts[2]) $el.attr('id', parts[2].substr(1))
			if (parts[3]) $el.addClass(parts[3].replace(/\./g, ' '))

			return $el
		}
		else return null
	}

	function beginNode(selector, $current)
	{
		var $new = make$FromSelector(selector)
		if ($new && $current) $new.appendTo($current)
		return $new
	}
	
	function makeRoot() { return $(document.createDocumentFragment()) }

	return function(str, onFinish) {
		mkup(str, {
			makeRoot: makeRoot,
			beginNode: beginNode,
			onFinish: onFinish
		})
	}
})();

mkup.obj = (function() {
	var kSelector = /^\S+$/

	function beginNode(selector, current)
	{
		if (selector.match(kSelector, current))
		{
			var newNode = {}
			if (current) current[selector] = newNode;
			return newNode;

		} else return null;
	}

	function makeRoot() { return {} }
	
	return function(str, onFinish) {
		mkup(str, {
			makeRoot: makeRoot,
			beginNode: beginNode,
			onFinish: onFinish
		});
	};
})();
