"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureArray = exports.assertArray = exports.sortList = exports.withKeys = exports.withoutKeys = exports.detectProperties = exports.apply = exports.omit = exports.pick = exports.get = void 0;
/**
 * Retrive nested value from object by path
 */
var get = function (obj, path) { return path.split('.').reduce(function (acc, part) { return acc && acc[part]; }, obj); };
exports.get = get;
var _pick = function (obj, condition) {
    return Object.keys(obj)
        .filter(condition)
        .reduce(function (newObj, key) {
        var _a;
        return Object.assign(newObj, (_a = {}, _a[key] = obj[key], _a));
    }, {});
};
/**
 * Returns a new object with the specified keys
 **/
var pick = function (keys) { return function (obj) { return keys && keys.length ? _pick(obj, function (key) { return keys.includes(key); }) : obj; }; };
exports.pick = pick;
/**
 * Returns a new object with all the keys of the original object execept the ones specified.
 **/
var omit = function (keys) { return function (obj) {
    return keys && keys.length ? _pick(obj, function (key) { return !keys.includes(key); }) : obj;
}; };
exports.omit = omit;
/**
 * Apply a function to each element of an array
 */
var apply = function (fn) { return function (data) { return Array.isArray(data) ? data.map(function (item) { return fn(item); }) : fn(data); }; };
exports.apply = apply;
var detectProperties = function (keys) {
    var prefixes = [];
    var properties = [];
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
        if (['$', '_'].includes(key)) {
            prefixes.push(key);
        }
        else {
            properties.push(key);
        }
    }
    return { prefixes: prefixes, properties: properties };
};
exports.detectProperties = detectProperties;
var withoutKeys = function (keys) {
    if (keys === void 0) { keys = []; }
    return function (obj) {
        if (keys.length === 0 || !obj) {
            return obj;
        }
        var _a = (0, exports.detectProperties)(keys), prefixes = _a.prefixes, properties = _a.properties;
        return _pick(obj, function (key) { return !properties.includes(key) && !prefixes.includes(key[0]); });
    };
};
exports.withoutKeys = withoutKeys;
var withKeys = function (keys) {
    if (keys === void 0) { keys = []; }
    return function (obj) {
        if (keys.length === 0 || !obj) {
            return obj;
        }
        var _a = (0, exports.detectProperties)(keys), prefixes = _a.prefixes, properties = _a.properties;
        return _pick(obj, function (key) { return properties.includes(key) || prefixes.includes(key[0]); });
    };
};
exports.withKeys = withKeys;
/**
 * Sort list of items by givin options
 */
var sortList = function (data, params) {
    var comperable = new Intl.Collator(params.$locale, {
        numeric: params.$numeric,
        caseFirst: params.$caseFirst,
        sensitivity: params.$sensitivity
    });
    var keys = Object.keys(params).filter(function (key) { return !key.startsWith('$'); });
    var _loop_1 = function (key) {
        data = data.sort(function (a, b) {
            var values = [(0, exports.get)(a, key), (0, exports.get)(b, key)]
                .map(function (value) {
                // `null` values are treated as `"null"` strings and ordered alphabetically
                // Turn `null` values into `undefined` so they place at the end of the list
                if (value === null) {
                    return undefined;
                }
                // Convert Date object to ISO string
                if (value instanceof Date) {
                    return value.toISOString();
                }
                return value;
            });
            if (params[key] === -1) {
                values.reverse();
            }
            return comperable.compare(values[0], values[1]);
        });
    };
    for (var _i = 0, keys_2 = keys; _i < keys_2.length; _i++) {
        var key = keys_2[_i];
        _loop_1(key);
    }
    return data;
};
exports.sortList = sortList;
/**
 * Raise TypeError if value is not an array
 */
var assertArray = function (value, message) {
    if (message === void 0) { message = 'Expected an array'; }
    if (!Array.isArray(value)) {
        throw new TypeError(message);
    }
};
exports.assertArray = assertArray;
/**
 * Ensure result is an array
 */
var ensureArray = function (value) {
    return (Array.isArray(value) ? value : [undefined, null].includes(value) ? [] : [value]);
};
exports.ensureArray = ensureArray;
