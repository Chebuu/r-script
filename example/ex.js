#!/usr/bin/env node
var R = require("r-script");

// sync
var out = R("example/ex-sync.R")
  .data("hello world", 20)
  .callSync();
console.log(out.stdout);
console.error(out.stderr);

// sync error
var out = R("example/ex-error.R")
  .data({message: 'Hello stderr'})
  .callSync();
console.log(out.stdout);
console.error(out.stderr);

// async
var attitude = JSON.parse(
  require("fs").readFileSync("example/attitude.json", "utf8"));

R("example/ex-async.R")
  .data({df: attitude, nGroups: 3, fxn: "mean" })
  .call(function(stderr, stdout) {
    if (stderr) console.error(stderr);
    console.log(stdout);
  });

// async error
R("example/ex-error.R")
  .data({message: 'Hello stderr'})
  .call(function(stderr, stdout) {
    if (stderr) console.error(stderr);
    console.log(stdout);
  });
