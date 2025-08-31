import { Router, Request, Response } from "express";
import { prisma } from "../server";

const r = Router();

r.post("/request", async (req: Request, res: Response) => {
  const { customerId, addressId, items, note } = req.body;
  if (!customerId || !addressId || !items) return res.status(400).json({ error: "missing fields" });
  const created = await prisma.request.create({
    data: { customerId, addressId, itemsJson: items, note }
  });
  res.json(created);
});

r.post("/request/:id/cancel", async (req: Request, res: Response) => {
  const id = req.params.id;
  const updated = await prisma.request.update({ where: { id }, data: { status: "CANCELED" } });
  res.json(updated);
});

r.post("/request/:id/confirm-delivered", async (req: Request, res: Response) => {
  const id = req.params.id;
  const updated = await prisma.request.update({ where: { id }, data: { status: "DELIVERED" } });
  res.json(updated);
});

r.post("/rating", async (req: Request, res: Response) => {
  const { requestId, customerId, merchantId, stars, comment } = req.body;
  const rating = await prisma.rating.create({ data: { requestId, customerId, merchantId, stars, comment } });
  res.json(rating);
});

export default r;
