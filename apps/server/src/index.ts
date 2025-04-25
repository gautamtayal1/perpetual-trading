import express from "express";
import orderRouter from "./routes/orderRouter.js";
import cors from "cors";
import depthRouter from "./routes/depthRouter.js";
import positionRouter from "./routes/positionRouter.js";
import balanceRouter from "./routes/balanceRouter.js";
const app = express();

app.use(express.json());
app.use(cors());

app.use("/order", orderRouter);
app.use("/depth", depthRouter);
app.use("/position", positionRouter);
app.use("/balance", balanceRouter);

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
