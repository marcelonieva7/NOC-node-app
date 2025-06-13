import { LogDataSource } from "../../domain/datasources/log.datasource";
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";
import { PrismaClient, SecurityLevel } from "../../generated/prisma";

type LevelEnum = Record<LogSeverityLevel, SecurityLevel>

const prismaClient = new PrismaClient();

export class PostgresLogDataSource implements LogDataSource {

  private static levelEnum: LevelEnum = {
    high: SecurityLevel.HIGH,
    medium: SecurityLevel.MEDIUM,
    low: SecurityLevel.LOW
  }

  private getDBLevel(level: LogSeverityLevel): SecurityLevel {
    return PostgresLogDataSource.levelEnum[level]
  }
  async saveLog(log: LogEntity): Promise<void> {
    const { level, ...logData} = log
    const data = {
      ...logData,
      level: this.getDBLevel(level)
    }
    const newLog = await prismaClient.log.create({data});
    console.log('New log saved:', newLog.id);
  }
  async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
    const level = this.getDBLevel(severityLevel)
    const logs = await prismaClient.log.findMany(
      {where: {level}}
    )

    return logs.map(LogEntity.fromObject)    
  }
}