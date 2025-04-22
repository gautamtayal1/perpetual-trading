import express from "express";
import orderRouter from "./routes/orderRouter.js";

const app = express();

app.use(express.json());

app.use("/order", orderRouter);

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
