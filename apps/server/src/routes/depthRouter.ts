import { Router } from "express";
import prisma from "@repo/db/client";

const depthRouter: Router = Router();

depthRouter.get("/", async (req, res) => {
  const depth = await prisma.depth.findFirst({
    where: {
      id: "BTCUSDT",
    },
  });
  res.json(depth);
});

export default depthRouter;