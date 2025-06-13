import fs from 'fs';
import { LogDataSource } from "../../domain/datasources/log.datasource";
import {
  LogEntity,
  type LogSeverityLevel
} from "../../domain/entities/log.entity";

type LogPathsKey = Exclude<LogSeverityLevel, 'low'> | 'all'

export class FileSystemDataSource implements LogDataSource {
  private readonly logPath = 'logs/'; 
  private readonly logsPaths = {
    all: `${this.logPath}logs-all.log`,
    medium: `${this.logPath}logs-medium.log`,
    high : `${this.logPath}logs-high.log`
  } as const satisfies Record<LogPathsKey, `${typeof this.logPath}${string}.log`>;

  constructor() {
    this.createLogFiles();
  }

  private createLogFiles(): void {
    // Ensure the log directory exists
    if (!fs.existsSync(this.logPath)) {
      fs.mkdirSync(this.logPath);
    }

    // Create log files if they do not exist
    Object.values(this.logsPaths).forEach((path) => {
      if (!fs.existsSync(path)) fs.writeFileSync(path, '');
    })
  }

  async saveLog(newLog: LogEntity): Promise<void> {
    const logEntry = `${JSON.stringify(newLog)}\n`
    const {all:allLogsPath, ...logsPaths } = this.logsPaths

    // Save all logs to the 'all' log file
    fs.appendFileSync(allLogsPath, logEntry);

    // Save logs based on their severity level (excluding 'low')
    if (newLog.level === 'low') return;
    fs.appendFileSync(logsPaths[newLog.level], logEntry );
  }

  private getLogsFromFile(path: string): LogEntity[] {
    if (!fs.existsSync(path)) {
      return [];
    }
    const fileContent = fs.readFileSync(path, 'utf-8');
    if (!fileContent) {
      return [];
    }
    const logEntries = fileContent.trim().split('\n').filter(Boolean);

    return logEntries.map(LogEntity.fromJSON);
  }

  async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
    const logRetrievers = {
      high: () => this.getLogsFromFile(this.logsPaths.high),
      low: () => [], // 'low' logs are not saved in a file
      medium: () => this.getLogsFromFile(this.logsPaths.medium)
    } as const satisfies Record<LogSeverityLevel, () => LogEntity[]>;

    const retrieveLogs = logRetrievers[severityLevel] ?? (() => {
      throw new Error(`Invalid severity level: ${severityLevel}`);
    });

    return retrieveLogs();
  }
}