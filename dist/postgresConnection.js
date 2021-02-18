"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const config_1 = __importDefault(require("config"));
const connectionOptions = {
    type: "postgres",
    host: config_1.default.get('host'),
    port: config_1.default.get('port'),
    username: config_1.default.get('user'),
    password: config_1.default.get('password'),
    database: config_1.default.get('db'),
    synchronize: true,
    logging: false,
    dropSchema: false,
};
const connection = typeorm_1.createConnection(connectionOptions);
exports.default = connection;
