import { LogEntity, LogSecurityLevelEnum} from '../../../src/domain/entities/log.entity';

describe('log.entity.ts', () => {
  const logData = {
    level: LogSecurityLevelEnum.low,
    message: 'test message',
    origin: 'test origin',
    createdAt: new Date()
  } as const

  test('should create log entity instance', () => {
    const log = new LogEntity(logData);

    expect(log).toBeInstanceOf(LogEntity);
    expect(log).toEqual({
      ...logData,
      createdAt: expect.any(Date)
    })
  });

  test('should parse a log from json string', () => {
    const { createdAt } = logData;
    const logJson = JSON.stringify(logData)
    const log = LogEntity.fromJSON(logJson);

    expect(() => LogEntity.fromJSON(logJson)).not.toThrow();
    expect(log).toBeInstanceOf(LogEntity);
    expect(log).toEqual({
      ...JSON.parse(logJson),
      createdAt
    })
  })

  test('fromObject should throw error when invalid log level is provided', () => {
    const logWithInvalidLevel = {
      ...logData,
      level: 'invalid'
    }
    expect(() => LogEntity.fromObject(logWithInvalidLevel)).toThrow('Invalid log level: invalid');
  })

  test('fromObject should throw error when log data not an object', () => {
    const logData = 'not an object' as unknown as LogEntity;

    expect(() => LogEntity.fromObject(logData)).toThrow('Invalid log, data is not an object');
  })

  test('fromObject should throw error when log data is null', () => {
    const logData = null as unknown as LogEntity;

    expect(() => LogEntity.fromObject(logData)).toThrow('Invalid log, data is not an object');
  })

  test('fromObject should throw error when log data is missing a key', () => {
    const requiredKeys = ['level', 'message', 'origin', 'createdAt'] as const
    const logData = {
      level: 'low',
      message: 'test message',
      origin: 'test origin',
      createdAt: new Date().toDateString()
    }

    requiredKeys.forEach(key => {
      const originalKey = logData[key];
      delete logData[key];

      expect(() => LogEntity.fromObject(logData)).toThrow(`Missing key: ${key}`);
      logData[key] = originalKey;
    })
  })

  test('fromObject should throw error when log data property has invalid type', () => {
    const requiredKeys = ['level', 'message', 'origin', 'createdAt'] as const
    const logData = {
      level: 'low',
      message: 'test message',
      origin: 'test origin',
      createdAt: new Date().toDateString()
    }

    requiredKeys.forEach(key => {
      const originalKey = logData[key];
      logData[key] = undefined as unknown as string;

      expect(() => LogEntity.fromObject(logData)).toThrow(`Invalid type for key: ${key}, expected string, got undefined`);
      logData[key] = originalKey;
    })
  })

  test('fromObject should validate log if createdAt is instanceof Date', () => {
    const log = LogEntity.fromObject(logData);

    expect(log).toBeInstanceOf(LogEntity);
    expect(() => LogEntity.fromObject(logData)).not.toThrow();
    expect(log).toEqual(logData)
  })
    
});
