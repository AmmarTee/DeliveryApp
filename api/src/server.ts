import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import auth from "./routes/auth.js";
import customer from "./routes/customer.js";
import merchant from "./routes/merchant.js";
import admin from "./routes/admin.js";

const app = express();
app.use(cors());
app.use(express.json());

export const prisma = new PrismaClient();

app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true });
  } catch {
    res.status(500).json({ ok: false });
  }
});

app.use("/auth", auth);
app.use("/customer", customer);
app.use("/merchant", merchant);
app.use("/admin", admin);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`api on ${port}`));
