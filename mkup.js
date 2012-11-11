mkup = (function() {
	var kSeparator = /[()]| /
	var kSelector = /^(.*?)(#.*?)?(\..*?)?$/
	
	function make$FromSelector(selector)
	{
		var parts = selector.match(kSelector)
		if (parts && parts[0].length)
		{
			var $el = parts[1] ? $('<' + parts[1] + '>') : $('<div>')

			if (parts[2]) $el.attr('id', parts[2].substr(1))
			if (parts[3]) $el.addClass(parts[3].replace(/\./g, ' '))

			return $el

		} else return $('<junk>')
	}

	function readSelector (str, i)
	{
		for (var j=i, n=str.length; j < n && !kSeparator.test(str[j]); j++);
		return str.substring(i,j)
	}

	return function(str, onFinish)
	{
		var $root, $current = $()
		var i = 0, n = str.length

		function next()
		{
			if (i >= n) { onFinish($root); return }
			else setTimeout(step, 0)
		}

		function step()
		{
			var c = str[i]
			if      (c == ' ') {      step.endElement();  step.skipSpaces()   }
			else if (c == '(') { i++; step.skipSpaces();  step.beginElement() }
			else if (c == ')') { i++;

				if ($current.is('junk')) { $current.remove() }

				step.endElement(); step.endElement(); step.skipSpaces()

			} else step.beginElement()

			next()
		}

		step.skipSpaces = function() { for (; str[i] == ' '; i++); }

		step.beginElement = function()
		{
			var selector = readSelector(str, i)
			var $new = make$FromSelector(selector)

			if ($current.length) $new.appendTo($current)
			else $root = $new

			$current = $new
			i += selector.length
		}

		step.endElement = function()
		{
			var $parent = $current.parent()
			if ($parent.length) $current = $parent
		}

		next()
	}
})()
