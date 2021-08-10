"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = require("./routes/users");
const firebase_1 = __importDefault(require("./lib/firebase"));
firebase_1.default();
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const app = express_1.default();
app.get("/", (req, res) => {
    res.send("Hello world!");
});
app.use("/users", users_1.usersRouter);
app.listen(process.env.PORT, () => {
    console.log(`app listening at http://localhost:${process.env.PORT}`);
});
