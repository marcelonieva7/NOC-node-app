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
  
  private static validateLog(data: unknown): LogEntity {
    if (typeof data !== 'object' || data === null) {
      throw new Error('Invalid log, data is not an object');
    };
    const logKeys:(keyof LogEntityOptions)[] = ['level', 'message', 'origin', 'createdAt'] as const;
    logKeys.forEach(logKey => {
      if (!(logKey in data)) {
        throw new Error(`Missing key: ${logKey}`);
      }

      const validKeysData = data as Record<typeof logKeys[number], unknown>
      if (logKey === 'createdAt' && (validKeysData[logKey] instanceof Date)) {
        return
      }

      if (typeof validKeysData[logKey] !== 'string') {
        throw new Error(`Invalid type for key: ${logKey}, expected string, got ${typeof (data as Record<string, unknown>)[logKey]}`);
      }
    })

    const dataLevel = (data as {level: string}).level.toLowerCase()
    if (!(dataLevel in LogSecurityLevelEnum)) {
      throw new Error(`Invalid log level: ${dataLevel}`);
    }

    const validatedData = data as( {createdAt: string | Date}& Omit<LogEntityOptions, 'createdAt'>)
    const { createdAt, message, origin } = validatedData

    return {
      level: dataLevel as LogSeverityLevel,
      message,
      origin,
      createdAt: createdAt instanceof Date ? createdAt : new Date(createdAt)
    }
  }

  static fromJSON(json: string): LogEntity {
    const object = JSON.parse(json);
    
    return LogEntity.fromObject(object);
  }

  static fromObject(obj: Record<string, any>): LogEntity {
    const validatedLog = LogEntity.validateLog(obj)
    const newLog = new LogEntity(validatedLog);
    
    return newLog;
  }
}