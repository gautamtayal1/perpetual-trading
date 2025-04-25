import { Router } from "express";
import prisma from "@repo/db/client";

const balanceRouter: Router = Router();

balanceRouter.get("/:userId", async (req, res) => {
  try {
    const balance = await prisma.user.findUnique({
      where: {
        id: req.params.userId,
      },
    });
    
    if (!balance) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    
    res.json({message: "Balance fetched successfully", user: balance});
  } catch (error) {
    console.error("Error fetching balance:", error);
    res.status(500).json({ error: "Failed to fetch balance" });
  }
});

export default balanceRouter;