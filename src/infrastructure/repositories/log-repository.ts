import type { LogDataSource } from "../../domain/datasources/log.datasource";
import type{ LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";
import { LogRepository as LogRepositoryAbstract } from "../../domain/repositories/log.repository";

export class LogRepository implements LogRepositoryAbstract {
  constructor(private readonly logDataSource: LogDataSource) {}

  async saveLog(log: LogEntity): Promise<void> {
    this.logDataSource.saveLog(log);
  }

  async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
    return this.getLogs(severityLevel)
  }
}