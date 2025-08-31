import { Router, Request, Response } from "express";
import { prisma } from "../server";

const r = Router();

r.get("/feed", async (_req: Request, res: Response) => {
  // Later filter by distance. For MVP return latest pending requests.
  const items = await prisma.request.findMany({ where: { status: "PENDING" }, orderBy: { createdAt: "desc" }, take: 20 });
  res.json(items);
});

r.post("/accept", async (req: Request, res: Response) => {
  const { requestId, merchantId, fee, minutes } = req.body;
  const reqRow = await prisma.request.findUnique({ where: { id: requestId } });
  if (!reqRow || reqRow.status !== "PENDING") return res.status(400).json({ error: "not available" });
  const offer = await prisma.offer.create({ data: { requestId, merchantId, fee, minutes, status: "ACCEPTED" } });
  await prisma.request.update({ where: { id: requestId }, data: { status: "ACCEPTED", etaMinutes: minutes, acceptedAt: new Date() } });
  res.json({ ok: true, offer });
});

r.post("/order/:id/status", async (req: Request, res: Response) => {
  const id = req.params.id;
  const { status } = req.body;
  const updated = await prisma.request.update({ where: { id }, data: { status } });
  res.json(updated);
});

export default r;
