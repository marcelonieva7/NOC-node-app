import { ServerApp } from "./presentation/server"

const main = async () => {
  ServerApp.start();
}

main().catch((error) => {
  console.error("An error occurred:", error);
  process.exit(1);
});