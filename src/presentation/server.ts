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
        const url = "https://cursos.devtalles.com/";
        const checkService = new CheckService(
          () => console.log(`${url} is OK`),
          error => console.error(error)          
        );
        checkService.executeCheck(url)
    });

    console.log("Server started successfully.");
  }
}