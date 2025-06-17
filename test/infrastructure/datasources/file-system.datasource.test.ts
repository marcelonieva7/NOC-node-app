import fs from 'node:fs';
import { FileSystemDataSource } from '../../../src/infrastructure/datasources/file-system.datasource';
import path from 'node:path';
import { LogEntity, LogSecurityLevelEnum, LogSeverityLevel } from '../../../src/domain/entities/log.entity';

function createLogFromLevel(level: LogSeverityLevel): LogEntity {
  return new LogEntity({
    level,
    message: "test message",
    origin: "test origin",
  });
}

type LogPathsKey = Exclude<LogSeverityLevel, 'low'> | 'all'

const logsPaths = {
  all: `logs-all.log`,
  medium: `logs-medium.log`,
  high : `logs-high.log`
} as const satisfies Record<LogPathsKey, `${string}.log`>;

describe('file-system.datasource.ts', () => {
  const logPath = path.join(__dirname, '../../../logs/');

  beforeEach(() => {
    fs.rmSync(logPath, {recursive: true, force: true});
  })
  test('should create log files if they do not exist', () => {
    new FileSystemDataSource();
    
    expect(fs.existsSync(logPath)).toBe(true);
    expect(fs.existsSync(path.join(logPath, logsPaths.all))).toBe(true);
    expect(fs.existsSync(path.join(logPath, logsPaths.medium))).toBe(true);
    expect(fs.existsSync(path.join(logPath, logsPaths.high))).toBe(true);
  });

  test('should save medium log correctly', async () => {
    const fsDataSource = new FileSystemDataSource();
    const level = LogSecurityLevelEnum.medium;
    const newLog = createLogFromLevel(level);

    await fsDataSource.saveLog(newLog);

    expect(fs.readFileSync(path.join(logPath, logsPaths.all), 'utf8')).toContain(JSON.stringify(newLog));
    expect(fs.readFileSync(path.join(logPath, logsPaths.medium), 'utf8')).toContain(JSON.stringify(newLog));
    expect(fs.readFileSync(path.join(logPath, logsPaths.high), 'utf8')).not.toContain(JSON.stringify(newLog));
  });

  test('should save low log correctly', async () => {
    const fsDataSource = new FileSystemDataSource();
    const level = LogSecurityLevelEnum.low;
    const newLog = createLogFromLevel(level);

    await fsDataSource.saveLog(newLog);

    expect(fs.readFileSync(path.join(logPath, logsPaths.all), 'utf8')).toContain(JSON.stringify(newLog));
    expect(fs.readFileSync(path.join(logPath, logsPaths.medium), 'utf8')).not.toContain(JSON.stringify(newLog));
    expect(fs.readFileSync(path.join(logPath, logsPaths.high), 'utf8')).not.toContain(JSON.stringify(newLog));
  });

  test('should get all logs medium correctly', async () => {
    const fsDataSource = new FileSystemDataSource();
    const level = LogSecurityLevelEnum.medium;
    const newLog = createLogFromLevel(level);

    await fsDataSource.saveLog(newLog);

    expect(await fsDataSource.getLogs(level)).toEqual([newLog]);
  })

  test('should get all logs high correctly', async () => {
    const fsDataSource = new FileSystemDataSource();
    const level = LogSecurityLevelEnum.high;
    const newLog = createLogFromLevel(level);
    const newLog2 = {
      ...newLog,
      message: "test message 2"
    }

    await fsDataSource.saveLog(newLog);
    await fsDataSource.saveLog(newLog2);

    expect(await fsDataSource.getLogs(level)).toEqual([newLog, newLog2]);
  })

  test('should get an empty array if there are no logs', async () => {
    const fsDataSource = new FileSystemDataSource();
    const level = LogSecurityLevelEnum.high;

    expect(await fsDataSource.getLogs(level)).toEqual([]);
  })

  test('should return an empty array if log file does not exist', async () => {
    const fsDataSource = new FileSystemDataSource();
    fs.rmSync(path.join(logPath, logsPaths.medium), {recursive: true, force: true});

    expect(await fsDataSource.getLogs(LogSecurityLevelEnum.medium)).toEqual([]);
  })

  test('should return an empty array if log level is low', async () => {
    const fsDataSource = new FileSystemDataSource();

    expect(await fsDataSource.getLogs(LogSecurityLevelEnum.low)).toEqual([]);
  })

  test('should throw an error if log severity level is invalid', async () => {
    const fsDataSource = new FileSystemDataSource();
    const invalidLevel = 'invalid' as LogSeverityLevel

    expect(() => fsDataSource.getLogs(invalidLevel)).rejects.toThrow(
      new Error(`Invalid severity level: ${invalidLevel}`)
    );
  })

});
