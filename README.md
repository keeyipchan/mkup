# mkup
Generate DOM elements from simple one-liners.

## Needs
* jQuery

## How to use
mkup.dom = function(oneliner, onFinish) returns $fragment
mkup.obj = function(onliner, onFinish) returns Object

### 
```js
mkup.dom('article(form#blah.section.with-tools(a.edit a.clone a.purge(span.your-name)) .section.with-txt(textarea) .section.with-actions())',
	function($fragment) {
		$fragment.appendTo($('body'))
	})
	
mkup.obj('what(more less) article(form#blah.section.with-tools(a.edit a.clone a.purge(span.your-name)) .section.with-txt(textarea) .section.with-actions())',
	function(obj) {
		console.dir(obj)
		console.log(JSON.stringify(obj))
	})
```

mkup.dom's selector syntax: [tag] [id] [classes]
```js
/^(.*?)(#.*?)?(\..*?)?$/
```

mkup.obj's selector syntax: anything except whitespace
```js
\S
```
