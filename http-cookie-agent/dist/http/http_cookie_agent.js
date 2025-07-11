"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HttpCookieAgent = void 0;
var _nodeHttp = _interopRequireDefault(require("node:http"));
var _create_cookie_agent = require("./create_cookie_agent");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const HttpCookieAgent = exports.HttpCookieAgent = (0, _create_cookie_agent.createCookieAgent)(_nodeHttp.default.Agent);