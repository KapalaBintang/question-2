const corsOption = {
  origin: process.env.NODE_ENV === "production" ? process.env.CLIENT_URL : process.env.CLIENT_URL_DEV,
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE"],
};
