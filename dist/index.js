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
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./db"));
const redis_1 = __importDefault(require("./redis"));
const os_1 = __importDefault(require("os"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield redis_1.default.ping();
        console.log('Reddis connected!');
        next();
    }
    catch (err) {
        console.error('Redis connection failed:', err);
        res.status(500).send('Redis is not available');
    }
}));
app.get("/", (req, res) => {
    res.send("Hello, World!");
});
app.get("/info", (req, res) => {
    res.send(`current host is ${os_1.default.hostname}`);
});
app.get("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield db_1.default.promise().query("SELECT * FROM users");
        res.json(rows);
    }
    catch (err) {
        res.status(500).json({ error: "Database query failed", err: { err } });
    }
}));
app.get("/setRedis/:key/:value", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { key, value } = req.params;
        if (!key || !value) {
            return res.status(400).send('Please provide both "key" and "value" as query parameters.');
        }
        yield redis_1.default.set(key, value);
        res.status(200).send(`Key "${key}" set to value "${value}" in Redis.`);
    }
    catch (err) {
        res.status(500).json({ error: "Database query failed", err: { err } });
    }
}));
app.get("/getRedis/:key/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { key } = req.params;
        if (!key) {
            return res.status(400).send('Please provide "key" parameter');
        }
        var value = yield redis_1.default.get(key);
        res.status(200).send(`Value for the Key "${key}" is "${value}".`);
    }
    catch (err) {
        res.status(500).json({ error: "Database query failed", err: { err } });
    }
}));
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
