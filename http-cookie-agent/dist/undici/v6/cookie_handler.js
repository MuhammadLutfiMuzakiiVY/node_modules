"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CookieHandler = void 0;
var _undici = require("undici");
var _convert_to_headers_object = require("../../utils/convert_to_headers_object");
var _save_cookies_from_header = require("../../utils/save_cookies_from_header");
/* eslint-disable @typescript-eslint/no-deprecated */
/* global Buffer */

const kRequestUrl = Symbol('requestUrl');
const kCookieOptions = Symbol('cookieOptions');
const kHandlers = Symbol('handlers');
class CookieHandler {
  constructor(requestUrl, cookieOptions, handlers) {
    this[kRequestUrl] = requestUrl;
    this[kCookieOptions] = cookieOptions;
    this[kHandlers] = handlers;
  }
  onResponseStarted = () => {
    this[kHandlers].onResponseStarted?.();
  };
  onConnect = abort => {
    this[kHandlers].onConnect?.(abort);
  };
  onError = err => {
    this[kHandlers].onError?.(err);
  };
  onUpgrade = (statusCode, headers, socket) => {
    this[kHandlers].onUpgrade?.(statusCode, headers, socket);
  };
  onHeaders = (statusCode, _headers, resume, statusText) => {
    if (this[kHandlers].onHeaders == null) {
      throw new _undici.errors.InvalidArgumentError('invalid onHeaders method');
    }
    const headers = (0, _convert_to_headers_object.convertToHeadersObject)(_headers);
    (0, _save_cookies_from_header.saveCookiesFromHeader)({
      cookieOptions: this[kCookieOptions],
      cookies: headers['set-cookie'],
      requestUrl: this[kRequestUrl]
    });
    return this[kHandlers].onHeaders(statusCode, _headers, resume, statusText);
  };
  onData = chunk => {
    if (this[kHandlers].onData == null) {
      throw new _undici.errors.InvalidArgumentError('invalid onData method');
    }
    return this[kHandlers].onData(chunk);
  };
  onComplete = trailers => {
    this[kHandlers].onComplete?.(trailers);
  };
  onBodySent = (chunkSize, totalBytesSent) => {
    this[kHandlers].onBodySent?.(chunkSize, totalBytesSent);
  };
}
exports.CookieHandler = CookieHandler;