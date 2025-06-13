import { envsPlugin } from "./config/plugins/envs.plugin";
import { MongoDB } from "./infrastructure/database/mongo/init";
import { ServerApp } from "./presentation/server"

const main = async () => {
  await MongoDB.connect({
    dbName: envsPlugin.MONGO_DB_NAME,
    uri: envsPlugin.MONGO_URL,
  })

  ServerApp.start();
}

main().catch((error) => {
  console.error("An error occurred:", error);
  process.exit(1);
});