import express from "express";
import orderRouter from "./routes/orderRouter.js";
import cors from "cors";
import depthRouter from "./routes/depthRouter.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/order", orderRouter);
app.use("/depth", depthRouter);

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
