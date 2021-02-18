"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const valid_url_1 = __importDefault(require("valid-url"));
const shortid_1 = __importDefault(require("shortid"));
const config_1 = __importDefault(require("config"));
const postgresConnection_1 = __importDefault(require("../postgresConnection"));
const Links_1 = require("../entity/Links");
const moment_1 = __importDefault(require("moment"));
exports.createLinks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { longUrl } = req.body;
    const baseUrl = config_1.default.get('baseUrl');
    if (!valid_url_1.default.isUri(baseUrl)) {
        return res.status(401).json('Invalid base url');
    }
    if (!longUrl || !valid_url_1.default.isUri(longUrl)) {
        return res.status(401).json('Please enter a valid long URI');
    }
    postgresConnection_1.default.then((connection) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const linkRepository = connection.getRepository(Links_1.Links);
            const link = yield linkRepository.findOne({
                where: {
                    longUrl: longUrl
                }
            });
            if (link && link.shortUrl) {
                return res.status(201).json({
                    shortURL: link.shortUrl
                });
            }
            const urlCode = shortid_1.default.generate();
            const newLinkObj = new Links_1.Links();
            newLinkObj.code = urlCode;
            newLinkObj.date = moment_1.default();
            newLinkObj.longUrl = longUrl;
            newLinkObj.shortUrl = `${baseUrl}${urlCode}`;
            yield linkRepository.save(newLinkObj);
            return res.send(201).json({
                shortURL: newLinkObj.shortUrl
            });
        }
        catch (e) {
            return res.send(500).json('Interval Server Error');
        }
    })).catch(err => {
        return res.send(500).json('Internal SErver Error');
    });
});
