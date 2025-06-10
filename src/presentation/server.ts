import { CheckService } from "../domain/use-cases/checks/check-service";
import { LogRepository } from "../infrastructure/repositories/log-repository";
import { FileSystemDataSource } from "../infrastructure/datasources/file-system.datasource";
import { CronService } from "./cron/cron-service";

const logRepository = new LogRepository(
  new FileSystemDataSource()
);

export class ServerApp {
  constructor() {
  }

  static start() {
    console.log("Server is starting...");

    CronService.createJob(
      "*/5 * * * * *",
      () => {
        const url = "https://cursos.devtalles.com/courses/";
        const checkService = new CheckService(
          logRepository,
          () => console.log(`${url} is OK`),
          error => console.error(error)          
        );
        checkService.executeCheck(url)
    });

    console.log("Server started successfully.");
  }
}