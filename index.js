var path = require('path');
var bower = require('bower');
var bowerModules;

function readBowerModules(cb) {
  bower.commands.list({map: true})
    .on('end', function (map) {
      bowerModules = map;
      cb(null, map);
    });
}

function bowerRequire(moduleName) {
  if (typeof bowerModules === 'undefined') throw new Error('You must call the #init method first');
  if (moduleName && moduleName in bowerModules.dependencies) {
    var module = bowerModules.dependencies[moduleName];
    if (module) {
      var mainModule;
      var pkgMeta = module.pkgMeta;
      if (pkgMeta && pkgMeta.main) {
        mainModule = Array.isArray(pkgMeta.main) ? pkgMeta.main[0] : pkgMeta.main;
      } else {
        // if 'main' wasn't specified by this component, let's try
        // guessing that the main file is moduleName.js
        mainModule = moduleName + '.js';
      }
      var fullModulePath = path.resolve(path.join(module.canonicalDir, mainModule));
      var relativeModulePath = './' + path.relative(path.dirname(moduleName), fullModulePath);
      return relativeModulePath;
    }
  }
}

module.exports = bowerRequire;
module.exports.init = readBowerModules;
