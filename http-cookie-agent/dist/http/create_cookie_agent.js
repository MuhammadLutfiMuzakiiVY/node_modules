"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCookieAgent = createCookieAgent;
var _nodeUrl = _interopRequireDefault(require("node:url"));
var _create_cookie_header_value = require("../utils/create_cookie_header_value");
var _save_cookies_from_header = require("../utils/save_cookies_from_header");
var _validate_cookie_options = require("../utils/validate_cookie_options");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const kCookieOptions = Symbol('cookieOptions');
const kReimplicitHeader = Symbol('reimplicitHeader');
const kRecreateFirstChunk = Symbol('recreateFirstChunk');
const kOverrideRequest = Symbol('overrideRequest');
function createCookieAgent(BaseAgentClass) {
  // @ts-expect-error -- BaseAgentClass is type definition.
  class CookieAgent extends BaseAgentClass {
    constructor(...params) {
      const {
        cookies: cookieOptions
      } = params.find(opt => {
        return opt != null && typeof opt === 'object' && 'cookies' in opt;
      }) ?? {};
      super(...params);
      if (cookieOptions) {
        (0, _validate_cookie_options.validateCookieOptions)(cookieOptions);
      }
      this[kCookieOptions] = cookieOptions;
    }
    [kReimplicitHeader](req) {
      const _headerSent = req._headerSent;
      req._header = null;
      req._implicitHeader();
      req._headerSent = _headerSent;
    }
    [kRecreateFirstChunk](req) {
      const firstChunk = req.outputData[0];
      if (req._header == null || firstChunk == null) {
        return;
      }
      const prevData = firstChunk.data;
      const prevHeaderLength = prevData.indexOf('\r\n\r\n');
      if (prevHeaderLength === -1) {
        firstChunk.data = req._header;
      } else {
        firstChunk.data = `${req._header}${prevData.slice(prevHeaderLength + 4)}`;
      }
      const diffSize = firstChunk.data.length - prevData.length;
      req.outputSize += diffSize;
      req._onPendingData(diffSize);
    }
    [kOverrideRequest](req, requestUrl, cookieOptions) {
      const _implicitHeader = req._implicitHeader.bind(req);
      req._implicitHeader = () => {
        try {
          const cookieHeader = (0, _create_cookie_header_value.createCookieHeaderValue)({
            cookieOptions,
            passedValues: [req.getHeader('Cookie')].flat(),
            requestUrl
          });
          if (cookieHeader) {
            req.setHeader('Cookie', cookieHeader);
          }
        } catch (err) {
          req.destroy(err);
          return;
        }
        _implicitHeader();
      };
      const emit = req.emit.bind(req);
      req.emit = (event, ...args) => {
        if (event === 'response') {
          try {
            const res = args[0];
            (0, _save_cookies_from_header.saveCookiesFromHeader)({
              cookieOptions,
              cookies: res.headers['set-cookie'],
              requestUrl
            });
          } catch (err) {
            req.destroy(err);
            return false;
          }
        }
        return emit(event, ...args);
      };
    }
    addRequest(req, options) {
      const cookieOptions = this[kCookieOptions];
      if (cookieOptions) {
        try {
          const requestUrl = _nodeUrl.default.format({
            host: req.host,
            pathname: req.path,
            protocol: req.protocol
          });
          this[kOverrideRequest](req, requestUrl, cookieOptions);
          if (req._header != null) {
            this[kReimplicitHeader](req);
          }
          if (req._headerSent) {
            this[kRecreateFirstChunk](req);
          }
        } catch (err) {
          req.destroy(err);
          return;
        }
      }
      super.addRequest(req, options);
    }
  }
  return CookieAgent;
}