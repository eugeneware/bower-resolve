var expect = require('expect.js'),
    bowerResolve = require('..');

describe('bower-resolve', function() {
  it('should be able to resolve to a bower component', function(done) {
    bowerResolve.init(function () {
      expect(bowerResolve('js-base64')).to.equal('./bower_components/js-base64/base64.js');
      done();
    });
  });
});
