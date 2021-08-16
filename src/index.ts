import express from "express";
import morgan from "morgan";
import {RegisterRoutes} from "./routes/routes";
import initFirebase from "./lib/firebase";
import swaggerUi from "swagger-ui-express";
initFirebase()

const app = express();

app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static("public"));

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "/swagger.json",
    },
  })
);

RegisterRoutes(app)



app.listen(process.env.PORT, () => {
  console.log(`app listening at http://localhost:${process.env.PORT}`);
});
