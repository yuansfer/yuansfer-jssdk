/*!
 * Yuansfer v1.0.0
 * (c) 2020-2021 yuansfer
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Yuansfer = factory());
}(this, (function () { 'use strict';

  var bind = function bind(fn, thisArg) {
    return function wrap() {
      var args = new Array(arguments.length);
      for (var i = 0; i < args.length; i++) {
        args[i] = arguments[i];
      }
      return fn.apply(thisArg, args);
    };
  };

  /*global toString:true*/

  // utils is a library of generic helper functions non-specific to axios

  var toString = Object.prototype.toString;

  /**
   * Determine if a value is an Array
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is an Array, otherwise false
   */
  function isArray(val) {
    return toString.call(val) === '[object Array]';
  }

  /**
   * Determine if a value is undefined
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if the value is undefined, otherwise false
   */
  function isUndefined(val) {
    return typeof val === 'undefined';
  }

  /**
   * Determine if a value is a Buffer
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Buffer, otherwise false
   */
  function isBuffer(val) {
    return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
      && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
  }

  /**
   * Determine if a value is an ArrayBuffer
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is an ArrayBuffer, otherwise false
   */
  function isArrayBuffer(val) {
    return toString.call(val) === '[object ArrayBuffer]';
  }

  /**
   * Determine if a value is a FormData
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is an FormData, otherwise false
   */
  function isFormData(val) {
    return (typeof FormData !== 'undefined') && (val instanceof FormData);
  }

  /**
   * Determine if a value is a view on an ArrayBuffer
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
   */
  function isArrayBufferView(val) {
    var result;
    if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
      result = ArrayBuffer.isView(val);
    } else {
      result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
    }
    return result;
  }

  /**
   * Determine if a value is a String
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a String, otherwise false
   */
  function isString(val) {
    return typeof val === 'string';
  }

  /**
   * Determine if a value is a Number
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Number, otherwise false
   */
  function isNumber(val) {
    return typeof val === 'number';
  }

  /**
   * Determine if a value is an Object
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is an Object, otherwise false
   */
  function isObject(val) {
    return val !== null && typeof val === 'object';
  }

  /**
   * Determine if a value is a Date
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Date, otherwise false
   */
  function isDate(val) {
    return toString.call(val) === '[object Date]';
  }

  /**
   * Determine if a value is a File
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a File, otherwise false
   */
  function isFile(val) {
    return toString.call(val) === '[object File]';
  }

  /**
   * Determine if a value is a Blob
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Blob, otherwise false
   */
  function isBlob(val) {
    return toString.call(val) === '[object Blob]';
  }

  /**
   * Determine if a value is a Function
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Function, otherwise false
   */
  function isFunction(val) {
    return toString.call(val) === '[object Function]';
  }

  /**
   * Determine if a value is a Stream
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Stream, otherwise false
   */
  function isStream(val) {
    return isObject(val) && isFunction(val.pipe);
  }

  /**
   * Determine if a value is a URLSearchParams object
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a URLSearchParams object, otherwise false
   */
  function isURLSearchParams(val) {
    return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
  }

  /**
   * Trim excess whitespace off the beginning and end of a string
   *
   * @param {String} str The String to trim
   * @returns {String} The String freed of excess whitespace
   */
  function trim(str) {
    return str.replace(/^\s*/, '').replace(/\s*$/, '');
  }

  /**
   * Determine if we're running in a standard browser environment
   *
   * This allows axios to run in a web worker, and react-native.
   * Both environments support XMLHttpRequest, but not fully standard globals.
   *
   * web workers:
   *  typeof window -> undefined
   *  typeof document -> undefined
   *
   * react-native:
   *  navigator.product -> 'ReactNative'
   * nativescript
   *  navigator.product -> 'NativeScript' or 'NS'
   */
  function isStandardBrowserEnv() {
    if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                             navigator.product === 'NativeScript' ||
                                             navigator.product === 'NS')) {
      return false;
    }
    return (
      typeof window !== 'undefined' &&
      typeof document !== 'undefined'
    );
  }

  /**
   * Iterate over an Array or an Object invoking a function for each item.
   *
   * If `obj` is an Array callback will be called passing
   * the value, index, and complete array for each item.
   *
   * If 'obj' is an Object callback will be called passing
   * the value, key, and complete object for each property.
   *
   * @param {Object|Array} obj The object to iterate
   * @param {Function} fn The callback to invoke for each item
   */
  function forEach(obj, fn) {
    // Don't bother if no value provided
    if (obj === null || typeof obj === 'undefined') {
      return;
    }

    // Force an array if not already something iterable
    if (typeof obj !== 'object') {
      /*eslint no-param-reassign:0*/
      obj = [obj];
    }

    if (isArray(obj)) {
      // Iterate over array values
      for (var i = 0, l = obj.length; i < l; i++) {
        fn.call(null, obj[i], i, obj);
      }
    } else {
      // Iterate over object keys
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          fn.call(null, obj[key], key, obj);
        }
      }
    }
  }

  /**
   * Accepts varargs expecting each argument to be an object, then
   * immutably merges the properties of each object and returns result.
   *
   * When multiple objects contain the same key the later object in
   * the arguments list will take precedence.
   *
   * Example:
   *
   * ```js
   * var result = merge({foo: 123}, {foo: 456});
   * console.log(result.foo); // outputs 456
   * ```
   *
   * @param {Object} obj1 Object to merge
   * @returns {Object} Result of all merge properties
   */
  function merge(/* obj1, obj2, obj3, ... */) {
    var result = {};
    function assignValue(val, key) {
      if (typeof result[key] === 'object' && typeof val === 'object') {
        result[key] = merge(result[key], val);
      } else {
        result[key] = val;
      }
    }

    for (var i = 0, l = arguments.length; i < l; i++) {
      forEach(arguments[i], assignValue);
    }
    return result;
  }

  /**
   * Function equal to merge with the difference being that no reference
   * to original objects is kept.
   *
   * @see merge
   * @param {Object} obj1 Object to merge
   * @returns {Object} Result of all merge properties
   */
  function deepMerge(/* obj1, obj2, obj3, ... */) {
    var result = {};
    function assignValue(val, key) {
      if (typeof result[key] === 'object' && typeof val === 'object') {
        result[key] = deepMerge(result[key], val);
      } else if (typeof val === 'object') {
        result[key] = deepMerge({}, val);
      } else {
        result[key] = val;
      }
    }

    for (var i = 0, l = arguments.length; i < l; i++) {
      forEach(arguments[i], assignValue);
    }
    return result;
  }

  /**
   * Extends object a by mutably adding to it the properties of object b.
   *
   * @param {Object} a The object to be extended
   * @param {Object} b The object to copy properties from
   * @param {Object} thisArg The object to bind function to
   * @return {Object} The resulting value of object a
   */
  function extend(a, b, thisArg) {
    forEach(b, function assignValue(val, key) {
      if (thisArg && typeof val === 'function') {
        a[key] = bind(val, thisArg);
      } else {
        a[key] = val;
      }
    });
    return a;
  }

  var utils = {
    isArray: isArray,
    isArrayBuffer: isArrayBuffer,
    isBuffer: isBuffer,
    isFormData: isFormData,
    isArrayBufferView: isArrayBufferView,
    isString: isString,
    isNumber: isNumber,
    isObject: isObject,
    isUndefined: isUndefined,
    isDate: isDate,
    isFile: isFile,
    isBlob: isBlob,
    isFunction: isFunction,
    isStream: isStream,
    isURLSearchParams: isURLSearchParams,
    isStandardBrowserEnv: isStandardBrowserEnv,
    forEach: forEach,
    merge: merge,
    deepMerge: deepMerge,
    extend: extend,
    trim: trim
  };

  function encode(val) {
    return encodeURIComponent(val).
      replace(/%40/gi, '@').
      replace(/%3A/gi, ':').
      replace(/%24/g, '$').
      replace(/%2C/gi, ',').
      replace(/%20/g, '+').
      replace(/%5B/gi, '[').
      replace(/%5D/gi, ']');
  }

  /**
   * Build a URL by appending params to the end
   *
   * @param {string} url The base of the url (e.g., http://www.google.com)
   * @param {object} [params] The params to be appended
   * @returns {string} The formatted url
   */
  var buildURL = function buildURL(url, params, paramsSerializer) {
    /*eslint no-param-reassign:0*/
    if (!params) {
      return url;
    }

    var serializedParams;
    if (paramsSerializer) {
      serializedParams = paramsSerializer(params);
    } else if (utils.isURLSearchParams(params)) {
      serializedParams = params.toString();
    } else {
      var parts = [];

      utils.forEach(params, function serialize(val, key) {
        if (val === null || typeof val === 'undefined') {
          return;
        }

        if (utils.isArray(val)) {
          key = key + '[]';
        } else {
          val = [val];
        }

        utils.forEach(val, function parseValue(v) {
          if (utils.isDate(v)) {
            v = v.toISOString();
          } else if (utils.isObject(v)) {
            v = JSON.stringify(v);
          }
          parts.push(encode(key) + '=' + encode(v));
        });
      });

      serializedParams = parts.join('&');
    }

    if (serializedParams) {
      var hashmarkIndex = url.indexOf('#');
      if (hashmarkIndex !== -1) {
        url = url.slice(0, hashmarkIndex);
      }

      url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
    }

    return url;
  };

  function InterceptorManager() {
    this.handlers = [];
  }

  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  InterceptorManager.prototype.use = function use(fulfilled, rejected) {
    this.handlers.push({
      fulfilled: fulfilled,
      rejected: rejected
    });
    return this.handlers.length - 1;
  };

  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   */
  InterceptorManager.prototype.eject = function eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  };

  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   */
  InterceptorManager.prototype.forEach = function forEach(fn) {
    utils.forEach(this.handlers, function forEachHandler(h) {
      if (h !== null) {
        fn(h);
      }
    });
  };

  var InterceptorManager_1 = InterceptorManager;

  /**
   * Transform the data for a request or a response
   *
   * @param {Object|String} data The data to be transformed
   * @param {Array} headers The headers for the request or response
   * @param {Array|Function} fns A single function or Array of functions
   * @returns {*} The resulting transformed data
   */
  var transformData = function transformData(data, headers, fns) {
    /*eslint no-param-reassign:0*/
    utils.forEach(fns, function transform(fn) {
      data = fn(data, headers);
    });

    return data;
  };

  var isCancel = function isCancel(value) {
    return !!(value && value.__CANCEL__);
  };

  var normalizeHeaderName = function normalizeHeaderName(headers, normalizedName) {
    utils.forEach(headers, function processHeader(value, name) {
      if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
        headers[normalizedName] = value;
        delete headers[name];
      }
    });
  };

  /**
   * Update an Error with the specified config, error code, and response.
   *
   * @param {Error} error The error to update.
   * @param {Object} config The config.
   * @param {string} [code] The error code (for example, 'ECONNABORTED').
   * @param {Object} [request] The request.
   * @param {Object} [response] The response.
   * @returns {Error} The error.
   */
  var enhanceError = function enhanceError(error, config, code, request, response) {
    error.config = config;
    if (code) {
      error.code = code;
    }

    error.request = request;
    error.response = response;
    error.isAxiosError = true;

    error.toJSON = function() {
      return {
        // Standard
        message: this.message,
        name: this.name,
        // Microsoft
        description: this.description,
        number: this.number,
        // Mozilla
        fileName: this.fileName,
        lineNumber: this.lineNumber,
        columnNumber: this.columnNumber,
        stack: this.stack,
        // Axios
        config: this.config,
        code: this.code
      };
    };
    return error;
  };

  /**
   * Create an Error with the specified message, config, error code, request and response.
   *
   * @param {string} message The error message.
   * @param {Object} config The config.
   * @param {string} [code] The error code (for example, 'ECONNABORTED').
   * @param {Object} [request] The request.
   * @param {Object} [response] The response.
   * @returns {Error} The created error.
   */
  var createError = function createError(message, config, code, request, response) {
    var error = new Error(message);
    return enhanceError(error, config, code, request, response);
  };

  /**
   * Resolve or reject a Promise based on response status.
   *
   * @param {Function} resolve A function that resolves the promise.
   * @param {Function} reject A function that rejects the promise.
   * @param {object} response The response.
   */
  var settle = function settle(resolve, reject, response) {
    var validateStatus = response.config.validateStatus;
    if (!validateStatus || validateStatus(response.status)) {
      resolve(response);
    } else {
      reject(createError(
        'Request failed with status code ' + response.status,
        response.config,
        null,
        response.request,
        response
      ));
    }
  };

  /**
   * Determines whether the specified URL is absolute
   *
   * @param {string} url The URL to test
   * @returns {boolean} True if the specified URL is absolute, otherwise false
   */
  var isAbsoluteURL = function isAbsoluteURL(url) {
    // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
    // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
    // by any combination of letters, digits, plus, period, or hyphen.
    return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
  };

  /**
   * Creates a new URL by combining the specified URLs
   *
   * @param {string} baseURL The base URL
   * @param {string} relativeURL The relative URL
   * @returns {string} The combined URL
   */
  var combineURLs = function combineURLs(baseURL, relativeURL) {
    return relativeURL
      ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
      : baseURL;
  };

  /**
   * Creates a new URL by combining the baseURL with the requestedURL,
   * only when the requestedURL is not already an absolute URL.
   * If the requestURL is absolute, this function returns the requestedURL untouched.
   *
   * @param {string} baseURL The base URL
   * @param {string} requestedURL Absolute or relative URL to combine
   * @returns {string} The combined full path
   */
  var buildFullPath = function buildFullPath(baseURL, requestedURL) {
    if (baseURL && !isAbsoluteURL(requestedURL)) {
      return combineURLs(baseURL, requestedURL);
    }
    return requestedURL;
  };

  // Headers whose duplicates are ignored by node
  // c.f. https://nodejs.org/api/http.html#http_message_headers
  var ignoreDuplicateOf = [
    'age', 'authorization', 'content-length', 'content-type', 'etag',
    'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
    'last-modified', 'location', 'max-forwards', 'proxy-authorization',
    'referer', 'retry-after', 'user-agent'
  ];

  /**
   * Parse headers into an object
   *
   * ```
   * Date: Wed, 27 Aug 2014 08:58:49 GMT
   * Content-Type: application/json
   * Connection: keep-alive
   * Transfer-Encoding: chunked
   * ```
   *
   * @param {String} headers Headers needing to be parsed
   * @returns {Object} Headers parsed into an object
   */
  var parseHeaders = function parseHeaders(headers) {
    var parsed = {};
    var key;
    var val;
    var i;

    if (!headers) { return parsed; }

    utils.forEach(headers.split('\n'), function parser(line) {
      i = line.indexOf(':');
      key = utils.trim(line.substr(0, i)).toLowerCase();
      val = utils.trim(line.substr(i + 1));

      if (key) {
        if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
          return;
        }
        if (key === 'set-cookie') {
          parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
        } else {
          parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
        }
      }
    });

    return parsed;
  };

  var isURLSameOrigin = (
    utils.isStandardBrowserEnv() ?

    // Standard browser envs have full support of the APIs needed to test
    // whether the request URL is of the same origin as current location.
      (function standardBrowserEnv() {
        var msie = /(msie|trident)/i.test(navigator.userAgent);
        var urlParsingNode = document.createElement('a');
        var originURL;

        /**
      * Parse a URL to discover it's components
      *
      * @param {String} url The URL to be parsed
      * @returns {Object}
      */
        function resolveURL(url) {
          var href = url;

          if (msie) {
          // IE needs attribute set twice to normalize properties
            urlParsingNode.setAttribute('href', href);
            href = urlParsingNode.href;
          }

          urlParsingNode.setAttribute('href', href);

          // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
          return {
            href: urlParsingNode.href,
            protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
            host: urlParsingNode.host,
            search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
            hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
            hostname: urlParsingNode.hostname,
            port: urlParsingNode.port,
            pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
              urlParsingNode.pathname :
              '/' + urlParsingNode.pathname
          };
        }

        originURL = resolveURL(window.location.href);

        /**
      * Determine if a URL shares the same origin as the current location
      *
      * @param {String} requestURL The URL to test
      * @returns {boolean} True if URL shares the same origin, otherwise false
      */
        return function isURLSameOrigin(requestURL) {
          var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
          return (parsed.protocol === originURL.protocol &&
              parsed.host === originURL.host);
        };
      })() :

    // Non standard browser envs (web workers, react-native) lack needed support.
      (function nonStandardBrowserEnv() {
        return function isURLSameOrigin() {
          return true;
        };
      })()
  );

  var cookies = (
    utils.isStandardBrowserEnv() ?

    // Standard browser envs support document.cookie
      (function standardBrowserEnv() {
        return {
          write: function write(name, value, expires, path, domain, secure) {
            var cookie = [];
            cookie.push(name + '=' + encodeURIComponent(value));

            if (utils.isNumber(expires)) {
              cookie.push('expires=' + new Date(expires).toGMTString());
            }

            if (utils.isString(path)) {
              cookie.push('path=' + path);
            }

            if (utils.isString(domain)) {
              cookie.push('domain=' + domain);
            }

            if (secure === true) {
              cookie.push('secure');
            }

            document.cookie = cookie.join('; ');
          },

          read: function read(name) {
            var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
            return (match ? decodeURIComponent(match[3]) : null);
          },

          remove: function remove(name) {
            this.write(name, '', Date.now() - 86400000);
          }
        };
      })() :

    // Non standard browser env (web workers, react-native) lack needed support.
      (function nonStandardBrowserEnv() {
        return {
          write: function write() {},
          read: function read() { return null; },
          remove: function remove() {}
        };
      })()
  );

  var xhr = function xhrAdapter(config) {
    return new Promise(function dispatchXhrRequest(resolve, reject) {
      var requestData = config.data;
      var requestHeaders = config.headers;

      if (utils.isFormData(requestData)) {
        delete requestHeaders['Content-Type']; // Let the browser set it
      }

      var request = new XMLHttpRequest();

      // HTTP basic authentication
      if (config.auth) {
        var username = config.auth.username || '';
        var password = config.auth.password || '';
        requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
      }

      var fullPath = buildFullPath(config.baseURL, config.url);
      request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

      // Set the request timeout in MS
      request.timeout = config.timeout;

      // Listen for ready state
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }

        // Prepare the response
        var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
        var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
        var response = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config: config,
          request: request
        };

        settle(resolve, reject, response);

        // Clean up request
        request = null;
      };

      // Handle browser request cancellation (as opposed to a manual cancellation)
      request.onabort = function handleAbort() {
        if (!request) {
          return;
        }

        reject(createError('Request aborted', config, 'ECONNABORTED', request));

        // Clean up request
        request = null;
      };

      // Handle low level network errors
      request.onerror = function handleError() {
        // Real errors are hidden from us by the browser
        // onerror should only fire if it's a network error
        reject(createError('Network Error', config, null, request));

        // Clean up request
        request = null;
      };

      // Handle timeout
      request.ontimeout = function handleTimeout() {
        var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
        if (config.timeoutErrorMessage) {
          timeoutErrorMessage = config.timeoutErrorMessage;
        }
        reject(createError(timeoutErrorMessage, config, 'ECONNABORTED',
          request));

        // Clean up request
        request = null;
      };

      // Add xsrf header
      // This is only done if running in a standard browser environment.
      // Specifically not if we're in a web worker, or react-native.
      if (utils.isStandardBrowserEnv()) {
        var cookies$1 = cookies;

        // Add xsrf header
        var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
          cookies$1.read(config.xsrfCookieName) :
          undefined;

        if (xsrfValue) {
          requestHeaders[config.xsrfHeaderName] = xsrfValue;
        }
      }

      // Add headers to the request
      if ('setRequestHeader' in request) {
        utils.forEach(requestHeaders, function setRequestHeader(val, key) {
          if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
            // Remove Content-Type if data is undefined
            delete requestHeaders[key];
          } else {
            // Otherwise add header to the request
            request.setRequestHeader(key, val);
          }
        });
      }

      // Add withCredentials to request if needed
      if (!utils.isUndefined(config.withCredentials)) {
        request.withCredentials = !!config.withCredentials;
      }

      // Add responseType to request if needed
      if (config.responseType) {
        try {
          request.responseType = config.responseType;
        } catch (e) {
          // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
          // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
          if (config.responseType !== 'json') {
            throw e;
          }
        }
      }

      // Handle progress if needed
      if (typeof config.onDownloadProgress === 'function') {
        request.addEventListener('progress', config.onDownloadProgress);
      }

      // Not all browsers support upload events
      if (typeof config.onUploadProgress === 'function' && request.upload) {
        request.upload.addEventListener('progress', config.onUploadProgress);
      }

      if (config.cancelToken) {
        // Handle cancellation
        config.cancelToken.promise.then(function onCanceled(cancel) {
          if (!request) {
            return;
          }

          request.abort();
          reject(cancel);
          // Clean up request
          request = null;
        });
      }

      if (requestData === undefined) {
        requestData = null;
      }

      // Send the request
      request.send(requestData);
    });
  };

  var DEFAULT_CONTENT_TYPE = {
    'Content-Type': 'application/x-www-form-urlencoded'
  };

  function setContentTypeIfUnset(headers, value) {
    if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
      headers['Content-Type'] = value;
    }
  }

  function getDefaultAdapter() {
    var adapter;
    if (typeof XMLHttpRequest !== 'undefined') {
      // For browsers use XHR adapter
      adapter = xhr;
    } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
      // For node use HTTP adapter
      adapter = xhr;
    }
    return adapter;
  }

  var defaults = {
    adapter: getDefaultAdapter(),

    transformRequest: [function transformRequest(data, headers) {
      normalizeHeaderName(headers, 'Accept');
      normalizeHeaderName(headers, 'Content-Type');
      if (utils.isFormData(data) ||
        utils.isArrayBuffer(data) ||
        utils.isBuffer(data) ||
        utils.isStream(data) ||
        utils.isFile(data) ||
        utils.isBlob(data)
      ) {
        return data;
      }
      if (utils.isArrayBufferView(data)) {
        return data.buffer;
      }
      if (utils.isURLSearchParams(data)) {
        setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
        return data.toString();
      }
      if (utils.isObject(data)) {
        setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
        return JSON.stringify(data);
      }
      return data;
    }],

    transformResponse: [function transformResponse(data) {
      /*eslint no-param-reassign:0*/
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch (e) { /* Ignore */ }
      }
      return data;
    }],

    /**
     * A timeout in milliseconds to abort a request. If set to 0 (default) a
     * timeout is not created.
     */
    timeout: 0,

    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',

    maxContentLength: -1,

    validateStatus: function validateStatus(status) {
      return status >= 200 && status < 300;
    }
  };

  defaults.headers = {
    common: {
      'Accept': 'application/json, text/plain, */*'
    }
  };

  utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
    defaults.headers[method] = {};
  });

  utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
    defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
  });

  var defaults_1 = defaults;

  /**
   * Throws a `Cancel` if cancellation has been requested.
   */
  function throwIfCancellationRequested(config) {
    if (config.cancelToken) {
      config.cancelToken.throwIfRequested();
    }
  }

  /**
   * Dispatch a request to the server using the configured adapter.
   *
   * @param {object} config The config that is to be used for the request
   * @returns {Promise} The Promise to be fulfilled
   */
  var dispatchRequest = function dispatchRequest(config) {
    throwIfCancellationRequested(config);

    // Ensure headers exist
    config.headers = config.headers || {};

    // Transform request data
    config.data = transformData(
      config.data,
      config.headers,
      config.transformRequest
    );

    // Flatten headers
    config.headers = utils.merge(
      config.headers.common || {},
      config.headers[config.method] || {},
      config.headers
    );

    utils.forEach(
      ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
      function cleanHeaderConfig(method) {
        delete config.headers[method];
      }
    );

    var adapter = config.adapter || defaults_1.adapter;

    return adapter(config).then(function onAdapterResolution(response) {
      throwIfCancellationRequested(config);

      // Transform response data
      response.data = transformData(
        response.data,
        response.headers,
        config.transformResponse
      );

      return response;
    }, function onAdapterRejection(reason) {
      if (!isCancel(reason)) {
        throwIfCancellationRequested(config);

        // Transform response data
        if (reason && reason.response) {
          reason.response.data = transformData(
            reason.response.data,
            reason.response.headers,
            config.transformResponse
          );
        }
      }

      return Promise.reject(reason);
    });
  };

  /**
   * Config-specific merge-function which creates a new config-object
   * by merging two configuration objects together.
   *
   * @param {Object} config1
   * @param {Object} config2
   * @returns {Object} New object resulting from merging config2 to config1
   */
  var mergeConfig = function mergeConfig(config1, config2) {
    // eslint-disable-next-line no-param-reassign
    config2 = config2 || {};
    var config = {};

    var valueFromConfig2Keys = ['url', 'method', 'params', 'data'];
    var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy'];
    var defaultToConfig2Keys = [
      'baseURL', 'url', 'transformRequest', 'transformResponse', 'paramsSerializer',
      'timeout', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
      'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress',
      'maxContentLength', 'validateStatus', 'maxRedirects', 'httpAgent',
      'httpsAgent', 'cancelToken', 'socketPath'
    ];

    utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
      if (typeof config2[prop] !== 'undefined') {
        config[prop] = config2[prop];
      }
    });

    utils.forEach(mergeDeepPropertiesKeys, function mergeDeepProperties(prop) {
      if (utils.isObject(config2[prop])) {
        config[prop] = utils.deepMerge(config1[prop], config2[prop]);
      } else if (typeof config2[prop] !== 'undefined') {
        config[prop] = config2[prop];
      } else if (utils.isObject(config1[prop])) {
        config[prop] = utils.deepMerge(config1[prop]);
      } else if (typeof config1[prop] !== 'undefined') {
        config[prop] = config1[prop];
      }
    });

    utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
      if (typeof config2[prop] !== 'undefined') {
        config[prop] = config2[prop];
      } else if (typeof config1[prop] !== 'undefined') {
        config[prop] = config1[prop];
      }
    });

    var axiosKeys = valueFromConfig2Keys
      .concat(mergeDeepPropertiesKeys)
      .concat(defaultToConfig2Keys);

    var otherKeys = Object
      .keys(config2)
      .filter(function filterAxiosKeys(key) {
        return axiosKeys.indexOf(key) === -1;
      });

    utils.forEach(otherKeys, function otherKeysDefaultToConfig2(prop) {
      if (typeof config2[prop] !== 'undefined') {
        config[prop] = config2[prop];
      } else if (typeof config1[prop] !== 'undefined') {
        config[prop] = config1[prop];
      }
    });

    return config;
  };

  /**
   * Create a new instance of Axios
   *
   * @param {Object} instanceConfig The default config for the instance
   */
  function Axios(instanceConfig) {
    this.defaults = instanceConfig;
    this.interceptors = {
      request: new InterceptorManager_1(),
      response: new InterceptorManager_1()
    };
  }

  /**
   * Dispatch a request
   *
   * @param {Object} config The config specific for this request (merged with this.defaults)
   */
  Axios.prototype.request = function request(config) {
    /*eslint no-param-reassign:0*/
    // Allow for axios('example/url'[, config]) a la fetch API
    if (typeof config === 'string') {
      config = arguments[1] || {};
      config.url = arguments[0];
    } else {
      config = config || {};
    }

    config = mergeConfig(this.defaults, config);

    // Set config.method
    if (config.method) {
      config.method = config.method.toLowerCase();
    } else if (this.defaults.method) {
      config.method = this.defaults.method.toLowerCase();
    } else {
      config.method = 'get';
    }

    // Hook up interceptors middleware
    var chain = [dispatchRequest, undefined];
    var promise = Promise.resolve(config);

    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      chain.unshift(interceptor.fulfilled, interceptor.rejected);
    });

    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      chain.push(interceptor.fulfilled, interceptor.rejected);
    });

    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
  };

  Axios.prototype.getUri = function getUri(config) {
    config = mergeConfig(this.defaults, config);
    return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
  };

  // Provide aliases for supported request methods
  utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
    /*eslint func-names:0*/
    Axios.prototype[method] = function(url, config) {
      return this.request(utils.merge(config || {}, {
        method: method,
        url: url
      }));
    };
  });

  utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
    /*eslint func-names:0*/
    Axios.prototype[method] = function(url, data, config) {
      return this.request(utils.merge(config || {}, {
        method: method,
        url: url,
        data: data
      }));
    };
  });

  var Axios_1 = Axios;

  /**
   * A `Cancel` is an object that is thrown when an operation is canceled.
   *
   * @class
   * @param {string=} message The message.
   */
  function Cancel(message) {
    this.message = message;
  }

  Cancel.prototype.toString = function toString() {
    return 'Cancel' + (this.message ? ': ' + this.message : '');
  };

  Cancel.prototype.__CANCEL__ = true;

  var Cancel_1 = Cancel;

  /**
   * A `CancelToken` is an object that can be used to request cancellation of an operation.
   *
   * @class
   * @param {Function} executor The executor function.
   */
  function CancelToken(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError('executor must be a function.');
    }

    var resolvePromise;
    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });

    var token = this;
    executor(function cancel(message) {
      if (token.reason) {
        // Cancellation has already been requested
        return;
      }

      token.reason = new Cancel_1(message);
      resolvePromise(token.reason);
    });
  }

  /**
   * Throws a `Cancel` if cancellation has been requested.
   */
  CancelToken.prototype.throwIfRequested = function throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  };

  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  CancelToken.source = function source() {
    var cancel;
    var token = new CancelToken(function executor(c) {
      cancel = c;
    });
    return {
      token: token,
      cancel: cancel
    };
  };

  var CancelToken_1 = CancelToken;

  /**
   * Syntactic sugar for invoking a function and expanding an array for arguments.
   *
   * Common use case would be to use `Function.prototype.apply`.
   *
   *  ```js
   *  function f(x, y, z) {}
   *  var args = [1, 2, 3];
   *  f.apply(null, args);
   *  ```
   *
   * With `spread` this example can be re-written.
   *
   *  ```js
   *  spread(function(x, y, z) {})([1, 2, 3]);
   *  ```
   *
   * @param {Function} callback
   * @returns {Function}
   */
  var spread = function spread(callback) {
    return function wrap(arr) {
      return callback.apply(null, arr);
    };
  };

  /**
   * Create an instance of Axios
   *
   * @param {Object} defaultConfig The default config for the instance
   * @return {Axios} A new instance of Axios
   */
  function createInstance(defaultConfig) {
    var context = new Axios_1(defaultConfig);
    var instance = bind(Axios_1.prototype.request, context);

    // Copy axios.prototype to instance
    utils.extend(instance, Axios_1.prototype, context);

    // Copy context to instance
    utils.extend(instance, context);

    return instance;
  }

  // Create the default instance to be exported
  var axios = createInstance(defaults_1);

  // Expose Axios class to allow class inheritance
  axios.Axios = Axios_1;

  // Factory for creating new instances
  axios.create = function create(instanceConfig) {
    return createInstance(mergeConfig(axios.defaults, instanceConfig));
  };

  // Expose Cancel & CancelToken
  axios.Cancel = Cancel_1;
  axios.CancelToken = CancelToken_1;
  axios.isCancel = isCancel;

  // Expose all/spread
  axios.all = function all(promises) {
    return Promise.all(promises);
  };
  axios.spread = spread;

  var axios_1 = axios;

  // Allow use of default import syntax in TypeScript
  var default_1 = axios;
  axios_1.default = default_1;

  var axios$1 = axios_1;

  var has = Object.prototype.hasOwnProperty;
  var isArray$1 = Array.isArray;

  var hexTable = (function () {
      var array = [];
      for (var i = 0; i < 256; ++i) {
          array.push('%' + ((i < 16 ? '0' : '') + i.toString(16)).toUpperCase());
      }

      return array;
  }());

  var compactQueue = function compactQueue(queue) {
      while (queue.length > 1) {
          var item = queue.pop();
          var obj = item.obj[item.prop];

          if (isArray$1(obj)) {
              var compacted = [];

              for (var j = 0; j < obj.length; ++j) {
                  if (typeof obj[j] !== 'undefined') {
                      compacted.push(obj[j]);
                  }
              }

              item.obj[item.prop] = compacted;
          }
      }
  };

  var arrayToObject = function arrayToObject(source, options) {
      var obj = options && options.plainObjects ? Object.create(null) : {};
      for (var i = 0; i < source.length; ++i) {
          if (typeof source[i] !== 'undefined') {
              obj[i] = source[i];
          }
      }

      return obj;
  };

  var merge$1 = function merge(target, source, options) {
      /* eslint no-param-reassign: 0 */
      if (!source) {
          return target;
      }

      if (typeof source !== 'object') {
          if (isArray$1(target)) {
              target.push(source);
          } else if (target && typeof target === 'object') {
              if ((options && (options.plainObjects || options.allowPrototypes)) || !has.call(Object.prototype, source)) {
                  target[source] = true;
              }
          } else {
              return [target, source];
          }

          return target;
      }

      if (!target || typeof target !== 'object') {
          return [target].concat(source);
      }

      var mergeTarget = target;
      if (isArray$1(target) && !isArray$1(source)) {
          mergeTarget = arrayToObject(target, options);
      }

      if (isArray$1(target) && isArray$1(source)) {
          source.forEach(function (item, i) {
              if (has.call(target, i)) {
                  var targetItem = target[i];
                  if (targetItem && typeof targetItem === 'object' && item && typeof item === 'object') {
                      target[i] = merge(targetItem, item, options);
                  } else {
                      target.push(item);
                  }
              } else {
                  target[i] = item;
              }
          });
          return target;
      }

      return Object.keys(source).reduce(function (acc, key) {
          var value = source[key];

          if (has.call(acc, key)) {
              acc[key] = merge(acc[key], value, options);
          } else {
              acc[key] = value;
          }
          return acc;
      }, mergeTarget);
  };

  var assign = function assignSingleSource(target, source) {
      return Object.keys(source).reduce(function (acc, key) {
          acc[key] = source[key];
          return acc;
      }, target);
  };

  var decode = function (str, decoder, charset) {
      var strWithoutPlus = str.replace(/\+/g, ' ');
      if (charset === 'iso-8859-1') {
          // unescape never throws, no try...catch needed:
          return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
      }
      // utf-8
      try {
          return decodeURIComponent(strWithoutPlus);
      } catch (e) {
          return strWithoutPlus;
      }
  };

  var encode$1 = function encode(str, defaultEncoder, charset) {
      // This code was originally written by Brian White (mscdex) for the io.js core querystring library.
      // It has been adapted here for stricter adherence to RFC 3986
      if (str.length === 0) {
          return str;
      }

      var string = str;
      if (typeof str === 'symbol') {
          string = Symbol.prototype.toString.call(str);
      } else if (typeof str !== 'string') {
          string = String(str);
      }

      if (charset === 'iso-8859-1') {
          return escape(string).replace(/%u[0-9a-f]{4}/gi, function ($0) {
              return '%26%23' + parseInt($0.slice(2), 16) + '%3B';
          });
      }

      var out = '';
      for (var i = 0; i < string.length; ++i) {
          var c = string.charCodeAt(i);

          if (
              c === 0x2D // -
              || c === 0x2E // .
              || c === 0x5F // _
              || c === 0x7E // ~
              || (c >= 0x30 && c <= 0x39) // 0-9
              || (c >= 0x41 && c <= 0x5A) // a-z
              || (c >= 0x61 && c <= 0x7A) // A-Z
          ) {
              out += string.charAt(i);
              continue;
          }

          if (c < 0x80) {
              out = out + hexTable[c];
              continue;
          }

          if (c < 0x800) {
              out = out + (hexTable[0xC0 | (c >> 6)] + hexTable[0x80 | (c & 0x3F)]);
              continue;
          }

          if (c < 0xD800 || c >= 0xE000) {
              out = out + (hexTable[0xE0 | (c >> 12)] + hexTable[0x80 | ((c >> 6) & 0x3F)] + hexTable[0x80 | (c & 0x3F)]);
              continue;
          }

          i += 1;
          c = 0x10000 + (((c & 0x3FF) << 10) | (string.charCodeAt(i) & 0x3FF));
          out += hexTable[0xF0 | (c >> 18)]
              + hexTable[0x80 | ((c >> 12) & 0x3F)]
              + hexTable[0x80 | ((c >> 6) & 0x3F)]
              + hexTable[0x80 | (c & 0x3F)];
      }

      return out;
  };

  var compact = function compact(value) {
      var queue = [{ obj: { o: value }, prop: 'o' }];
      var refs = [];

      for (var i = 0; i < queue.length; ++i) {
          var item = queue[i];
          var obj = item.obj[item.prop];

          var keys = Object.keys(obj);
          for (var j = 0; j < keys.length; ++j) {
              var key = keys[j];
              var val = obj[key];
              if (typeof val === 'object' && val !== null && refs.indexOf(val) === -1) {
                  queue.push({ obj: obj, prop: key });
                  refs.push(val);
              }
          }
      }

      compactQueue(queue);

      return value;
  };

  var isRegExp = function isRegExp(obj) {
      return Object.prototype.toString.call(obj) === '[object RegExp]';
  };

  var isBuffer$1 = function isBuffer(obj) {
      if (!obj || typeof obj !== 'object') {
          return false;
      }

      return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
  };

  var combine = function combine(a, b) {
      return [].concat(a, b);
  };

  var utils$1 = {
      arrayToObject: arrayToObject,
      assign: assign,
      combine: combine,
      compact: compact,
      decode: decode,
      encode: encode$1,
      isBuffer: isBuffer$1,
      isRegExp: isRegExp,
      merge: merge$1
  };

  var replace = String.prototype.replace;
  var percentTwenties = /%20/g;



  var Format = {
      RFC1738: 'RFC1738',
      RFC3986: 'RFC3986'
  };

  var formats = utils$1.assign(
      {
          'default': Format.RFC3986,
          formatters: {
              RFC1738: function (value) {
                  return replace.call(value, percentTwenties, '+');
              },
              RFC3986: function (value) {
                  return String(value);
              }
          }
      },
      Format
  );

  var has$1 = Object.prototype.hasOwnProperty;

  var arrayPrefixGenerators = {
      brackets: function brackets(prefix) {
          return prefix + '[]';
      },
      comma: 'comma',
      indices: function indices(prefix, key) {
          return prefix + '[' + key + ']';
      },
      repeat: function repeat(prefix) {
          return prefix;
      }
  };

  var isArray$2 = Array.isArray;
  var push = Array.prototype.push;
  var pushToArray = function (arr, valueOrArray) {
      push.apply(arr, isArray$2(valueOrArray) ? valueOrArray : [valueOrArray]);
  };

  var toISO = Date.prototype.toISOString;

  var defaultFormat = formats['default'];
  var defaults$1 = {
      addQueryPrefix: false,
      allowDots: false,
      charset: 'utf-8',
      charsetSentinel: false,
      delimiter: '&',
      encode: true,
      encoder: utils$1.encode,
      encodeValuesOnly: false,
      format: defaultFormat,
      formatter: formats.formatters[defaultFormat],
      // deprecated
      indices: false,
      serializeDate: function serializeDate(date) {
          return toISO.call(date);
      },
      skipNulls: false,
      strictNullHandling: false
  };

  var isNonNullishPrimitive = function isNonNullishPrimitive(v) {
      return typeof v === 'string'
          || typeof v === 'number'
          || typeof v === 'boolean'
          || typeof v === 'symbol'
          || typeof v === 'bigint';
  };

  var stringify = function stringify(
      object,
      prefix,
      generateArrayPrefix,
      strictNullHandling,
      skipNulls,
      encoder,
      filter,
      sort,
      allowDots,
      serializeDate,
      formatter,
      encodeValuesOnly,
      charset
  ) {
      var obj = object;
      if (typeof filter === 'function') {
          obj = filter(prefix, obj);
      } else if (obj instanceof Date) {
          obj = serializeDate(obj);
      } else if (generateArrayPrefix === 'comma' && isArray$2(obj)) {
          obj = obj.join(',');
      }

      if (obj === null) {
          if (strictNullHandling) {
              return encoder && !encodeValuesOnly ? encoder(prefix, defaults$1.encoder, charset, 'key') : prefix;
          }

          obj = '';
      }

      if (isNonNullishPrimitive(obj) || utils$1.isBuffer(obj)) {
          if (encoder) {
              var keyValue = encodeValuesOnly ? prefix : encoder(prefix, defaults$1.encoder, charset, 'key');
              return [formatter(keyValue) + '=' + formatter(encoder(obj, defaults$1.encoder, charset, 'value'))];
          }
          return [formatter(prefix) + '=' + formatter(String(obj))];
      }

      var values = [];

      if (typeof obj === 'undefined') {
          return values;
      }

      var objKeys;
      if (isArray$2(filter)) {
          objKeys = filter;
      } else {
          var keys = Object.keys(obj);
          objKeys = sort ? keys.sort(sort) : keys;
      }

      for (var i = 0; i < objKeys.length; ++i) {
          var key = objKeys[i];

          if (skipNulls && obj[key] === null) {
              continue;
          }

          if (isArray$2(obj)) {
              pushToArray(values, stringify(
                  obj[key],
                  typeof generateArrayPrefix === 'function' ? generateArrayPrefix(prefix, key) : prefix,
                  generateArrayPrefix,
                  strictNullHandling,
                  skipNulls,
                  encoder,
                  filter,
                  sort,
                  allowDots,
                  serializeDate,
                  formatter,
                  encodeValuesOnly,
                  charset
              ));
          } else {
              pushToArray(values, stringify(
                  obj[key],
                  prefix + (allowDots ? '.' + key : '[' + key + ']'),
                  generateArrayPrefix,
                  strictNullHandling,
                  skipNulls,
                  encoder,
                  filter,
                  sort,
                  allowDots,
                  serializeDate,
                  formatter,
                  encodeValuesOnly,
                  charset
              ));
          }
      }

      return values;
  };

  var normalizeStringifyOptions = function normalizeStringifyOptions(opts) {
      if (!opts) {
          return defaults$1;
      }

      if (opts.encoder !== null && opts.encoder !== undefined && typeof opts.encoder !== 'function') {
          throw new TypeError('Encoder has to be a function.');
      }

      var charset = opts.charset || defaults$1.charset;
      if (typeof opts.charset !== 'undefined' && opts.charset !== 'utf-8' && opts.charset !== 'iso-8859-1') {
          throw new TypeError('The charset option must be either utf-8, iso-8859-1, or undefined');
      }

      var format = formats['default'];
      if (typeof opts.format !== 'undefined') {
          if (!has$1.call(formats.formatters, opts.format)) {
              throw new TypeError('Unknown format option provided.');
          }
          format = opts.format;
      }
      var formatter = formats.formatters[format];

      var filter = defaults$1.filter;
      if (typeof opts.filter === 'function' || isArray$2(opts.filter)) {
          filter = opts.filter;
      }

      return {
          addQueryPrefix: typeof opts.addQueryPrefix === 'boolean' ? opts.addQueryPrefix : defaults$1.addQueryPrefix,
          allowDots: typeof opts.allowDots === 'undefined' ? defaults$1.allowDots : !!opts.allowDots,
          charset: charset,
          charsetSentinel: typeof opts.charsetSentinel === 'boolean' ? opts.charsetSentinel : defaults$1.charsetSentinel,
          delimiter: typeof opts.delimiter === 'undefined' ? defaults$1.delimiter : opts.delimiter,
          encode: typeof opts.encode === 'boolean' ? opts.encode : defaults$1.encode,
          encoder: typeof opts.encoder === 'function' ? opts.encoder : defaults$1.encoder,
          encodeValuesOnly: typeof opts.encodeValuesOnly === 'boolean' ? opts.encodeValuesOnly : defaults$1.encodeValuesOnly,
          filter: filter,
          formatter: formatter,
          serializeDate: typeof opts.serializeDate === 'function' ? opts.serializeDate : defaults$1.serializeDate,
          skipNulls: typeof opts.skipNulls === 'boolean' ? opts.skipNulls : defaults$1.skipNulls,
          sort: typeof opts.sort === 'function' ? opts.sort : null,
          strictNullHandling: typeof opts.strictNullHandling === 'boolean' ? opts.strictNullHandling : defaults$1.strictNullHandling
      };
  };

  var stringify_1 = function (object, opts) {
      var obj = object;
      var options = normalizeStringifyOptions(opts);

      var objKeys;
      var filter;

      if (typeof options.filter === 'function') {
          filter = options.filter;
          obj = filter('', obj);
      } else if (isArray$2(options.filter)) {
          filter = options.filter;
          objKeys = filter;
      }

      var keys = [];

      if (typeof obj !== 'object' || obj === null) {
          return '';
      }

      var arrayFormat;
      if (opts && opts.arrayFormat in arrayPrefixGenerators) {
          arrayFormat = opts.arrayFormat;
      } else if (opts && 'indices' in opts) {
          arrayFormat = opts.indices ? 'indices' : 'repeat';
      } else {
          arrayFormat = 'indices';
      }

      var generateArrayPrefix = arrayPrefixGenerators[arrayFormat];

      if (!objKeys) {
          objKeys = Object.keys(obj);
      }

      if (options.sort) {
          objKeys.sort(options.sort);
      }

      for (var i = 0; i < objKeys.length; ++i) {
          var key = objKeys[i];

          if (options.skipNulls && obj[key] === null) {
              continue;
          }
          pushToArray(keys, stringify(
              obj[key],
              key,
              generateArrayPrefix,
              options.strictNullHandling,
              options.skipNulls,
              options.encode ? options.encoder : null,
              options.filter,
              options.sort,
              options.allowDots,
              options.serializeDate,
              options.formatter,
              options.encodeValuesOnly,
              options.charset
          ));
      }

      var joined = keys.join(options.delimiter);
      var prefix = options.addQueryPrefix === true ? '?' : '';

      if (options.charsetSentinel) {
          if (options.charset === 'iso-8859-1') {
              // encodeURIComponent('&#10003;'), the "numeric entity" representation of a checkmark
              prefix += 'utf8=%26%2310003%3B&';
          } else {
              // encodeURIComponent('✓')
              prefix += 'utf8=%E2%9C%93&';
          }
      }

      return joined.length > 0 ? prefix + joined : '';
  };

  var has$2 = Object.prototype.hasOwnProperty;
  var isArray$3 = Array.isArray;

  var defaults$2 = {
      allowDots: false,
      allowPrototypes: false,
      arrayLimit: 20,
      charset: 'utf-8',
      charsetSentinel: false,
      comma: false,
      decoder: utils$1.decode,
      delimiter: '&',
      depth: 5,
      ignoreQueryPrefix: false,
      interpretNumericEntities: false,
      parameterLimit: 1000,
      parseArrays: true,
      plainObjects: false,
      strictNullHandling: false
  };

  var interpretNumericEntities = function (str) {
      return str.replace(/&#(\d+);/g, function ($0, numberStr) {
          return String.fromCharCode(parseInt(numberStr, 10));
      });
  };

  // This is what browsers will submit when the ✓ character occurs in an
  // application/x-www-form-urlencoded body and the encoding of the page containing
  // the form is iso-8859-1, or when the submitted form has an accept-charset
  // attribute of iso-8859-1. Presumably also with other charsets that do not contain
  // the ✓ character, such as us-ascii.
  var isoSentinel = 'utf8=%26%2310003%3B'; // encodeURIComponent('&#10003;')

  // These are the percent-encoded utf-8 octets representing a checkmark, indicating that the request actually is utf-8 encoded.
  var charsetSentinel = 'utf8=%E2%9C%93'; // encodeURIComponent('✓')

  var parseValues = function parseQueryStringValues(str, options) {
      var obj = {};
      var cleanStr = options.ignoreQueryPrefix ? str.replace(/^\?/, '') : str;
      var limit = options.parameterLimit === Infinity ? undefined : options.parameterLimit;
      var parts = cleanStr.split(options.delimiter, limit);
      var skipIndex = -1; // Keep track of where the utf8 sentinel was found
      var i;

      var charset = options.charset;
      if (options.charsetSentinel) {
          for (i = 0; i < parts.length; ++i) {
              if (parts[i].indexOf('utf8=') === 0) {
                  if (parts[i] === charsetSentinel) {
                      charset = 'utf-8';
                  } else if (parts[i] === isoSentinel) {
                      charset = 'iso-8859-1';
                  }
                  skipIndex = i;
                  i = parts.length; // The eslint settings do not allow break;
              }
          }
      }

      for (i = 0; i < parts.length; ++i) {
          if (i === skipIndex) {
              continue;
          }
          var part = parts[i];

          var bracketEqualsPos = part.indexOf(']=');
          var pos = bracketEqualsPos === -1 ? part.indexOf('=') : bracketEqualsPos + 1;

          var key, val;
          if (pos === -1) {
              key = options.decoder(part, defaults$2.decoder, charset, 'key');
              val = options.strictNullHandling ? null : '';
          } else {
              key = options.decoder(part.slice(0, pos), defaults$2.decoder, charset, 'key');
              val = options.decoder(part.slice(pos + 1), defaults$2.decoder, charset, 'value');
          }

          if (val && options.interpretNumericEntities && charset === 'iso-8859-1') {
              val = interpretNumericEntities(val);
          }

          if (val && typeof val === 'string' && options.comma && val.indexOf(',') > -1) {
              val = val.split(',');
          }

          if (part.indexOf('[]=') > -1) {
              val = isArray$3(val) ? [val] : val;
          }

          if (has$2.call(obj, key)) {
              obj[key] = utils$1.combine(obj[key], val);
          } else {
              obj[key] = val;
          }
      }

      return obj;
  };

  var parseObject = function (chain, val, options) {
      var leaf = val;

      for (var i = chain.length - 1; i >= 0; --i) {
          var obj;
          var root = chain[i];

          if (root === '[]' && options.parseArrays) {
              obj = [].concat(leaf);
          } else {
              obj = options.plainObjects ? Object.create(null) : {};
              var cleanRoot = root.charAt(0) === '[' && root.charAt(root.length - 1) === ']' ? root.slice(1, -1) : root;
              var index = parseInt(cleanRoot, 10);
              if (!options.parseArrays && cleanRoot === '') {
                  obj = { 0: leaf };
              } else if (
                  !isNaN(index)
                  && root !== cleanRoot
                  && String(index) === cleanRoot
                  && index >= 0
                  && (options.parseArrays && index <= options.arrayLimit)
              ) {
                  obj = [];
                  obj[index] = leaf;
              } else {
                  obj[cleanRoot] = leaf;
              }
          }

          leaf = obj;
      }

      return leaf;
  };

  var parseKeys = function parseQueryStringKeys(givenKey, val, options) {
      if (!givenKey) {
          return;
      }

      // Transform dot notation to bracket notation
      var key = options.allowDots ? givenKey.replace(/\.([^.[]+)/g, '[$1]') : givenKey;

      // The regex chunks

      var brackets = /(\[[^[\]]*])/;
      var child = /(\[[^[\]]*])/g;

      // Get the parent

      var segment = options.depth > 0 && brackets.exec(key);
      var parent = segment ? key.slice(0, segment.index) : key;

      // Stash the parent if it exists

      var keys = [];
      if (parent) {
          // If we aren't using plain objects, optionally prefix keys that would overwrite object prototype properties
          if (!options.plainObjects && has$2.call(Object.prototype, parent)) {
              if (!options.allowPrototypes) {
                  return;
              }
          }

          keys.push(parent);
      }

      // Loop through children appending to the array until we hit depth

      var i = 0;
      while (options.depth > 0 && (segment = child.exec(key)) !== null && i < options.depth) {
          i += 1;
          if (!options.plainObjects && has$2.call(Object.prototype, segment[1].slice(1, -1))) {
              if (!options.allowPrototypes) {
                  return;
              }
          }
          keys.push(segment[1]);
      }

      // If there's a remainder, just add whatever is left

      if (segment) {
          keys.push('[' + key.slice(segment.index) + ']');
      }

      return parseObject(keys, val, options);
  };

  var normalizeParseOptions = function normalizeParseOptions(opts) {
      if (!opts) {
          return defaults$2;
      }

      if (opts.decoder !== null && opts.decoder !== undefined && typeof opts.decoder !== 'function') {
          throw new TypeError('Decoder has to be a function.');
      }

      if (typeof opts.charset !== 'undefined' && opts.charset !== 'utf-8' && opts.charset !== 'iso-8859-1') {
          throw new Error('The charset option must be either utf-8, iso-8859-1, or undefined');
      }
      var charset = typeof opts.charset === 'undefined' ? defaults$2.charset : opts.charset;

      return {
          allowDots: typeof opts.allowDots === 'undefined' ? defaults$2.allowDots : !!opts.allowDots,
          allowPrototypes: typeof opts.allowPrototypes === 'boolean' ? opts.allowPrototypes : defaults$2.allowPrototypes,
          arrayLimit: typeof opts.arrayLimit === 'number' ? opts.arrayLimit : defaults$2.arrayLimit,
          charset: charset,
          charsetSentinel: typeof opts.charsetSentinel === 'boolean' ? opts.charsetSentinel : defaults$2.charsetSentinel,
          comma: typeof opts.comma === 'boolean' ? opts.comma : defaults$2.comma,
          decoder: typeof opts.decoder === 'function' ? opts.decoder : defaults$2.decoder,
          delimiter: typeof opts.delimiter === 'string' || utils$1.isRegExp(opts.delimiter) ? opts.delimiter : defaults$2.delimiter,
          // eslint-disable-next-line no-implicit-coercion, no-extra-parens
          depth: (typeof opts.depth === 'number' || opts.depth === false) ? +opts.depth : defaults$2.depth,
          ignoreQueryPrefix: opts.ignoreQueryPrefix === true,
          interpretNumericEntities: typeof opts.interpretNumericEntities === 'boolean' ? opts.interpretNumericEntities : defaults$2.interpretNumericEntities,
          parameterLimit: typeof opts.parameterLimit === 'number' ? opts.parameterLimit : defaults$2.parameterLimit,
          parseArrays: opts.parseArrays !== false,
          plainObjects: typeof opts.plainObjects === 'boolean' ? opts.plainObjects : defaults$2.plainObjects,
          strictNullHandling: typeof opts.strictNullHandling === 'boolean' ? opts.strictNullHandling : defaults$2.strictNullHandling
      };
  };

  var parse = function (str, opts) {
      var options = normalizeParseOptions(opts);

      if (str === '' || str === null || typeof str === 'undefined') {
          return options.plainObjects ? Object.create(null) : {};
      }

      var tempObj = typeof str === 'string' ? parseValues(str, options) : str;
      var obj = options.plainObjects ? Object.create(null) : {};

      // Iterate over the keys and setup the new object

      var keys = Object.keys(tempObj);
      for (var i = 0; i < keys.length; ++i) {
          var key = keys[i];
          var newObj = parseKeys(key, tempObj[key], options);
          obj = utils$1.merge(obj, newObj, options);
      }

      return utils$1.compact(obj);
  };

  var lib = {
      formats: formats,
      parse: parse,
      stringify: stringify_1
  };

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

  function JsonToXml() {

    this.result = [];
  }

  var spacialChars = ['&', '<', '>', '"', '\''];

  var validChars = ['&', '<', '>', '"', '\''];

  JsonToXml.prototype.toString = function () {

    return this.result.join('');
  };

  JsonToXml.prototype.toUpperCase = function (str) {

    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  JsonToXml.prototype.replaceSpecialChar = function (s) {

    for (var i = 0; i < spacialChars.length; i++) {

      s = s.replace(new RegExp(spacialChars[i], 'g'), validChars[i]);
    }

    return s;
  };

  JsonToXml.prototype.appendText = function (s) {

    s = this.replaceSpecialChar(s);

    this.result.push(s);
  };

  JsonToXml.prototype.appendAttr = function (key, value) {

    this.result.push(' ' + key + '="' + value + '');
  };

  JsonToXml.prototype.appendFlagBeginS = function (s) {

    s = this.toUpperCase(s);

    this.result.push('<' + s);
  };

  JsonToXml.prototype.appendFlagBeginE = function () {

    this.result.push('>');
  };

  JsonToXml.prototype.appendFlagEnd = function (s) {

    s = this.toUpperCase(s);

    this.result.push("</" + s + ">");
  };

  JsonToXml.prototype.parse = function (json) {

    this.result = [];

    this.convert(json);

    return this.toString();
  };

  JsonToXml.prototype.convert = function (obj) {
    if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object') {
      for (var k in obj) {
        // if (typeof obj[k] === 'object') {
        //   this.appendFlagBeginS(k)
        //   this.appendFlagBeginE()
        //   this.convert(obj[k])
        //   this.appendFlagEnd(k)
        // } else {
        //   this.appendFlagBeginS(k)
        //   this.appendFlagBeginE()
        //   this.appendText(obj[k] + '')
        //   this.appendFlagEnd(k)
        // }
        this.appendFlagBeginS(k);
        this.appendFlagBeginE();
        _typeof(obj[k]) === 'object' ? this.convert(obj[k]) : this.appendText(obj[k] + '');
        this.appendFlagEnd(k);
      }
    }
  };

  // JsonToXml.prototype.convert = function(obj) {
  //
  //   var nodeName = obj.xtype || "item";
  //
  //   this.appendFlagBeginS(nodeName);
  //
  //   var arrayMap = {};
  //
  //   for(var key in obj) {
  //
  //     var item = obj[key];
  //
  //     if(key == "xtype") {
  //
  //       continue;
  //
  //     }
  //
  //     if(item.constructor == String) {
  //
  //       this.appendAttr(key, item);
  //
  //     }
  //
  //     if(item.constructor == Array) {
  //
  //       arrayMap[key] = item;
  //
  //     }
  //
  //   }
  //
  //   this.appendFlagBeginE();
  //
  //   for(var key in arrayMap) {
  //
  //     var items = arrayMap[key];
  //
  //     for(var i=0;i<items.length;i++) {
  //
  //       this.convert(items[i]);
  //
  //     }
  //
  //   }
  //
  //   this.appendFlagEnd(nodeName);
  //
  // };

  var jsonToXml = new JsonToXml();

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var md5 = createCommonjsModule(function (module) {
  /**
   * [js-md5]{@link https://github.com/emn178/js-md5}
   *
   * @namespace md5
   * @version 0.7.3
   * @author Chen, Yi-Cyuan [emn178@gmail.com]
   * @copyright Chen, Yi-Cyuan 2014-2017
   * @license MIT
   */
  (function () {

    var ERROR = 'input is invalid type';
    var WINDOW = typeof window === 'object';
    var root = WINDOW ? window : {};
    if (root.JS_MD5_NO_WINDOW) {
      WINDOW = false;
    }
    var WEB_WORKER = !WINDOW && typeof self === 'object';
    var NODE_JS = !root.JS_MD5_NO_NODE_JS && typeof process === 'object' && process.versions && process.versions.node;
    if (NODE_JS) {
      root = commonjsGlobal;
    } else if (WEB_WORKER) {
      root = self;
    }
    var COMMON_JS = !root.JS_MD5_NO_COMMON_JS && 'object' === 'object' && module.exports;
    var ARRAY_BUFFER = !root.JS_MD5_NO_ARRAY_BUFFER && typeof ArrayBuffer !== 'undefined';
    var HEX_CHARS = '0123456789abcdef'.split('');
    var EXTRA = [128, 32768, 8388608, -2147483648];
    var SHIFT = [0, 8, 16, 24];
    var OUTPUT_TYPES = ['hex', 'array', 'digest', 'buffer', 'arrayBuffer', 'base64'];
    var BASE64_ENCODE_CHAR = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');

    var blocks = [], buffer8;
    if (ARRAY_BUFFER) {
      var buffer = new ArrayBuffer(68);
      buffer8 = new Uint8Array(buffer);
      blocks = new Uint32Array(buffer);
    }

    if (root.JS_MD5_NO_NODE_JS || !Array.isArray) {
      Array.isArray = function (obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
      };
    }

    if (ARRAY_BUFFER && (root.JS_MD5_NO_ARRAY_BUFFER_IS_VIEW || !ArrayBuffer.isView)) {
      ArrayBuffer.isView = function (obj) {
        return typeof obj === 'object' && obj.buffer && obj.buffer.constructor === ArrayBuffer;
      };
    }

    /**
     * @method hex
     * @memberof md5
     * @description Output hash as hex string
     * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
     * @returns {String} Hex string
     * @example
     * md5.hex('The quick brown fox jumps over the lazy dog');
     * // equal to
     * md5('The quick brown fox jumps over the lazy dog');
     */
    /**
     * @method digest
     * @memberof md5
     * @description Output hash as bytes array
     * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
     * @returns {Array} Bytes array
     * @example
     * md5.digest('The quick brown fox jumps over the lazy dog');
     */
    /**
     * @method array
     * @memberof md5
     * @description Output hash as bytes array
     * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
     * @returns {Array} Bytes array
     * @example
     * md5.array('The quick brown fox jumps over the lazy dog');
     */
    /**
     * @method arrayBuffer
     * @memberof md5
     * @description Output hash as ArrayBuffer
     * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
     * @returns {ArrayBuffer} ArrayBuffer
     * @example
     * md5.arrayBuffer('The quick brown fox jumps over the lazy dog');
     */
    /**
     * @method buffer
     * @deprecated This maybe confuse with Buffer in node.js. Please use arrayBuffer instead.
     * @memberof md5
     * @description Output hash as ArrayBuffer
     * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
     * @returns {ArrayBuffer} ArrayBuffer
     * @example
     * md5.buffer('The quick brown fox jumps over the lazy dog');
     */
    /**
     * @method base64
     * @memberof md5
     * @description Output hash as base64 string
     * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
     * @returns {String} base64 string
     * @example
     * md5.base64('The quick brown fox jumps over the lazy dog');
     */
    var createOutputMethod = function (outputType) {
      return function (message) {
        return new Md5(true).update(message)[outputType]();
      };
    };

    /**
     * @method create
     * @memberof md5
     * @description Create Md5 object
     * @returns {Md5} Md5 object.
     * @example
     * var hash = md5.create();
     */
    /**
     * @method update
     * @memberof md5
     * @description Create and update Md5 object
     * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
     * @returns {Md5} Md5 object.
     * @example
     * var hash = md5.update('The quick brown fox jumps over the lazy dog');
     * // equal to
     * var hash = md5.create();
     * hash.update('The quick brown fox jumps over the lazy dog');
     */
    var createMethod = function () {
      var method = createOutputMethod('hex');
      if (NODE_JS) {
        method = nodeWrap(method);
      }
      method.create = function () {
        return new Md5();
      };
      method.update = function (message) {
        return method.create().update(message);
      };
      for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
        var type = OUTPUT_TYPES[i];
        method[type] = createOutputMethod(type);
      }
      return method;
    };

    var nodeWrap = function (method) {
      var crypto = eval("require('crypto')");
      var Buffer = eval("require('buffer').Buffer");
      var nodeMethod = function (message) {
        if (typeof message === 'string') {
          return crypto.createHash('md5').update(message, 'utf8').digest('hex');
        } else {
          if (message === null || message === undefined) {
            throw ERROR;
          } else if (message.constructor === ArrayBuffer) {
            message = new Uint8Array(message);
          }
        }
        if (Array.isArray(message) || ArrayBuffer.isView(message) ||
          message.constructor === Buffer) {
          return crypto.createHash('md5').update(new Buffer(message)).digest('hex');
        } else {
          return method(message);
        }
      };
      return nodeMethod;
    };

    /**
     * Md5 class
     * @class Md5
     * @description This is internal class.
     * @see {@link md5.create}
     */
    function Md5(sharedMemory) {
      if (sharedMemory) {
        blocks[0] = blocks[16] = blocks[1] = blocks[2] = blocks[3] =
        blocks[4] = blocks[5] = blocks[6] = blocks[7] =
        blocks[8] = blocks[9] = blocks[10] = blocks[11] =
        blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
        this.blocks = blocks;
        this.buffer8 = buffer8;
      } else {
        if (ARRAY_BUFFER) {
          var buffer = new ArrayBuffer(68);
          this.buffer8 = new Uint8Array(buffer);
          this.blocks = new Uint32Array(buffer);
        } else {
          this.blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        }
      }
      this.h0 = this.h1 = this.h2 = this.h3 = this.start = this.bytes = this.hBytes = 0;
      this.finalized = this.hashed = false;
      this.first = true;
    }

    /**
     * @method update
     * @memberof Md5
     * @instance
     * @description Update hash
     * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
     * @returns {Md5} Md5 object.
     * @see {@link md5.update}
     */
    Md5.prototype.update = function (message) {
      if (this.finalized) {
        return;
      }

      var notString, type = typeof message;
      if (type !== 'string') {
        if (type === 'object') {
          if (message === null) {
            throw ERROR;
          } else if (ARRAY_BUFFER && message.constructor === ArrayBuffer) {
            message = new Uint8Array(message);
          } else if (!Array.isArray(message)) {
            if (!ARRAY_BUFFER || !ArrayBuffer.isView(message)) {
              throw ERROR;
            }
          }
        } else {
          throw ERROR;
        }
        notString = true;
      }
      var code, index = 0, i, length = message.length, blocks = this.blocks;
      var buffer8 = this.buffer8;

      while (index < length) {
        if (this.hashed) {
          this.hashed = false;
          blocks[0] = blocks[16];
          blocks[16] = blocks[1] = blocks[2] = blocks[3] =
          blocks[4] = blocks[5] = blocks[6] = blocks[7] =
          blocks[8] = blocks[9] = blocks[10] = blocks[11] =
          blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
        }

        if (notString) {
          if (ARRAY_BUFFER) {
            for (i = this.start; index < length && i < 64; ++index) {
              buffer8[i++] = message[index];
            }
          } else {
            for (i = this.start; index < length && i < 64; ++index) {
              blocks[i >> 2] |= message[index] << SHIFT[i++ & 3];
            }
          }
        } else {
          if (ARRAY_BUFFER) {
            for (i = this.start; index < length && i < 64; ++index) {
              code = message.charCodeAt(index);
              if (code < 0x80) {
                buffer8[i++] = code;
              } else if (code < 0x800) {
                buffer8[i++] = 0xc0 | (code >> 6);
                buffer8[i++] = 0x80 | (code & 0x3f);
              } else if (code < 0xd800 || code >= 0xe000) {
                buffer8[i++] = 0xe0 | (code >> 12);
                buffer8[i++] = 0x80 | ((code >> 6) & 0x3f);
                buffer8[i++] = 0x80 | (code & 0x3f);
              } else {
                code = 0x10000 + (((code & 0x3ff) << 10) | (message.charCodeAt(++index) & 0x3ff));
                buffer8[i++] = 0xf0 | (code >> 18);
                buffer8[i++] = 0x80 | ((code >> 12) & 0x3f);
                buffer8[i++] = 0x80 | ((code >> 6) & 0x3f);
                buffer8[i++] = 0x80 | (code & 0x3f);
              }
            }
          } else {
            for (i = this.start; index < length && i < 64; ++index) {
              code = message.charCodeAt(index);
              if (code < 0x80) {
                blocks[i >> 2] |= code << SHIFT[i++ & 3];
              } else if (code < 0x800) {
                blocks[i >> 2] |= (0xc0 | (code >> 6)) << SHIFT[i++ & 3];
                blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
              } else if (code < 0xd800 || code >= 0xe000) {
                blocks[i >> 2] |= (0xe0 | (code >> 12)) << SHIFT[i++ & 3];
                blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
                blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
              } else {
                code = 0x10000 + (((code & 0x3ff) << 10) | (message.charCodeAt(++index) & 0x3ff));
                blocks[i >> 2] |= (0xf0 | (code >> 18)) << SHIFT[i++ & 3];
                blocks[i >> 2] |= (0x80 | ((code >> 12) & 0x3f)) << SHIFT[i++ & 3];
                blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
                blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
              }
            }
          }
        }
        this.lastByteIndex = i;
        this.bytes += i - this.start;
        if (i >= 64) {
          this.start = i - 64;
          this.hash();
          this.hashed = true;
        } else {
          this.start = i;
        }
      }
      if (this.bytes > 4294967295) {
        this.hBytes += this.bytes / 4294967296 << 0;
        this.bytes = this.bytes % 4294967296;
      }
      return this;
    };

    Md5.prototype.finalize = function () {
      if (this.finalized) {
        return;
      }
      this.finalized = true;
      var blocks = this.blocks, i = this.lastByteIndex;
      blocks[i >> 2] |= EXTRA[i & 3];
      if (i >= 56) {
        if (!this.hashed) {
          this.hash();
        }
        blocks[0] = blocks[16];
        blocks[16] = blocks[1] = blocks[2] = blocks[3] =
        blocks[4] = blocks[5] = blocks[6] = blocks[7] =
        blocks[8] = blocks[9] = blocks[10] = blocks[11] =
        blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
      }
      blocks[14] = this.bytes << 3;
      blocks[15] = this.hBytes << 3 | this.bytes >>> 29;
      this.hash();
    };

    Md5.prototype.hash = function () {
      var a, b, c, d, bc, da, blocks = this.blocks;

      if (this.first) {
        a = blocks[0] - 680876937;
        a = (a << 7 | a >>> 25) - 271733879 << 0;
        d = (-1732584194 ^ a & 2004318071) + blocks[1] - 117830708;
        d = (d << 12 | d >>> 20) + a << 0;
        c = (-271733879 ^ (d & (a ^ -271733879))) + blocks[2] - 1126478375;
        c = (c << 17 | c >>> 15) + d << 0;
        b = (a ^ (c & (d ^ a))) + blocks[3] - 1316259209;
        b = (b << 22 | b >>> 10) + c << 0;
      } else {
        a = this.h0;
        b = this.h1;
        c = this.h2;
        d = this.h3;
        a += (d ^ (b & (c ^ d))) + blocks[0] - 680876936;
        a = (a << 7 | a >>> 25) + b << 0;
        d += (c ^ (a & (b ^ c))) + blocks[1] - 389564586;
        d = (d << 12 | d >>> 20) + a << 0;
        c += (b ^ (d & (a ^ b))) + blocks[2] + 606105819;
        c = (c << 17 | c >>> 15) + d << 0;
        b += (a ^ (c & (d ^ a))) + blocks[3] - 1044525330;
        b = (b << 22 | b >>> 10) + c << 0;
      }

      a += (d ^ (b & (c ^ d))) + blocks[4] - 176418897;
      a = (a << 7 | a >>> 25) + b << 0;
      d += (c ^ (a & (b ^ c))) + blocks[5] + 1200080426;
      d = (d << 12 | d >>> 20) + a << 0;
      c += (b ^ (d & (a ^ b))) + blocks[6] - 1473231341;
      c = (c << 17 | c >>> 15) + d << 0;
      b += (a ^ (c & (d ^ a))) + blocks[7] - 45705983;
      b = (b << 22 | b >>> 10) + c << 0;
      a += (d ^ (b & (c ^ d))) + blocks[8] + 1770035416;
      a = (a << 7 | a >>> 25) + b << 0;
      d += (c ^ (a & (b ^ c))) + blocks[9] - 1958414417;
      d = (d << 12 | d >>> 20) + a << 0;
      c += (b ^ (d & (a ^ b))) + blocks[10] - 42063;
      c = (c << 17 | c >>> 15) + d << 0;
      b += (a ^ (c & (d ^ a))) + blocks[11] - 1990404162;
      b = (b << 22 | b >>> 10) + c << 0;
      a += (d ^ (b & (c ^ d))) + blocks[12] + 1804603682;
      a = (a << 7 | a >>> 25) + b << 0;
      d += (c ^ (a & (b ^ c))) + blocks[13] - 40341101;
      d = (d << 12 | d >>> 20) + a << 0;
      c += (b ^ (d & (a ^ b))) + blocks[14] - 1502002290;
      c = (c << 17 | c >>> 15) + d << 0;
      b += (a ^ (c & (d ^ a))) + blocks[15] + 1236535329;
      b = (b << 22 | b >>> 10) + c << 0;
      a += (c ^ (d & (b ^ c))) + blocks[1] - 165796510;
      a = (a << 5 | a >>> 27) + b << 0;
      d += (b ^ (c & (a ^ b))) + blocks[6] - 1069501632;
      d = (d << 9 | d >>> 23) + a << 0;
      c += (a ^ (b & (d ^ a))) + blocks[11] + 643717713;
      c = (c << 14 | c >>> 18) + d << 0;
      b += (d ^ (a & (c ^ d))) + blocks[0] - 373897302;
      b = (b << 20 | b >>> 12) + c << 0;
      a += (c ^ (d & (b ^ c))) + blocks[5] - 701558691;
      a = (a << 5 | a >>> 27) + b << 0;
      d += (b ^ (c & (a ^ b))) + blocks[10] + 38016083;
      d = (d << 9 | d >>> 23) + a << 0;
      c += (a ^ (b & (d ^ a))) + blocks[15] - 660478335;
      c = (c << 14 | c >>> 18) + d << 0;
      b += (d ^ (a & (c ^ d))) + blocks[4] - 405537848;
      b = (b << 20 | b >>> 12) + c << 0;
      a += (c ^ (d & (b ^ c))) + blocks[9] + 568446438;
      a = (a << 5 | a >>> 27) + b << 0;
      d += (b ^ (c & (a ^ b))) + blocks[14] - 1019803690;
      d = (d << 9 | d >>> 23) + a << 0;
      c += (a ^ (b & (d ^ a))) + blocks[3] - 187363961;
      c = (c << 14 | c >>> 18) + d << 0;
      b += (d ^ (a & (c ^ d))) + blocks[8] + 1163531501;
      b = (b << 20 | b >>> 12) + c << 0;
      a += (c ^ (d & (b ^ c))) + blocks[13] - 1444681467;
      a = (a << 5 | a >>> 27) + b << 0;
      d += (b ^ (c & (a ^ b))) + blocks[2] - 51403784;
      d = (d << 9 | d >>> 23) + a << 0;
      c += (a ^ (b & (d ^ a))) + blocks[7] + 1735328473;
      c = (c << 14 | c >>> 18) + d << 0;
      b += (d ^ (a & (c ^ d))) + blocks[12] - 1926607734;
      b = (b << 20 | b >>> 12) + c << 0;
      bc = b ^ c;
      a += (bc ^ d) + blocks[5] - 378558;
      a = (a << 4 | a >>> 28) + b << 0;
      d += (bc ^ a) + blocks[8] - 2022574463;
      d = (d << 11 | d >>> 21) + a << 0;
      da = d ^ a;
      c += (da ^ b) + blocks[11] + 1839030562;
      c = (c << 16 | c >>> 16) + d << 0;
      b += (da ^ c) + blocks[14] - 35309556;
      b = (b << 23 | b >>> 9) + c << 0;
      bc = b ^ c;
      a += (bc ^ d) + blocks[1] - 1530992060;
      a = (a << 4 | a >>> 28) + b << 0;
      d += (bc ^ a) + blocks[4] + 1272893353;
      d = (d << 11 | d >>> 21) + a << 0;
      da = d ^ a;
      c += (da ^ b) + blocks[7] - 155497632;
      c = (c << 16 | c >>> 16) + d << 0;
      b += (da ^ c) + blocks[10] - 1094730640;
      b = (b << 23 | b >>> 9) + c << 0;
      bc = b ^ c;
      a += (bc ^ d) + blocks[13] + 681279174;
      a = (a << 4 | a >>> 28) + b << 0;
      d += (bc ^ a) + blocks[0] - 358537222;
      d = (d << 11 | d >>> 21) + a << 0;
      da = d ^ a;
      c += (da ^ b) + blocks[3] - 722521979;
      c = (c << 16 | c >>> 16) + d << 0;
      b += (da ^ c) + blocks[6] + 76029189;
      b = (b << 23 | b >>> 9) + c << 0;
      bc = b ^ c;
      a += (bc ^ d) + blocks[9] - 640364487;
      a = (a << 4 | a >>> 28) + b << 0;
      d += (bc ^ a) + blocks[12] - 421815835;
      d = (d << 11 | d >>> 21) + a << 0;
      da = d ^ a;
      c += (da ^ b) + blocks[15] + 530742520;
      c = (c << 16 | c >>> 16) + d << 0;
      b += (da ^ c) + blocks[2] - 995338651;
      b = (b << 23 | b >>> 9) + c << 0;
      a += (c ^ (b | ~d)) + blocks[0] - 198630844;
      a = (a << 6 | a >>> 26) + b << 0;
      d += (b ^ (a | ~c)) + blocks[7] + 1126891415;
      d = (d << 10 | d >>> 22) + a << 0;
      c += (a ^ (d | ~b)) + blocks[14] - 1416354905;
      c = (c << 15 | c >>> 17) + d << 0;
      b += (d ^ (c | ~a)) + blocks[5] - 57434055;
      b = (b << 21 | b >>> 11) + c << 0;
      a += (c ^ (b | ~d)) + blocks[12] + 1700485571;
      a = (a << 6 | a >>> 26) + b << 0;
      d += (b ^ (a | ~c)) + blocks[3] - 1894986606;
      d = (d << 10 | d >>> 22) + a << 0;
      c += (a ^ (d | ~b)) + blocks[10] - 1051523;
      c = (c << 15 | c >>> 17) + d << 0;
      b += (d ^ (c | ~a)) + blocks[1] - 2054922799;
      b = (b << 21 | b >>> 11) + c << 0;
      a += (c ^ (b | ~d)) + blocks[8] + 1873313359;
      a = (a << 6 | a >>> 26) + b << 0;
      d += (b ^ (a | ~c)) + blocks[15] - 30611744;
      d = (d << 10 | d >>> 22) + a << 0;
      c += (a ^ (d | ~b)) + blocks[6] - 1560198380;
      c = (c << 15 | c >>> 17) + d << 0;
      b += (d ^ (c | ~a)) + blocks[13] + 1309151649;
      b = (b << 21 | b >>> 11) + c << 0;
      a += (c ^ (b | ~d)) + blocks[4] - 145523070;
      a = (a << 6 | a >>> 26) + b << 0;
      d += (b ^ (a | ~c)) + blocks[11] - 1120210379;
      d = (d << 10 | d >>> 22) + a << 0;
      c += (a ^ (d | ~b)) + blocks[2] + 718787259;
      c = (c << 15 | c >>> 17) + d << 0;
      b += (d ^ (c | ~a)) + blocks[9] - 343485551;
      b = (b << 21 | b >>> 11) + c << 0;

      if (this.first) {
        this.h0 = a + 1732584193 << 0;
        this.h1 = b - 271733879 << 0;
        this.h2 = c - 1732584194 << 0;
        this.h3 = d + 271733878 << 0;
        this.first = false;
      } else {
        this.h0 = this.h0 + a << 0;
        this.h1 = this.h1 + b << 0;
        this.h2 = this.h2 + c << 0;
        this.h3 = this.h3 + d << 0;
      }
    };

    /**
     * @method hex
     * @memberof Md5
     * @instance
     * @description Output hash as hex string
     * @returns {String} Hex string
     * @see {@link md5.hex}
     * @example
     * hash.hex();
     */
    Md5.prototype.hex = function () {
      this.finalize();

      var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3;

      return HEX_CHARS[(h0 >> 4) & 0x0F] + HEX_CHARS[h0 & 0x0F] +
        HEX_CHARS[(h0 >> 12) & 0x0F] + HEX_CHARS[(h0 >> 8) & 0x0F] +
        HEX_CHARS[(h0 >> 20) & 0x0F] + HEX_CHARS[(h0 >> 16) & 0x0F] +
        HEX_CHARS[(h0 >> 28) & 0x0F] + HEX_CHARS[(h0 >> 24) & 0x0F] +
        HEX_CHARS[(h1 >> 4) & 0x0F] + HEX_CHARS[h1 & 0x0F] +
        HEX_CHARS[(h1 >> 12) & 0x0F] + HEX_CHARS[(h1 >> 8) & 0x0F] +
        HEX_CHARS[(h1 >> 20) & 0x0F] + HEX_CHARS[(h1 >> 16) & 0x0F] +
        HEX_CHARS[(h1 >> 28) & 0x0F] + HEX_CHARS[(h1 >> 24) & 0x0F] +
        HEX_CHARS[(h2 >> 4) & 0x0F] + HEX_CHARS[h2 & 0x0F] +
        HEX_CHARS[(h2 >> 12) & 0x0F] + HEX_CHARS[(h2 >> 8) & 0x0F] +
        HEX_CHARS[(h2 >> 20) & 0x0F] + HEX_CHARS[(h2 >> 16) & 0x0F] +
        HEX_CHARS[(h2 >> 28) & 0x0F] + HEX_CHARS[(h2 >> 24) & 0x0F] +
        HEX_CHARS[(h3 >> 4) & 0x0F] + HEX_CHARS[h3 & 0x0F] +
        HEX_CHARS[(h3 >> 12) & 0x0F] + HEX_CHARS[(h3 >> 8) & 0x0F] +
        HEX_CHARS[(h3 >> 20) & 0x0F] + HEX_CHARS[(h3 >> 16) & 0x0F] +
        HEX_CHARS[(h3 >> 28) & 0x0F] + HEX_CHARS[(h3 >> 24) & 0x0F];
    };

    /**
     * @method toString
     * @memberof Md5
     * @instance
     * @description Output hash as hex string
     * @returns {String} Hex string
     * @see {@link md5.hex}
     * @example
     * hash.toString();
     */
    Md5.prototype.toString = Md5.prototype.hex;

    /**
     * @method digest
     * @memberof Md5
     * @instance
     * @description Output hash as bytes array
     * @returns {Array} Bytes array
     * @see {@link md5.digest}
     * @example
     * hash.digest();
     */
    Md5.prototype.digest = function () {
      this.finalize();

      var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3;
      return [
        h0 & 0xFF, (h0 >> 8) & 0xFF, (h0 >> 16) & 0xFF, (h0 >> 24) & 0xFF,
        h1 & 0xFF, (h1 >> 8) & 0xFF, (h1 >> 16) & 0xFF, (h1 >> 24) & 0xFF,
        h2 & 0xFF, (h2 >> 8) & 0xFF, (h2 >> 16) & 0xFF, (h2 >> 24) & 0xFF,
        h3 & 0xFF, (h3 >> 8) & 0xFF, (h3 >> 16) & 0xFF, (h3 >> 24) & 0xFF
      ];
    };

    /**
     * @method array
     * @memberof Md5
     * @instance
     * @description Output hash as bytes array
     * @returns {Array} Bytes array
     * @see {@link md5.array}
     * @example
     * hash.array();
     */
    Md5.prototype.array = Md5.prototype.digest;

    /**
     * @method arrayBuffer
     * @memberof Md5
     * @instance
     * @description Output hash as ArrayBuffer
     * @returns {ArrayBuffer} ArrayBuffer
     * @see {@link md5.arrayBuffer}
     * @example
     * hash.arrayBuffer();
     */
    Md5.prototype.arrayBuffer = function () {
      this.finalize();

      var buffer = new ArrayBuffer(16);
      var blocks = new Uint32Array(buffer);
      blocks[0] = this.h0;
      blocks[1] = this.h1;
      blocks[2] = this.h2;
      blocks[3] = this.h3;
      return buffer;
    };

    /**
     * @method buffer
     * @deprecated This maybe confuse with Buffer in node.js. Please use arrayBuffer instead.
     * @memberof Md5
     * @instance
     * @description Output hash as ArrayBuffer
     * @returns {ArrayBuffer} ArrayBuffer
     * @see {@link md5.buffer}
     * @example
     * hash.buffer();
     */
    Md5.prototype.buffer = Md5.prototype.arrayBuffer;

    /**
     * @method base64
     * @memberof Md5
     * @instance
     * @description Output hash as base64 string
     * @returns {String} base64 string
     * @see {@link md5.base64}
     * @example
     * hash.base64();
     */
    Md5.prototype.base64 = function () {
      var v1, v2, v3, base64Str = '', bytes = this.array();
      for (var i = 0; i < 15;) {
        v1 = bytes[i++];
        v2 = bytes[i++];
        v3 = bytes[i++];
        base64Str += BASE64_ENCODE_CHAR[v1 >>> 2] +
          BASE64_ENCODE_CHAR[(v1 << 4 | v2 >>> 4) & 63] +
          BASE64_ENCODE_CHAR[(v2 << 2 | v3 >>> 6) & 63] +
          BASE64_ENCODE_CHAR[v3 & 63];
      }
      v1 = bytes[i];
      base64Str += BASE64_ENCODE_CHAR[v1 >>> 2] +
        BASE64_ENCODE_CHAR[(v1 << 4) & 63] +
        '==';
      return base64Str;
    };

    var exports = createMethod();

    if (COMMON_JS) {
      module.exports = exports;
    } else {
      /**
       * @method md5
       * @description Md5 hash function, export to global in browsers.
       * @param {String|Array|Uint8Array|ArrayBuffer} message message to hash
       * @returns {String} md5 hashes
       * @example
       * md5(''); // d41d8cd98f00b204e9800998ecf8427e
       * md5('The quick brown fox jumps over the lazy dog'); // 9e107d9d372bb6826bd81d3542a419d6
       * md5('The quick brown fox jumps over the lazy dog.'); // e4d909c290d0fb1ca068ffaddf22cbd0
       *
       * // It also supports UTF-8 encoding
       * md5('中文'); // a7bac2239fcdcb3a067903d8077c4a07
       *
       * // It also supports byte `Array`, `Uint8Array`, `ArrayBuffer`
       * md5([]); // d41d8cd98f00b204e9800998ecf8427e
       * md5(new Uint8Array([])); // d41d8cd98f00b204e9800998ecf8427e
       */
      root.md5 = exports;
    }
  })();
  });

  function calculateVerifySign(contents) {
    //1.对参数进行排序，然后用a=1&b=2..的形式拼接
    var sortArray = [];

    Object.keys(contents).sort().forEach(function (k) {
      if (contents[k] || contents[k] === false) {
        sortArray.push(k + '=' + contents[k]);
      }
    });

    //对token进行md5，得到的结果追加到sortArray之后
    sortArray.push(md5(yuansfer.token));

    var tempStr = sortArray.join('&');
    // console.log('tempStr:', tempStr);

    //对tempStr 再进行一次md5加密得到verifySign
    var verifySign = md5(tempStr);
    // console.log('veirfySign:', verifySign)

    return verifySign;
  }

  // 创建axios实例
  var service = axios$1.create({
    // baseURL: process.env.BASE_API, // api 的 base_url
    // baseURL: 'https://mapi.yuansfer.com',
    // baseURL: 'https://mapi.yuansfer.yunkeguan.com',
    // baseURL: 'http://zk-tys.yunkeguan.com',
    // #config里面有这个transformRquest，这个选项会在发送参数前进行处理。
    // #这时候我们通过Qs.stringify转换为表单查询参数
    transformRequest: [function (data) {
      data = lib.stringify(data);
      return data;
    }],
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    timeout: 100000 // 请求超时时间
  });

  // request拦截器
  service.interceptors.request.use(function (config) {
    config.url = yuansfer.baseURL + config.url;
    yuansfer.isvFlag == 1 && (config.data.merGroupNo = yuansfer.merGroupNo);
    config.data.merchantNo = yuansfer.merchantNo;
    config.data.storeNo = yuansfer.storeNo;
    config.data.verifySign = calculateVerifySign(config.data);
    // console.log(config.data)
    // config.data = JSON.stringify(config.data)
    return config;
  }, function (error) {
    // Do something with request error
    console.log(error); // for debug
    Promise.reject(error);
  });

  // response 拦截器
  service.interceptors.response.use(function (response) {
    // console.log(response)
    var res = response.data;
    var code = res.ret_code;
    yuansfer.responseXml && (res = jsonToXml.parse(res));
    if (code === '000100') {
      return res;
    } else {
      return Promise.reject(res);
    }
    // return response.data
  }, function (error) {
    console.log('err' + error); // for debug
    return Promise.reject(error);
  });

  /**
   * 支付接口
   * 使用secure-pay() API进行下单，接口成功则返回收银台链接，直接跳转即可
   * V3
   * @param params
   */
  function securePay(params) {
    return service({
      url: '/online/v3/secure-pay',
      method: 'post',
      data: {
        // merchantNo: params.merchantNo,        //required  string	商户号
        // storeNo: params.storeNo,              //required  string	店铺号
        amount: params.amount, //optional  decimal	订单美金金额 amount or rmbAmount有且只能存在一个
        // rmbAmount: params.rmbAmount,          //optional  decimal	订单人民币金额 amount or rmbAmount有且只能存在一个
        currency: params.currency, //required  enum	币种 目前仅支持: "USD"
        settleCurrency: params.settleCurrency, //	String  The settlement currency
        vendor: params.vendor, //required  enum	支付渠道 包括: "alipay", "wechatpay", "unionpay", "creditcard".
        ipnUrl: params.ipnUrl, //required  string	异步通知url地址
        callbackUrl: params.callbackUrl, //required  string	同步回调url地址。同步回调地址支持宏替换规则 xxxcallback_url?trans_no={amount}&amount={amount}, Yuansfer系统会替换{}中的内容.
        terminal: params.terminal, //required  enum	客户端类型 包括: "ONLINE", "WAP".
        reference: params.reference, //required  string	商户系统支付流水号，要求唯一
        description: params.description, //optional  string	订单信息描述，该信息将会展示在收银台，不支持特殊字符
        note: params.note, //optional  string	订单备注信息，该信息将会在回调的时候原样返回给商户系统，不支持特殊字符
        osType: params.osType, //String    When terminal is WAP or APP, we need this parameter, the possible value is "IOS", "ANDROID"
        timeout: params.timeout, //optional  integer	超时时间 默认120，单位分钟
        goodsInfo: params.goodsInfo, //required  string	订单商品信息，使用JSON格式，不支持特殊字符 例如: [{"goods_name":"name1","quantity":"quantity1"},{"goods_name":"name2","quantity":"quantity2"}]
        creditType: params.creditType, //optional  string	信用卡支付类型，只有当vendor=creditcard时需要 包括: "normal"（普通支付）, "recurring"（自动扣款）. 默认为 "normal"
        paymentCount: params.paymentCount, //optional  integer	自动扣款次数，只有当vendor=creditcard, creditType=recurring时需要 0 表示无截止日期
        frequency: params.frequency //optional  integer	自动扣款频率，只有当vendor=creditcard, creditType=recurring时需要 单位'天'
        // verifySign: params.verifySign         //required  string	数字签名    //在request.js 统一计算
      }
    }).then(function (res) {
      // console.log('success', res)
      typeof params.success === 'function' && params.success(res);
      return res;
    }).catch(function (res) {
      // console.log('error', res)
      typeof params.error === 'function' && params.error(res);
      return Promise.reject(res);
    });
  }

  /**
   * 自动扣款修改接口
   * 使用update-recurring() API修改自动扣款规则
   * V3/V2
   * @param params
   */
  function updateRecurring(params) {
    return service({
      url: '/creditpay/v3/update-recurring',
      method: 'post',
      data: {
        // merchantNo: params.merchantNo,        //required  string	商户号
        // storeNo: params.storeNo,              //required  string	店铺号
        scheduleNo: params.scheduleNo, //required  string	自动扣款规则号
        paymentCount: params.paymentCount, //optional  integer	自动扣款次数，只有当vendor=creditcard, creditType=recurring时需要新的paymentCount值必须大于当前设置的值，或者设置为0表示无截止日期
        status: params.status //optional  enum	自动扣款状态，暂时只支持'CANCELLED'， 表示终止自动扣款
        // verifySign: params.verifySign         //required  string	数字签名    //在request.js 统一计算
      }
    }).then(function (res) {
      typeof params.success === 'function' && params.success(res);
      return res;
    }).catch(function (res) {
      typeof params.error === 'function' && params.error(res);
      return Promise.reject(res);
    });
  }

  /**
   * 新增交易(商户扫码)
   * 使用 add() API 可以创建一个 商户扫码 订单
   * V3
   * @param params
   */
  function add(params) {
    return service({
      url: '/app-instore/v3/add',
      method: 'post',
      data: {
        // merchantNo: params.merchantNo,        //required  string	商户号
        // storeNo: params.storeNo,              //required  string	店铺号
        storeAdminNo: params.storeAdminNo, //optional  string	店员号
        amount: params.amount, //optional  decimal	金额
        currency: params.currency, //required  enum	币种 目前仅支持: "USD"
        settleCurrency: params.settleCurrency, //String  The settlement currency
        reference: params.reference, //required  string	商户系统支付流水号，要求唯一
        description: params.description //optional  string	订单信息描述，该信息将会展示在收银台，不支持特殊字符
        // preAuth: params.preAuth,              //optional  string	预付款标志, true表示预付款订单，false为普通订单， 默认false
        // verifySign: params.verifySign         //required  string	数字签名    //在request.js 统一计算
      }
    }).then(function (res) {
      typeof params.success === 'function' && params.success(res);
      return res;
    }).catch(function (res) {
      typeof params.error === 'function' && params.error(res);
      return res;
    });
  }

  /**
   * 支付(商户扫码)
   * 使用 pay() API 将add() 所创建的订单提交支付
   * V3/V2
   * @param params
   */
  function pay(params) {
    return service({
      url: '/app-instore/v3/pay',
      method: 'post',
      data: {
        // merchantNo: params.merchantNo,        //required  string	商户号
        // storeNo: params.storeNo,              //required  string	店铺号
        storeAdminNo: params.storeAdminNo, //optional  string	店员号
        transactionNo: params.transactionNo, //optional  string	Yuansfer系统订单ID  transactionNo 和 reference 有且只能存在一个
        reference: params.reference, //required  string	商户系统支付流水号，要求唯一
        paymentBarcode: params.paymentBarcode, //required string	顾客支付条形码/二维码内容
        vendor: params.vendor //required  enum	支付渠道  包括: "alipay", "wechatpay","unionpay".
        // verifySign: params.verifySign         //required  string	数字签名    //在request.js 统一计算
      }
    }).then(function (res) {
      typeof params.success === 'function' && params.success(res);
      return res;
    }).catch(function (res) {
      typeof params.error === 'function' && params.error(res);
      return Promise.reject(res);
    });
  }

  /**
   * 新增交易(用户扫码)
   * 使用 create-trans-qrcode() API 创建交易二维码，顾客可以通过扫描交易二维码完成支付
   * @param params
   */
  /**
   * response
   * transactionNo	string	Yuansfer系统订单ID
   * reference	string	商户系统支付流水号
   * amount	decimal	金额
   * timeout	integer	超时时间，默认120，单位分钟
   * deepLink	string	支付宝或者微信的deepLink，即支付链接
   * qrcodeUrl	string	根据deepLink生成的二维码
   * ret_msg	string	响应信息
   * ret_code	string	响应码，更多内容参看 here.
   * @param params
   */
  function createTransQrcode(params) {
    return service({
      url: '/app-instore/v3/create-trans-qrcode',
      method: 'post',
      data: {
        // merchantNo: params.merchantNo,        //required  string	商户号
        // storeNo: params.storeNo,              //required  string	店铺号
        storeAdminNo: params.storeAdminNo, //optional  string	店员号
        amount: params.amount, //optional  decimal	金额
        currency: params.currency, //required  enum	币种 目前仅支持: "USD"
        settleCurrency: params.settleCurrency, //String  The settlement currency
        vendor: params.vendor,
        reference: params.reference, //required  string	商户系统支付流水号，要求唯一
        ipnUrl: params.ipnUrl, //optional  string	异步通知url地址
        needQrcode: params.needQrcode, //optional  string	值为: true 或者 false. 默认为 true.  如果值为 true, Yuansfer系统将会创建二维码图片  如果值为 false, Yuansfer系统将不会创建二维码图片
        // preAuth: params.preAuth,              //optional  string	预付款标志, true表示预付款订单，false为普通订单， 默认false
        timeout: params.timeout //optional  integer	超时时间 默认120，单位分钟
        // verifySign: params.verifySign         //required  string	数字签名    //在request.js 统一计算
      }
    }).then(function (res) {
      typeof params.success === 'function' && params.success(res);
      return res;
    }).catch(function (res) {
      typeof params.error === 'function' && params.error(res);
      return Promise.reject(res);
    });
  }

  /**
   * 取消交易
   * 使用 reverse() API 来取消交易
   * 如果顾客还没有支付，取消订单后订单变为关闭状态，顾客也将不能继续支付
   * 如果顾客已经支付完成，取消订单后Yuansfer将原路径退款给顾客
   * V3/V2
   * @param params
   */
  function reverse(params) {
    return service({
      url: '/app-instore/v3/reverse',
      method: 'post',
      data: {
        // merchantNo: params.merchantNo,        //required  string	商户号
        // storeNo: params.storeNo,              //required  string	店铺号
        storeAdminNo: params.storeAdminNo, //optional  string	店员号
        transactionNo: params.transactionNo, //optional  string	Yuansfer系统订单ID  transactionNo 和 reference 有且只能存在一个
        reference: params.reference //required  string	商户系统支付流水号，要求唯一
        // verifySign: params.verifySign         //required  string	数字签名    //在request.js 统一计算
      }
    }).then(function (res) {
      typeof params.success === 'function' && params.success(res);
      return res;
    }).catch(function (res) {
      typeof params.error === 'function' && params.error(res);
      return Promise.reject(res);
    });
  }

  /**
   *
   * 使用 auth-capture()
   * @param params
   */
  function authCapture(params) {
    return service({
      url: '/app-auth/v3/auth-capture',
      method: 'post',
      data: {
        outAuthInfoNo: params.outAuthInfoNo, //	String  merchant system's authorization ID
        outAuthDetailNo: params.outAuthDetailNo, //	String  merchant system's authorization operation ID
        reference: params.reference, //	String  The Invoice Number of the transaction in the merchant’s system
        amount: params.amount, //	Number    The amount to capture.
        currency: params.currency, //	String    The price currency, possible values are 'USD'
        settleCurrency: params.settleCurrency,
        ipnUrl: params.ipnUrl, //	String    Asynchronous callback address
        authConfirmModel: params.authConfirmModel
      }
    }).then(function (res) {
      typeof params.success === 'function' && params.success(res);
      return res;
    }).catch(function (res) {
      typeof params.error === 'function' && params.error(res);
      return Promise.reject(res);
    });
  }

  /**
   *
   * 使用 auth-detail-query()
   * @param params
   */
  function authDetailQuery(params) {
    return service({
      url: '/app-auth/v3/auth-detail-query',
      method: 'post',
      data: {
        outAuthInfoNo: params.outAuthInfoNo, //	String  merchant system's authorization ID
        outAuthDetailNo: params.outAuthDetailNo //	String  merchant system's authorization operation ID
      }
    }).then(function (res) {
      typeof params.success === 'function' && params.success(res);
      return res;
    }).catch(function (res) {
      typeof params.error === 'function' && params.error(res);
      return Promise.reject(res);
    });
  }

  /**
   *
   * 使用 auth-freeze()
   * @param params
   */
  function authFreeze(params) {
    return service({
      url: '/app-auth/v3/auth-freeze',
      method: 'post',
      data: {
        outAuthInfoNo: params.outAuthInfoNo, //	String  merchant system's authorization ID
        outAuthDetailNo: params.outAuthDetailNo, //	String  merchant system's authorization operation ID
        amount: params.amount, //	Number    The amount to capture.
        currency: params.currency, //	String    The price currency, possible values are 'USD'
        settleCurrency: params.settleCurrency,
        authIpnUrl: params.authIpnUrl, //	String    Asynchronous callback address
        vendor: params.vendor, //	String    Possible values are 'alipay'
        paymentBarcode: params.paymentBarcode, //	String    The payment barcode from the customer.
        note: params.note
      }
    }).then(function (res) {
      typeof params.success === 'function' && params.success(res);
      return res;
    }).catch(function (res) {
      typeof params.error === 'function' && params.error(res);
      return Promise.reject(res);
    });
  }

  /**
   *
   * 使用 auth-unfreeze()
   * @param params
   */
  function authUnfreeze(params) {
    return service({
      url: '/app-auth/v3/auth-unfreeze',
      method: 'post',
      data: {
        outAuthInfoNo: params.outAuthInfoNo, //	String  merchant system's authorization ID
        outAuthDetailNo: params.outAuthDetailNo, //	String  merchant system's authorization operation ID
        unfreezeAmount: params.unfreezeAmount, //	Number    The amount to capture.
        currency: params.currency, //	String    The price currency, possible values are 'USD'
        settleCurrency: params.settleCurrency,
        authIpnUrl: params.authIpnUrl //	String    Asynchronous callback address
      }
    }).then(function (res) {
      typeof params.success === 'function' && params.success(res);
      return res;
    }).catch(function (res) {
      typeof params.error === 'function' && params.error(res);
      return Promise.reject(res);
    });
  }

  /**
   *
   * 使用 voucher-create()
   * @param params
   */
  function voucherCreate(params) {
    return service({
      url: '/app-auth/v3/voucher-create',
      method: 'post',
      data: {
        outAuthInfoNo: params.outAuthInfoNo, //	String  merchant system's authorization ID
        outAuthDetailNo: params.outAuthDetailNo, //	String  merchant system's authorization operation ID
        amount: params.amount, //	Number    The amount to capture.
        currency: params.currency, //	String    The price currency, possible values are 'USD'
        settleCurrency: params.settleCurrency,
        authIpnUrl: params.ipnUrl, //	String    Asynchronous callback address
        vendor: params.vendor, //	String    Possible values are 'alipay'
        note: params.note
      }
    }).then(function (res) {
      typeof params.success === 'function' && params.success(res);
      return res;
    }).catch(function (res) {
      typeof params.error === 'function' && params.error(res);
      return Promise.reject(res);
    });
  }

  /**
   * 新增交易(收银机)
   * 使用 cashier-add() 接口来发送请求到圆支付后台创建订单， 同时唤醒圆支付POS
   * V3
   * @param params
   */
  function cashierAdd(params) {
    return service({
      url: '/app-instore/v3/cashier-add',
      method: 'post',
      data: {
        // merchantNo: params.merchantNo,        //required  string	商户号
        // storeNo: params.storeNo,              //required  string	店铺号
        storeAdminNo: params.storeAdminNo, //optional  string	店员号
        amount: params.amount, //optional  decimal	订单美金金额
        currency: params.currency, //required  enum	币种 目前仅支持: "USD"
        settleCurrency: params.settleCurrency, //String  The settlement currency
        transactionNo: params.transactionNo, //optional  string	Yuansfer系统订单ID  transactionNo 和 reference 有且只能存在一个
        reference: params.reference, //required  string	商户系统支付流水号，要求唯一
        ipnUrl: params.ipnUrl //optional  string	异步通知url地址
        // verifySign: params.verifySign         //required  string	数字签名    //在request.js 统一计算
      }
    }).then(function (res) {
      typeof params.success === 'function' && params.success(res);
      return res;
    }).catch(function (res) {
      typeof params.error === 'function' && params.error(res);
      return Promise.reject(res);
    });
  }

  /**
   * 预付款
   * 使用 prepay() API 获得微信小程序支付能力
   * 已改V3
   * @param params
   */
  function prepay(params) {
    return service({
      url: '/micropay/v3/prepay',
      method: 'post',
      data: {
        // merchantNo: params.merchantNo,        //required  string	商户号
        // storeNo: params.storeNo,              //required  string	店铺号
        amount: params.amount, //optional  decimal	订单美金金额 amount or rmbAmount有且只能存在一个
        // rmbAmount: params.rmbAmount,          //optional  decimal	订单人民币金额 amount or rmbAmount有且只能存在一个
        currency: params.currency, //required  enum	币种 目前仅支持: "USD"
        settleCurrency: params.settleCurrency, //	String  The settlement currency, possible values:USD
        vendor: params.vendor, //required  enum	支付渠道 包括: "wechatpay"
        ipnUrl: params.ipnUrl, //required  string	异步通知url地址
        openid: params.openid, //optional  string	微信小程序需要用到
        reference: params.reference, //required  string	商户系统支付流水号，要求唯一
        terminal: params.terminal, //required  enum	客户端类型 "ONLINE", "WAP"
        description: params.description, //optional  string	订单信息描述，该信息将会展示在收银台，不支持特殊字符
        note: params.note, //optional  string	订单备注信息，该信息将会在回调的时候原样返回给商户系统，不支持特殊字符
        timeout: params.timeout //optional  integer	超时时间 默认120，单位分钟
        // verifySign: params.verifySign         //required  string	数字签名    //在request.js 统一计算
      }
    }).then(function (res) {
      typeof params.success === 'function' && params.success(res);
      return res;
    }).catch(function (res) {
      typeof params.error === 'function' && params.error(res);
      return Promise.reject(res);
    });
  }

  /**
   *
   * 使用 braintreePayments
   *
   * @param params
   */
  function braintreePayments(params) {
    return service({
      url: '/creditpay/v3/process',
      method: 'post',
      data: {
        // merchantNo: params.merchantNo,        //required  string	商户号
        // storeNo: params.storeNo,              //required  string	店铺号
        paymentMethodNonce: params.paymentMethodNonce, //required
        paymentMethod: params.paymentMethod, //required    |Credit Card|credit_card||PayPal|paypal_account||Venmo|venmo_account||Google Pay|android_pay_card||Apple Pay|apple_pay_card|
        transactionNo: params.transactionNo //	String
        // verifySign: params.verifySign          //required  string	数字签名    //在request.js 统一计算
      }
    }).then(function (res) {
      typeof params.success === 'function' && params.success(res);
      return res;
    }).catch(function (res) {
      typeof params.error === 'function' && params.error(res);
      return Promise.reject(res);
    });
  }

  /**
   * micropay接口
   * 使用express-pay() API
   * V3
   * @param params
   */
  function expressPay(params) {
    return service({
      url: '/micropay/v3/express-pay',
      method: 'post',
      data: {
        amount: params.amount, //	String  The price amount
        currency: params.currency, //	String  The price currency, possible values: USD,CNY
        settleCurrency: params.settleCurrency, //	String  The settlement currency, possible values:USD
        cardNumber: params.cardNumber, //	String  Card number
        cardExpYear: params.cardExpYear, //	String    Expiration year of the Card.
        cardExpMonth: params.cardExpMonth, //	String    Expiration month of the Card.
        cardCvv: params.cardCvv, //	String    Card CVV.
        reference: params.reference, //	Stirng    The Invoice Number of the transaction in the merchant’s system.
        clientIp: params.clientIp //	String    The IP of merchant’s system.
        // verifySign: params.verifySign	//String  The parameter signature.
      }
    }).then(function (res) {
      typeof params.success === 'function' && params.success(res);
      return res;
    }).catch(function (res) {
      typeof params.error === 'function' && params.error(res);
      return Promise.reject(res);
    });
  }

  /**
   * 退款接口
   * 使用refund() API进行在线支付退款
   * 已改V3
   * @param params
   */
  function refund(params) {
    return service({
      url: '/app-data-search/v3/refund',
      method: 'post',
      data: {
        // merchantNo: params.merchantNo,        //required  string	商户号
        // storeNo: params.storeNo,              //required  string	店铺号
        refundAmount: params.refundAmount, //String  The refund amount in price currency
        currency: params.currency, //String  The three-character currency code that identifies the currency.The possible values are: "USD".
        settleCurrency: params.settleCurrency, //String  The settlement currency
        transactionNo: params.transactionNo, //optional  string	Yuansfer系统订单ID  transactionNo 和 reference 有且只能存在一个
        reference: params.reference, //optional  string	商户系统支付流水号 Either transactionNo or reference 有且只能存在一个
        refundReference: params.refundReference //optional  string	商户系统退款流水号
        // verifySign: params.verifySign         //required  string	数字签名    //在request.js 统一计算
      }
    }).then(function (res) {
      typeof params.success === 'function' && params.success(res);
      return res;
    }).catch(function (res) {
      typeof params.error === 'function' && params.error(res);
      return Promise.reject(res);
    });
  }

  /**
   * 订单查询接口
   * 使用tran-query() API 可以根据商户系统支付流水号查询Yuansfer系统中关联订单的信息
   * V3/V2
   * @param params
   */
  function tranQuery(params) {
    return service({
      url: '/app-data-search/v3/tran-query',
      method: 'post',
      data: {
        // merchantNo: params.merchantNo,        //required  string	商户号
        // storeNo: params.storeNo,              //required  string	店铺号
        transactionNo: params.transactionNo, //optional  string	Yuansfer系统订单ID  transactionNo 和 reference 有且只能存在一个
        reference: params.reference //optional  string	商户系统支付流水号 Either transactionNo or reference 有且只能存在一个
        // verifySign: params.verifySign         //required  string	数字签名    //在request.js 统一计算
      }
    }).then(function (res) {
      typeof params.success === 'function' && params.success(res);
      return res;
    }).catch(function (res) {
      typeof params.error === 'function' && params.error(res);
      return Promise.reject(res);
    });
  }

  /**
   *
   * 使用dataReverse
   * V3/V2
   * @param params
   */
  function dataReverse(params) {
    return service({
      url: '/app-data-search/v3/reverse',
      method: 'post',
      data: {
        // merchantNo: params.merchantNo,        //required  string	商户号
        // storeNo: params.storeNo,              //required  string	店铺号
        transactionNo: params.transactionNo, //optional  string	Yuansfer系统订单ID  transactionNo 和 reference 有且只能存在一个
        reference: params.reference //optional  string	商户系统支付流水号 Either transactionNo or reference 有且只能存在一个
        // verifySign: params.verifySign         //required  string	数字签名    //在request.js 统一计算
      }
    }).then(function (res) {
      typeof params.success === 'function' && params.success(res);
      return res;
    }).catch(function (res) {
      typeof params.error === 'function' && params.error(res);
      return Promise.reject(res);
    });
  }

  /**
   * 接口
   * 使用apply-token() API
   * V3
   * @param params
   */
  function autoDebitApplyToken(params) {
    return service({
      url: '/auto-debit/v3/apply-token',
      method: 'post',
      data: {
        // merchantNo: params.merchantNo,        //required  string	商户号
        autoDebitNo: params.autoDebitNo, //	String   The auto debit record ID
        grantType: params.grantType //	String    Possible value are 'AUTHORIZATION_CODE', 'REFRESH_TOKEN'
      }
    }).then(function (res) {
      // console.log('success', res)
      typeof params.success === 'function' && params.success(res);
      return res;
    }).catch(function (res) {
      // console.log('error', res)
      typeof params.error === 'function' && params.error(res);
      return Promise.reject(res);
    });
  }

  /**
   * 接口
   * 使用Consult() API
   * V3
   * @param params
   */
  function autoDebitConsult(params) {
    return service({
      url: '/auto-debit/v3/consult',
      method: 'post',
      data: {
        note: params.note, //	String    The payment note
        osType: params.osType, //	String    When terminal is WAP or APP, we need this parameter, the possible value is "IOS", "ANDROID"
        osVersion: params.osVersion, //	String    When terminal is WAP or APP, we need this parameter
        autoIpnUrl: params.autoIpnUrl, //	String    Asynchronous callback address
        autoRedirectUrl: params.autoRedirectUrl, //	String  Synchronize the callback address
        autoReference: params.autoReference, //	String    The Invoice Number of the auto-debit in the merchant’s system
        terminal: params.terminal, //	String    The possible values are: "ONLINE", "WAP", "APP"
        vendor: params.vendor
      }
    }).then(function (res) {
      // console.log('success', res)
      typeof params.success === 'function' && params.success(res);
      return res;
    }).catch(function (res) {
      // console.log('error', res)
      typeof params.error === 'function' && params.error(res);
      return Promise.reject(res);
    });
  }

  /**
   * 接口
   * 使用pay() API
   * V3
   * @param params
   */
  function autoDebitPay(params) {
    return service({
      url: '/auto-debit/v3/pay',
      method: 'post',
      data: {
        autoDebitNo: params.autoDebitNo, //	String  The auto debit record ID
        amount: params.amount, //	String  The price amount
        currency: params.currency, //	String  The price currency; USD,CNY,PHP,IDR,KRW,HKD
        settleCurrency: params.settleCurrency, //	String  The settlement currency
        reference: params.reference, //	String  The Invoice Number of the transaction in the merchant’s system
        ipnUrl: params.ipnUrl //	String  Asynchronous callback address
      }
    }).then(function (res) {
      // console.log('success', res)
      typeof params.success === 'function' && params.success(res);
      return res;
    }).catch(function (res) {
      // console.log('error', res)
      typeof params.error === 'function' && params.error(res);
      return Promise.reject(res);
    });
  }

  /**
   * 接口
   * 使用revoke() API
   * V3
   * @param params
   */
  function autoDebitRevoke(params) {
    return service({
      url: '/auto-debit/v3/revoke',
      method: 'post',
      data: {
        autoDebitNo: params.autoDebitNo //	String  The auto debit record ID
      }
    }).then(function (res) {
      // console.log('success', res)
      typeof params.success === 'function' && params.success(res);
      return res;
    }).catch(function (res) {
      // console.log('error', res)
      typeof params.error === 'function' && params.error(res);
      return Promise.reject(res);
    });
  }

  // export default {
  //   securePay,
  //   updateRecurring,
  //   add,
  //   pay,
  //   createTransQrcode,
  //   reverse,
  //   authCapture,
  //   authUnfreeze,
  //   cashierAdd,
  //   prepay,
  //   expressPay,
  //   refund,
  //   tranQuery,
  //   dataReverse,
  //   transList,
  //   settleList,
  //   withdrawalList,
  //   dataStatus
  // }


  var apis = {
    securePay: securePay,
    updateRecurring: updateRecurring,
    add: add,
    pay: pay,
    createTransQrcode: createTransQrcode,
    reverse: reverse,
    cashierAdd: cashierAdd,
    prepay: prepay,
    braintreePayments: braintreePayments,
    expressPay: expressPay,
    refund: refund,
    tranQuery: tranQuery,
    dataReverse: dataReverse,
    authCapture: authCapture,
    authDetailQuery: authDetailQuery,
    authFreeze: authFreeze,
    authUnfreeze: authUnfreeze,
    voucherCreate: voucherCreate,
    autoDebitApplyToken: autoDebitApplyToken,
    autoDebitConsult: autoDebitConsult,
    autoDebitPay: autoDebitPay,
    autoDebitRevoke: autoDebitRevoke
  };

  /**@index 入口文件*/
  // class Yuansfer {
  //   constructor() {
  //   }
  // }

  function Yuansfer() {
    this.merchantNo = null;
    this.storeNo = null;
    this.token = null;
    this.baseURL = null;
    this.isvFlag = null; //必填 1：服务商； 0：普通商户
    this.merGroupNo = null;
    this.responseXml = false;
    this.src = null;
  }

  Yuansfer.prototype._setBaseURL = function (env) {
    env = env || 'prod';
    var baseURL = {
      prod: 'https://mapi.yuansfer.com',
      test: 'https://mapi.yuansfer.yunkeguan.com',
      dev: 'http://zk-tys.yunkeguan.com'
    };
    this.baseURL = env !== 'other' ? baseURL[env] : this.src;
  };

  Yuansfer.prototype.init = function (options) {
    if (!options.merchantNo) {
      console.error('merchantNo could not be null.');
      return false;
    }
    if (!options.storeNo) {
      console.error('storeNo could not be null.');
      return false;
    }
    if (!options.token) {
      console.error('token could not be null.');
      return false;
    }
    if (options.isvFlag != 0 && options.isvFlag != 1) {
      console.error('isvFlag could not be null.');
      return false;
    } else if (options.isvFlag == 1 && !options.merGroupNo) {
      console.error('merGroupNo could not be null.');
      return false;
    }
    this.isvFlag = options.isvFlag;
    this.merGroupNo = options.merGroupNo;
    this.merchantNo = options.merchantNo;
    this.storeNo = options.storeNo;
    this.token = options.token;
    this.responseXml = options.responseXml;
    this.src = options.src;
    this._setBaseURL(options.env);
    Object.assign(Yuansfer.prototype, apis);
  };

  var yuansfer = new Yuansfer();

  return yuansfer;

})));
/** Sat May 08 2021 21:48:02 GMT+0800 (China Standard Time) **/
