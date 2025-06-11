import { EmailService } from "../../../presentation/email/email-service";
import { LogEntity, LogSecurityLevelEnum } from "../../entities/log.entity";
import { LogRepository } from "../../repositories/log.repository";

interface SendLogsEmailUseCase {
  execute: (to: string | string[]) => Promise<boolean>;
}

const origin = "send-logs-email.use-case.ts";

export class SendLogsEmail implements SendLogsEmailUseCase {
  constructor(
    private readonly logRepository: LogRepository,
    private readonly emailService: EmailService
  ) {}

  async execute(to: string | string[]) {
    try {
      await this.emailService.sendEmailWithFSLogs(to);
      const log = new LogEntity({
        level: LogSecurityLevelEnum.low,
        message: `Email sent to ${Array.isArray(to) ? to.join(", ") : to}`,
        origin
      })
      await this.logRepository.saveLog(log);
        return true;
    } catch (error) {
      const log = new LogEntity({
        level: LogSecurityLevelEnum.high,
        message: `Error sending email to ${Array.isArray(to) ? to.join(", ") : to}: ${error instanceof Error ? error.message : String(error)}`,
        origin
      });
      await this.logRepository.saveLog(log);

      return false;
    }
  }

}