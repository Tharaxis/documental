#! /usr/bin/env node

const path = require("path");

require("ts-node").register({
  cwd: path.resolve(__dirname, "../")
});

require("../lib/index")
  .main(process.cwd())
  .then(() => process.exit());

process.stdin.resume();
