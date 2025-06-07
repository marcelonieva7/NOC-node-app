export type LogSeverityLevel = 'low' | 'medium' | 'hard';

export class LogEntity {
  public createdAt: Date;

  constructor(
    public level: LogSeverityLevel,
    public message: string
  ) {
    this.createdAt = new Date();
  }
}