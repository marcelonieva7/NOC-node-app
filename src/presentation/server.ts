import { CheckService } from "../domain/use-cases/checks/check-service";
import { CronService } from "./cron/cron-service";

export class ServerApp {
  constructor() {
  }

  static start() {
    console.log("Server is starting...");

    CronService.createJob(
      "*/5 * * * * *",
      () => {
        const checkService = new CheckService();
        const url = "https://cursos.devtalles.com/";
        checkService.executeCheck(url)
    });

    console.log("Server started successfully.");
  }
}