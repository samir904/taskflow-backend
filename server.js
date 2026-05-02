import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import app from "./app.js";
import dbConnection from "./CONFIG/db.config.js";

const PORT = process.env.PORT || 5014;

async function startServer() {
  await dbConnection();
  app.listen(PORT, () => {
    console.log(`🚀 APP IS LISTENING ON: ${PORT}!`);
  });
}

startServer();