export type LogSeverityLevel = keyof typeof LogSecurityLevelEnum;

export const LogSecurityLevelEnum = {
  low: 'low',
  medium: 'medium',
  high: 'high'
} as const satisfies Record<string, string>;

export class LogEntity {
  public createdAt: Date;

  constructor(
    public level: LogSeverityLevel,
    public message: string
  ) {
    this.createdAt = new Date();
  }

  private static validate(data: unknown): data is LogEntity {
    if (typeof data !== 'object' || data === null) return false;
    if (!('level' in data) || !('message' in data)) return false;
    if (typeof data.level !== 'string' || typeof data.message !== 'string') return false;
    if (!Object.keys(LogSecurityLevelEnum).includes(data.level)) return false;

    return true;
  }

  static fromJSON(json: string): LogEntity {
    const data = JSON.parse(json);
    if (!LogEntity.validate(data)) {
      throw new Error('Invalid log data');
    }
    const newLog = new LogEntity(data.level, data.message);
    newLog.createdAt = new Date(data.createdAt);
    
    return newLog;
  }
}