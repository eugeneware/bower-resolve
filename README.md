# bower-resolve

Find the relative path name of a bower module, for use with [browserify](https://github.com/substack/node-browserify) and [debowerify](https://github.com/eugeneware/debowerify).

[![build status](https://secure.travis-ci.org/eugeneware/bower-resolve.png)](http://travis-ci.org/eugeneware/bower-resolve)

## Installation

This module is installed via npm:

``` bash
$ npm install bower-resolve
```

## Example Usage

First, install some bower modules:

``` bash
$ bower install js-base64
```

Then to resolve the path of the main javascript file for a given bower module name:

``` js
var bowerResolve = require('bower-resolve');
bowerResolve.init(function () {
  bowerResolve('js-base64')
  // returns ./bower_components/js-base64/base64.js'
});
```

## Usage with browserify/debowerify

This is useful for generating stand-alone libraries with
[browserify](https://github.com/substack/node-browserify) with the
[debowerify](https://github.com/eugeneware/debowerify) transform:

Let's say you have installed angularjs and jquery using bower:

``` bash
$ bower install jquery
$ bower install angular
```

You can build out a common library that will contain the jquery and angular
libraries into a file called common.js like so:

``` js
// build out angular and jquery to a library file called common.js
var fs = require('fs');
var browserify = require('browserify');
var bowerResolve = require('bower-resolve');
bowerResolve.init(function () {
  var b = browserify();
  b.require(bowerResolve('angular'), { expose: 'angular' });
  b.require(bowerResolve('jquery'), { expose: 'jquery' });
  b.bundle().pipe(fs.createWriteStream('./common.js'));
});
```

Similarly, if you have some other client-side code that you want to rely on
this common code, you can use bowerResolve to help you there, by declaring them
as external dependencies:

``` js
// app.js
var angular = require('angular');
var jQuery = require('jquery');

jQuery(function ($) {
  console.log(angular);
});
```

Then build it out using browswerify and debowerify as so:

``` js
// build out app.js and use the angular and jquery libs from common.js
var fs = require('fs');
var browserify = require('browserify');
var bowerResolve = require('bower-resolve');
bowerResolve.init(function () {
  var b = browserify(['./app.js']);
  b.external(bowerResolve('angular'));
  b.external(bowerResolve('jquery'));
  b.transform('debowerify');
  b.bundle().pipe(fs.createWriteStream('./bundle.js'));
});
```

Then you'll have `common.js` that will have your shared code, and `bundle.js`
will have your client code.

Then you can use them together from your HTML app as follows:

``` html
<!DOCTYPE html>
<html>
  <head>
    <title>Hello, bower</title>
  </head>
  <body>
    <script type="text/javascript" src="common.js"></script>
    <script type="text/javascript" src="bundle.js"></script>
  </body>
</html>
```
