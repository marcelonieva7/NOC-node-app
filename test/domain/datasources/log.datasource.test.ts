import { LogDataSource } from '../../../src/domain/datasources/log.datasource';
import { LogEntity, LogSeverityLevel } from '../../../src/domain/entities/log.entity';


describe('LogDataSource', () => {
  test('abstract class should be implemented', () => {
    const newLog: LogEntity = {
      level: 'low',
      message: 'test message',
      origin: 'test origin',
      createdAt: new Date()
    }
    class LogDataSourceImplementation extends LogDataSource {
      saveLog(log: LogEntity): Promise<void> {
        return Promise.resolve();
      }
      getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
        return Promise.resolve([newLog]);
      }
    }
    const logDataSource = new LogDataSourceImplementation();

    expect(logDataSource).toBeInstanceOf(LogDataSource);
    expect(typeof logDataSource.getLogs).toBe('function');
    expect(typeof logDataSource.saveLog).toBe('function');

    expect(logDataSource.getLogs('low')).resolves.toEqual([newLog]);
    expect(logDataSource.saveLog(newLog)).resolves.toBeUndefined();
  });
});
