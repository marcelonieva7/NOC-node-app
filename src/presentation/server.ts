import { CheckService } from "../domain/use-cases/checks/check-service";
import { LogRepository } from "../infrastructure/repositories/log-repository";
import { FileSystemDataSource } from "../infrastructure/datasources/file-system.datasource";
import { CronService } from "./cron/cron-service";
import { EmailService } from "./email/email-service";
import { SendLogsEmail } from "../domain/use-cases/email/send-logs";

const logRepository = new LogRepository(
  new FileSystemDataSource()
);
const emailService = new EmailService();
const sendLogsEmail = new SendLogsEmail(logRepository, emailService);

export class ServerApp {
  constructor() {
  }

/*   static async start() {
    await sendLogsEmail.execute(['marcelonieva7@gmail.com']);
  } */

  static start() {
    console.log("Server is starting...");

    CronService.createJob(
      "*/5 * * * * *",
      () => {
        const url = "https://cursos.devtalles.com/courses/";
        const checkService = new CheckService(
          logRepository,
          /* () => console.log(`${url} is OK`),
          error => console.error(error)      */     
        );
        checkService.executeCheck(url)
    });

    console.log("Server started successfully.");
  }
}