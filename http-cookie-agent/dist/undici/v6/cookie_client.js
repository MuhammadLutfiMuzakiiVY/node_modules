"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CookieClient = void 0;
exports.createCookieClient = createCookieClient;
var _undici = require("undici");
var _symbols = _interopRequireDefault(require("undici/lib/core/symbols"));
var _convert_to_headers_object = require("../../utils/convert_to_headers_object");
var _create_cookie_header_value = require("../../utils/create_cookie_header_value");
var _validate_cookie_options = require("../../utils/validate_cookie_options");
var _cookie_handler = require("./cookie_handler");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const kCookieOptions = Symbol('cookieOptions');
function createCookieClient(BaseClientClass) {
  // @ts-expect-error -- BaseClientClass is type definition.
  class CookieClient extends BaseClientClass {
    constructor(url, {
      cookies: cookieOpts,
      ...options
    } = {}) {
      super(url, options);
      if (cookieOpts) {
        (0, _validate_cookie_options.validateCookieOptions)(cookieOpts);
        this[kCookieOptions] = cookieOpts;
      }
    }
    [_symbols.default.kDispatch](opts, handler) {
      const {
        maxRedirections = this[_symbols.default.kMaxRedirections]
      } = opts;
      if (maxRedirections) {
        opts = {
          ...opts,
          maxRedirections: 0
        };
        handler = new _undici.RedirectHandler(this, maxRedirections, opts, handler, false);
      }
      const cookieOptions = this[kCookieOptions];
      if (cookieOptions) {
        const origin = opts.origin || this[_symbols.default.kUrl].origin;
        const requestUrl = new URL(opts.path, origin).toString();
        const headers = (0, _convert_to_headers_object.convertToHeadersObject)(opts.headers);
        const cookieHeader = (0, _create_cookie_header_value.createCookieHeaderValue)({
          cookieOptions,
          passedValues: [headers['cookie']].flat(),
          requestUrl
        });
        if (cookieHeader) {
          headers['cookie'] = cookieHeader;
        }
        opts = {
          ...opts,
          headers
        };
        handler = new _cookie_handler.CookieHandler(requestUrl, cookieOptions, handler);
      }
      return super[_symbols.default.kDispatch](opts, handler);
    }
  }
  return CookieClient;
}
const CookieClient = exports.CookieClient = createCookieClient(_undici.Client);