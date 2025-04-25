import express from "express";
import orderRouter from "./routes/orderRouter.js";
import prisma from "@repo/db/client";

const app = express();

app.use(express.json());

// Basic error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.use("/order", orderRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
