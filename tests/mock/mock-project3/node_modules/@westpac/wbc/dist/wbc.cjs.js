'use strict';

if (process.env.NODE_ENV === "production") {
  module.exports = require("./wbc.cjs.prod.js");
} else {
  module.exports = require("./wbc.cjs.dev.js");
}
