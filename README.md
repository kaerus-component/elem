elem
====

DOM Element wrapper

Usage
=====

```
<!doctype html>
<html>
	<head><title>Event tests</title></head>
	<script src="../build/build.js"></script>
<body>
<h1 id='header'>Elem tests</h1>
<div id="test">Test element</div>
<div id="test2">
	<ul class="something">
		<li id="cat">cat</li>
		<li id="dog">dog</li>
	</ul>
</div>
	<script>
		$ = require('elem');

		$('#test').html("Hello world!");

		$('#test2').on('click',function(e){alert('hello ' + e.id)});

	</script>
</body>
</html>
```
