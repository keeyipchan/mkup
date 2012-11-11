# mkup
Generate DOM elements from simple one-liners.

## Needs
* jQuery

## How to use
function mkup(oneliner, onFinish)

```js
mkup('article(form#blah.section.with-tools(a.edit a.clone a.purge(span.your-name)) .section.with-txt(textarea) .section.with-actions())',
	function($article)
	{
		$article.appendTo($('body'))
	}
)
```

Selector syntax: [tag] [id] [classes]
```js
/^(.*?)(#.*?)?(\..*?)?$/
```
