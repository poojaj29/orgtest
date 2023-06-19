export const config = () => ({
  NODE_ENV: process.env.NODE_ENV,
  port: Number(process.env.PORT),
  NATS_URL: process.env.NATS_URL,
  nats: {
    url: process.env.NATS_URL,
    NKEY_SEED: process.env.NKEY_SEED
  }
});
