import { Router } from "express";
import prisma from "@repo/db/client";

const positionRouter: Router = Router();

positionRouter.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  const position = await prisma.position.findUnique({
    where: {
      userId: userId,
    },
  });
  res.json(position);
});

export default positionRouter;