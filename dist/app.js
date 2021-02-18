"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const route_1 = __importDefault(require("./routes/route"));
const app = express_1.default();
const port = process.env.PORT || 3500;
app.use(body_parser_1.default.urlencoded({
    extended: true
}));
app.use('/', route_1.default);
app.use(body_parser_1.default.json());
app.listen(port, () => console.log(`App running on PORT : ${port}`));
