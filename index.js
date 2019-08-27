var _ = require("underscore"),
    child_process = require("child_process");

function init(path) {
  var obj = new R(path);
  _.bindAll(obj, "data", "call", "callSync");
  return obj;
}

function R(path) {
  this.d = {};
  this.path = path;
  this.options = {
    env: _.extend({DIRNAME: __dirname}, process.env),
    encoding: "utf8"
  };
  this.idCounter = 0;
  this.args = ["--vanilla", __dirname + "/R/launch.R"];
}

R.prototype.data = function() {
  for (var i = 0; i < arguments.length; i++) {
    this.d[++this.idCounter] = arguments[i];
  }
  return this;
};

R.prototype.call = function(_opts, _callback) {
  var callback = _callback || _opts;
  var opts = _.isFunction(_opts) ? {} : _opts;
  this.options.env.input = JSON.stringify([this.d, this.path, opts]);
  var child = child_process.spawn("Rscript", this.args, this.options);
  var body = "";
  var err = "";
  child.stderr.on("data", function(e){
    err += e;
  });
  child.stdout.on("data", function(d) {
    body += d;
  });
  child.on("close", function(code) {
    if(!err.length) err = null
    if(!body.length) body = null
    callback(err, JSON.parse(body));
  });
};

R.prototype.callSync = function(_opts) {
  var opts = _opts || {};
  this.options.env.input = JSON.stringify([this.d, this.path, opts]);
  var child = child_process.spawnSync("Rscript", this.args, this.options);
  var out = {
    stdout: child.stdout ? JSON.parse(child.stdout) : null,
    stderr: child.stderr ? child.stderr : null
  }
  return(out);
};

module.exports = init;
