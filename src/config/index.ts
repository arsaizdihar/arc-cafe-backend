import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 5000;

const token = {
  secret: process.env.TOKEN_SECRET || "thisissecret",
  expireTime: Number(process.env.TOKEN_EXPIRE) || 3600,
  issuer: process.env.TOKEN_ISSUER || "default issuer",
};

const origin = (process.env.ORIGIN || "http://localhost").split(" ");

export default {
  PORT,
  token,
  origin,
  DEV: process.env.NODE_ENV !== "production",
};
