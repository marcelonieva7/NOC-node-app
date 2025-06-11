export type LogSeverityLevel = keyof typeof LogSecurityLevelEnum;

export const LogSecurityLevelEnum = {
  low: 'low',
  medium: 'medium',
  high: 'high'
} as const satisfies Record<string, string>;

export type LogEntityOptions = {
  level: LogSeverityLevel;
  message: string;
  createdAt?: Date;
  origin: string;
}

export type LogEntityJson = Omit<LogEntity, 'createdAt'> & {
  createdAt: string;
};

export class LogEntity {
  public createdAt: Date;
  public level: LogSeverityLevel;
  public message: string;
  public origin: string;

  constructor({ level, message, createdAt = new Date(), origin }: LogEntityOptions) {
    this.createdAt = createdAt;
    this.level = level;
    this.message = message;
    this.origin = origin;
  }

  private static validate(data: unknown): data is LogEntityJson {
    if (typeof data !== 'object' || data === null) return false;
    if (
      !('level' in data) ||
      !('message' in data) ||
      !('origin' in data) ||
      !('createdAt' in data)
    ) return false;
    if (
      typeof data.level !== 'string' ||
      typeof data.message !== 'string' ||
      typeof data.origin !=='string' ||
      typeof data.createdAt !=='string'
    ) return false;
    if (!Object.keys(LogSecurityLevelEnum).includes(data.level)) return false;

    return true;
  }

  static fromJSON(json: string): LogEntity {
    const data = JSON.parse(json);
    if (!LogEntity.validate(data)) {
      throw new Error('Invalid log data');
    }
    const { level, message, createdAt, origin } = data;
    const newLog = new LogEntity({
      level,
      message,
      origin,
      createdAt: new Date(createdAt)
    });
    
    return newLog;
  }
}