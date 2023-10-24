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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMatch = void 0;
var utils_js_1 = require("./utils.js");
function createMatch(opts) {
    if (opts === void 0) { opts = {}; }
    var operators = createOperators(match, opts.operators);
    function match(item, conditions) {
        // Match Regex and simple values
        if (typeof conditions !== 'object' || conditions instanceof RegExp) {
            return operators.$eq(item, conditions);
        }
        return Object.keys(conditions || {}).every(function (key) {
            var condition = conditions[key];
            if (key.startsWith('$') && operators[key]) {
                var fn = operators[key];
                return typeof fn === 'function' ? fn(item, condition) : false;
            }
            return match((0, utils_js_1.get)(item, key), condition);
        });
    }
    return match;
}
exports.createMatch = createMatch;
function createOperators(match, operators) {
    if (operators === void 0) { operators = {}; }
    return __assign({ $match: function (item, condition) { return match(item, condition); }, 
        /**
         * Match if item equals condition
         **/
        $eq: function (item, condition) { return condition instanceof RegExp ? condition.test(item) : item === condition; }, 
        /**
         * Match if item not equals condition
         **/
        $ne: function (item, condition) { return condition instanceof RegExp ? !condition.test(item) : item !== condition; }, 
        /**
         * Match is condition is false
         **/
        $not: function (item, condition) { return !match(item, condition); }, 
        /**
         * Match only if all of nested conditions are true
         **/
        $and: function (item, condition) {
            (0, utils_js_1.assertArray)(condition, '$and requires an array as condition');
            return condition.every(function (cond) { return match(item, cond); });
        }, 
        /**
         * Match if any of nested conditions is true
         **/
        $or: function (item, condition) {
            (0, utils_js_1.assertArray)(condition, '$or requires an array as condition');
            return condition.some(function (cond) { return match(item, cond); });
        }, 
        /**
         * Match if item is in condition array
         **/
        $in: function (item, condition) { return (0, utils_js_1.ensureArray)(condition).some(function (cond) { return Array.isArray(item) ? match(item, { $contains: cond }) : match(item, cond); }); }, 
        /**
         * Match if item contains every condition or math every rule in condition array
         **/
        $contains: function (item, condition) {
            item = Array.isArray(item) ? item : String(item);
            return (0, utils_js_1.ensureArray)(condition).every(function (i) { return item.includes(i); });
        }, 
        /**
         * Ignore case contains
         **/
        $icontains: function (item, condition) {
            if (typeof condition !== 'string') {
                throw new TypeError('$icontains requires a string, use $contains instead');
            }
            item = String(item).toLocaleLowerCase();
            return (0, utils_js_1.ensureArray)(condition).every(function (i) { return item.includes(i.toLocaleLowerCase()); });
        }, 
        /**
         * Match if item contains at least one rule from condition array
         */
        $containsAny: function (item, condition) {
            (0, utils_js_1.assertArray)(condition, '$containsAny requires an array as condition');
            item = Array.isArray(item) ? item : String(item);
            return condition.some(function (i) { return item.includes(i); });
        }, 
        /**
         * Check key existence
         */
        $exists: function (item, condition) { return (condition ? typeof item !== 'undefined' : typeof item === 'undefined'); }, 
        /**
         * Match if type of item equals condition
         */
        $type: function (item, condition) { return typeof item === String(condition); }, 
        /**
         * Provides regular expression capabilities for pattern matching strings.
         */
        $regex: function (item, condition) {
            if (!(condition instanceof RegExp)) {
                var matched = String(condition).match(/\/(.*)\/([dgimsuy]*)$/);
                condition = matched ? new RegExp(matched[1], matched[2] || '') : new RegExp(condition);
            }
            return condition.test(String(item || ''));
        }, 
        /**
         * Check if item is less than condition
         */
        $lt: function (item, condition) {
            return item < condition;
        }, 
        /**
         * Check if item is less than or equal to condition
         */
        $lte: function (item, condition) {
            return item <= condition;
        }, 
        /**
         * Check if item is greater than condition
         */
        $gt: function (item, condition) {
            return item > condition;
        }, 
        /**
         * Check if item is greater than or equal to condition
         */
        $gte: function (item, condition) {
            return item >= condition;
        } }, (operators || {}));
}
