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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var destr_1 = __importDefault(require("destr"));
var unstorage_1 = require("unstorage");
var fs_1 = __importDefault(require("unstorage/drivers/fs"));
var pipeline_js_1 = require("./modules/match/pipeline.js");
var query_js_1 = require("./modules/query.js");
function jsonFilesQuery(contentPath) {
    var storage = (0, unstorage_1.createStorage)({ driver: (0, fs_1.default)({ base: contentPath }) });
    return initializeQueryContent(storage);
}
exports.default = jsonFilesQuery;
function isJsonFile(key) {
    return key.endsWith('.json');
}
function getContentIds(storage) {
    return __awaiter(this, void 0, void 0, function () {
        var keys;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, storage.getKeys()];
                case 1:
                    keys = _a.sent();
                    return [2 /*return*/, keys.filter(isJsonFile)];
            }
        });
    });
}
function fetchContent(storage, id) {
    return __awaiter(this, void 0, void 0, function () {
        var content;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, storage.getItem(id)];
                case 1:
                    content = _a.sent();
                    return [2 /*return*/, content === null ? { _id: id, body: null } : parseContent(id, content)];
            }
        });
    });
}
function parseContent(id, content) {
    return __awaiter(this, void 0, void 0, function () {
        var parsed, parsedObject;
        return __generator(this, function (_a) {
            if (typeof content !== "string" || !id.endsWith("json")) {
                return [2 /*return*/, content];
            }
            parsed = (0, destr_1.default)(content);
            if (Array.isArray(parsed)) {
                console.warn("JSON array is not supported in ".concat(id, ", moving the array into the `body` key"));
                return [2 /*return*/, { body: parsed }];
            }
            parsedObject = parsed;
            return [2 /*return*/, __assign(__assign({}, parsedObject), { _id: id, _type: "json" })];
        });
    });
}
function getAllContents(storage) {
    return __awaiter(this, void 0, void 0, function () {
        var ids;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getContentIds(storage)];
                case 1:
                    ids = _a.sent();
                    return [2 /*return*/, Promise.all(ids.map(function (id) { return fetchContent(storage, id); }))];
            }
        });
    });
}
function initializeQueryContent(storage) {
    var queryBuilder = (0, query_js_1.createQuery)(function (query) { return (0, pipeline_js_1.createPipelineFetcher)(function () { return getAllContents(storage); })(query); }, { initialParams: {}, legacy: true });
    var originalParamsFn = queryBuilder.params;
    queryBuilder.params = function () {
        var _a;
        var params = originalParamsFn();
        if (!((_a = params.sort) === null || _a === void 0 ? void 0 : _a.length)) {
            params.sort = [{ _file: 1, $numeric: true }];
        }
        return params;
    };
    return queryBuilder;
}
