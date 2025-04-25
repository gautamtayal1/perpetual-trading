import { Router } from "express";
import { addToQueue } from "@repo/queue";
import prisma from "@repo/db/client";

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

orderRouter.post("/cancel", async (req, res) => {
  try {
    const order = await addToQueue(req.body);
    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// Get order by ID
orderRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: { trades: true }
    });
    
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

export default orderRouter;