# mkup
Generate dom or objects from simple one-liners.

## Needs
* jQuery

## How to use
<table>
	<tr><th>mkup.dom</th><td>function (oneliner, onFinish)</td><td>returns $fragment</td></tr>
	<tr><th>mkup.obj</th><td>function (oneliner, onFinish)</td><td>returns Object</td></tr>
	<tr><td colspan=3>
		<pre>mkup.obj('one(a(a1 ab2)) two(b)')</pre>
		Result: <code>{ one:{ a:{ a1:{}, a2:{} } }, two:{ b:{} } }</code>
	</td></tr>
</table>

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

**mkup.dom selector syntax**: [tag] [id] [classes]
```js
/^(.*?)(#.*?)?(\..*?)?$/
```

**mkup.obj selector syntax**: anything except whitespace
```js
/^\S+$/
```
