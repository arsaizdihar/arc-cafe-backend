const PORT = process.env.PORT || 5000;

const token = {
  secret: process.env.TOKEN_SECRET || "thisissecret",
  expireTime: Number(process.env.TOKEN_EXPIRE) || 3600,
  issuer: process.env.TOKEN_ISSUER || "default issuer",
};

export default {
  PORT,
  token,
};
