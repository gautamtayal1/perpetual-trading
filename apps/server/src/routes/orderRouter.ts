import { Router } from "express";
import { addToQueue } from "@repo/queue";
const orderRouter: Router = Router();

orderRouter.post("/create", async (req, res) => {
  try {
    const order = await addToQueue(req.body);
    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

export default orderRouter;