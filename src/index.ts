import express from "express";
import { usersRouter } from "./routes/users";
import initFirebase from "./lib/firebase";
initFirebase()
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = express();

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.use("/users", usersRouter);

app.listen(process.env.PORT, () => {
  console.log(`app listening at http://localhost:${process.env.PORT}`);
});
