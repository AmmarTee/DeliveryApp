import { Router } from "express";
import { prisma } from "../server.js";

const r = Router();

r.get("/stats", async (_req, res) => {
  const [pending, accepted, delivered] = await Promise.all([
    prisma.request.count({ where: { status: "PENDING" } }),
    prisma.request.count({ where: { status: "ACCEPTED" } }),
    prisma.request.count({ where: { status: "DELIVERED" } })
  ]);
  res.json({ pending, accepted, delivered });
});

r.post("/merchant/:id/toggle", async (req, res) => {
  const id = req.params.id;
  const m = await prisma.merchant.findUnique({ where: { id } });
  if (!m) return res.status(404).json({ error: "not found" });
  const updated = await prisma.merchant.update({ where: { id }, data: { isOpen: !m.isOpen } });
  res.json(updated);
});

export default r;
