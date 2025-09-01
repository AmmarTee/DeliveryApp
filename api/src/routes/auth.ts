import { Router } from "express";
import { prisma } from "../server.js";
import { sendOtp, verifyOtp } from "../services/otp.js";

const r = Router();

r.post("/start", async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: "phone required" });
  await sendOtp(phone);
  res.json({ ok: true });
});

r.post("/verify", async (req, res) => {
  const { phone, code, role } = req.body;
  if (!verifyOtp(phone, code)) return res.status(401).json({ error: "invalid code" });
  const user = await prisma.user.upsert({
    where: { phone },
    create: { phone, role: role === "MERCHANT" ? "MERCHANT" : "CUSTOMER" },
    update: {}
  });
  res.json({ token: "dummy", user });
});

export default r;
