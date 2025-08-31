import twilio from "twilio";

const sid = process.env.TWILIO_SID;
const token = process.env.TWILIO_TOKEN;
const from = process.env.TWILIO_FROM;

const client = sid && token ? twilio(sid, token) : null;

const store = new Map<string, string>();

export async function sendOtp(phone: string) {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  store.set(phone, code);
  if (client && from) {
    await client.messages.create({ to: phone, from, body: `Your code is ${code}` });
  } else {
    console.log(`OTP for ${phone}: ${code}`);
  }
  return true;
}

export function verifyOtp(phone: string, code: string) {
  const ok = store.get(phone) === code;
  if (ok) store.delete(phone);
  return ok;
}
