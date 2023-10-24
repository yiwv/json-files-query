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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPipelineFetcher = void 0;
var ufo_1 = require("ufo");
var utils_1 = require("./utils");
var _1 = require(".");
function createPipelineFetcher(getContentsList) {
    var _this = this;
    // Create Matcher
    var match = (0, _1.createMatch)();
    /**
     * Exctract surrounded items of specific condition
     */
    var surround = function (data, _a) {
        var query = _a.query, before = _a.before, after = _a.after;
        var matchQuery = typeof query === 'string' ? { _path: query } : query;
        // Find matched item index
        var index = data.findIndex(function (item) { return match(item, matchQuery); });
        before = before !== null && before !== void 0 ? before : 1;
        after = after !== null && after !== void 0 ? after : 1;
        var slice = new Array(before + after).fill(null, 0);
        return index === -1 ? slice : slice.map(function (_, i) { return data[index - before + i + Number(i >= before)] || null; });
    };
    var matchingPipelines = [
        // Conditions
        function (state, params) {
            var filtered = state.result.filter(function (item) { return (0, utils_1.ensureArray)(params.where).every(function (matchQuery) { return match(item, matchQuery); }); });
            return __assign(__assign({}, state), { result: filtered, total: filtered.length });
        },
        // Sort data
        function (state, params) { return (0, utils_1.ensureArray)(params.sort).forEach(function (options) { return (0, utils_1.sortList)(state.result, options); }); },
        function fetchSurround(state, params, db) {
            var _a;
            if (params.surround) {
                var _surround = surround(((_a = state.result) === null || _a === void 0 ? void 0 : _a.length) === 1 ? db : state.result, params.surround);
                _surround = (0, utils_1.apply)((0, utils_1.withoutKeys)(params.without))(_surround);
                _surround = (0, utils_1.apply)((0, utils_1.withKeys)(params.only))(_surround);
                // @ts-ignore
                state.surround = _surround;
            }
            return state;
        }
    ];
    var transformingPiples = [
        // Skip first items
        function (state, params) {
            if (params.skip) {
                return __assign(__assign({}, state), { result: state.result.slice(params.skip), skip: params.skip });
            }
        },
        // Pick first items
        function (state, params) {
            if (params.limit) {
                return __assign(__assign({}, state), { result: state.result.slice(0, params.limit), limit: params.limit });
            }
        },
        function fetchDirConfig(state, params, db) {
            var _a, _b, _c;
            if (params.dirConfig) {
                var path_1 = ((_a = state.result[0]) === null || _a === void 0 ? void 0 : _a._path) || ((_c = (_b = params.where) === null || _b === void 0 ? void 0 : _b.find(function (w) { return w._path; })) === null || _c === void 0 ? void 0 : _c._path);
                if (typeof path_1 === 'string') {
                    var dirConfig = db.find(function (item) { return item._path === (0, ufo_1.joinURL)(path_1, '_dir'); });
                    if (dirConfig) {
                        // @ts-ignore
                        state.dirConfig = __assign({ _path: dirConfig._path }, (0, utils_1.withoutKeys)(['_'])(dirConfig));
                    }
                }
            }
            return state;
        },
        // Remove unwanted fields
        function (state, params) { return (__assign(__assign({}, state), { result: (0, utils_1.apply)((0, utils_1.withoutKeys)(params.without))(state.result) })); },
        // Select only wanted fields
        function (state, params) { return (__assign(__assign({}, state), { result: (0, utils_1.apply)((0, utils_1.withKeys)(params.only))(state.result) })); }
    ];
    return function (query) { return __awaiter(_this, void 0, void 0, function () {
        var db, params, result1, matchedData, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getContentsList()];
                case 1:
                    db = _a.sent();
                    params = query.params();
                    result1 = {
                        result: db,
                        limit: 0,
                        skip: 0,
                        total: db.length
                    };
                    matchedData = matchingPipelines.reduce(function ($data, pipe) { return pipe($data, params, db) || $data; }, result1);
                    // return count if query is for count
                    if (params.count) {
                        return [2 /*return*/, {
                                result: matchedData.result.length
                            }];
                    }
                    result = transformingPiples.reduce(function ($data, pipe) { return pipe($data, params, db) || $data; }, matchedData);
                    // return first item if query is for single item
                    if (params.first) {
                        return [2 /*return*/, __assign(__assign({}, (0, utils_1.omit)(['skip', 'limit', 'total'])(result)), { result: result.result[0] })];
                    }
                    return [2 /*return*/, result];
            }
        });
    }); };
}
exports.createPipelineFetcher = createPipelineFetcher;
