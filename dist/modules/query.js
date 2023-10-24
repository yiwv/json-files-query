"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createQuery = void 0;
var utils_1 = require("./match/utils");
var arrayParams = ['sort', 'where', 'only', 'without'];
function createQuery(fetcher, opts) {
    if (opts === void 0) { opts = {}; }
    var queryParams = {};
    for (var _i = 0, _a = Object.keys(opts.initialParams || {}); _i < _a.length; _i++) {
        var key = _a[_i];
        queryParams[key] = arrayParams.includes(key) ? (0, utils_1.ensureArray)(opts.initialParams[key]) : opts.initialParams[key];
    }
    /**
     * Factory function to create a parameter setter
     */
    var $set = function (key, fn) {
        if (fn === void 0) { fn = function (v) { return v; }; }
        return function () {
            var values = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                values[_i] = arguments[_i];
            }
            queryParams[key] = fn.apply(void 0, values);
            return query;
        };
    };
    var resolveResult = function (result) {
        var _a;
        if (opts.legacy) {
            if (result === null || result === void 0 ? void 0 : result.surround) {
                return result.surround;
            }
            if (!result) {
                return result;
            }
            if (result === null || result === void 0 ? void 0 : result.dirConfig) {
                result.result = __assign(__assign({ _path: (_a = result.dirConfig) === null || _a === void 0 ? void 0 : _a._path }, result.result), { _dir: result.dirConfig });
            }
            return (result === null || result === void 0 ? void 0 : result._path) || Array.isArray(result) || !Object.prototype.hasOwnProperty.call(result, 'result') ? result : result === null || result === void 0 ? void 0 : result.result;
        }
        return result;
    };
    var query = {
        params: function () { return (__assign(__assign(__assign({}, queryParams), (queryParams.where ? { where: __spreadArray([], (0, utils_1.ensureArray)(queryParams.where), true) } : {})), (queryParams.sort ? { sort: __spreadArray([], (0, utils_1.ensureArray)(queryParams.sort), true) } : {}))); },
        only: $set('only', utils_1.ensureArray),
        without: $set('without', utils_1.ensureArray),
        where: $set('where', function (q) { return __spreadArray(__spreadArray([], (0, utils_1.ensureArray)(queryParams.where), true), (0, utils_1.ensureArray)(q), true); }),
        sort: $set('sort', function (sort) { return __spreadArray(__spreadArray([], (0, utils_1.ensureArray)(queryParams.sort), true), (0, utils_1.ensureArray)(sort), true); }),
        limit: $set('limit', function (v) { return parseInt(String(v), 10); }),
        skip: $set('skip', function (v) { return parseInt(String(v), 10); }),
        // find
        find: function () { return fetcher(query).then(resolveResult); },
        findOne: function () { return fetcher($set('first')(true)).then(resolveResult); },
        count: function () { return fetcher($set('count')(true)).then(resolveResult); },
        // locale
        locale: function (_locale) { return query.where({ _locale: _locale }); },
        withSurround: $set('surround', function (surroundQuery, options) { return (__assign({ query: surroundQuery }, options)); }),
        withDirConfig: function () { return $set('dirConfig')(true); }
    };
    if (opts.legacy) {
        // @ts-ignore
        query.findSurround = function (surroundQuery, options) {
            return query.withSurround(surroundQuery, options).find().then(resolveResult);
        };
        return query;
    }
    return query;
}
exports.createQuery = createQuery;
