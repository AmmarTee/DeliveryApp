import express, { Request, Response } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import auth from "./routes/auth";
import customer from "./routes/customer";
import merchant from "./routes/merchant";
import admin from "./routes/admin";

const app = express();
app.use(cors());
app.use(express.json());

export const prisma = new PrismaClient();

app.get("/health", async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false });
  }
});

app.use("/auth", auth);
app.use("/customer", customer);
app.use("/merchant", merchant);
app.use("/admin", admin);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`api on ${port}`));
