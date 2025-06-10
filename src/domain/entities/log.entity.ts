export type LogSeverityLevel = 'low' | 'medium' | 'hard';

export class LogEntity {
  public createdAt: Date;

  constructor(
    public level: LogSeverityLevel,
    public message: string
  ) {
    this.createdAt = new Date();
  }

  static fromJSON(json: string): LogEntity {
    const data = JSON.parse(json);
    const newLog = new LogEntity(data.level, data.message);
    newLog.createdAt = new Date(data.createdAt);
    
    return newLog;
  }
}