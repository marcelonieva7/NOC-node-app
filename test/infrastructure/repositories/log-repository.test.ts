import { LogRepository } from '../../../src/infrastructure/repositories/log-repository';
import type { LogDataSource } from "../../../src/domain/datasources/log.datasource";
import { LogEntity, LogSecurityLevelEnum } from '../../../src/domain/entities/log.entity';

describe('log-repository.ts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockDataSource: LogDataSource = {
    saveLog: jest.fn(),
    getLogs: jest.fn().mockResolvedValue([])
  };

  const logRepository = new LogRepository(mockDataSource);

  const newLog: LogEntity = {
    level : LogSecurityLevelEnum.high,
    message: "test message",
    origin: "test origin",
    createdAt: new Date()
  }
  
  test('should save log correctly', async() => {
    await mockDataSource.saveLog(newLog)

    expect(mockDataSource.saveLog).toHaveBeenNthCalledWith(1, newLog);
    expect(logRepository.saveLog(newLog)).resolves.toBeUndefined();
  });

  test('should get logs correctly', async() => {
    await mockDataSource.getLogs(LogSecurityLevelEnum.high)

    expect(mockDataSource.getLogs).toHaveBeenNthCalledWith(1, LogSecurityLevelEnum.high);
    expect(logRepository.getLogs(LogSecurityLevelEnum.high)).resolves.toEqual([]);
    
  })
});
