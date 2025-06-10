import "dotenv/config";
import { createApp } from "./createApp.js";

const port = process.env.PORT;

async function start(){
  try {
      const app = await createApp();
      app.listen(port, () => {
        console.log(`✅ Slopify listening on port ${port}`);
      })
    }
     catch (error) {
    console.error("❌ Erreur de démarrage de l'application :", error);
}};
start();
