import { LogEntity, LogSecurityLevelEnum } from '../../../../src/domain/entities/log.entity';
import { CheckServiceMultiple } from '../../../../src/domain/use-cases/checks/check-service-multiple';

describe('check-service.ts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  })

  const mockRepositoryOne = {
    saveLog: jest.fn(),
    getLogs: jest.fn()
  };

  const mockRepositoryTwo = {
    saveLog: jest.fn(),
    getLogs: jest.fn()
  };

  const mockRepositories = [mockRepositoryOne, mockRepositoryTwo];
  const mockSuccessCallback = jest.fn();
  const mockErrorCallback = jest.fn();

  const checkServiceMultiple = new CheckServiceMultiple(
    mockRepositories,
    mockSuccessCallback,
    mockErrorCallback
  );

  const url = {
    good: 'http://google.com',
    wrong: 'http://googlddasdsadase.com'
  }

  const origin = 'check-service.ts';

  test('should save log in all repositories and call success callback', async () => {
    const result = await checkServiceMultiple.executeCheck(url.good)

    const successLog = new LogEntity({
      level: LogSecurityLevelEnum.low,
      message: expect.stringContaining(url.good),
      origin
    });
    
    mockRepositories.forEach(repository => {
      expect(repository.saveLog).toHaveBeenCalledWith(expect.objectContaining({
        ...successLog,
        createdAt: expect.any(Date)
      }));  
    })
    
    expect(mockSuccessCallback).toHaveBeenCalled();
    expect(mockErrorCallback).not.toHaveBeenCalled();
    expect(result).toBe(true);    
  });

  test('should save log and call error callback', async () => {
    const result = await checkServiceMultiple.executeCheck(url.wrong)

    const errorLog = new LogEntity({
      level: LogSecurityLevelEnum.high,
      message: expect.stringContaining(url.wrong),
      origin
    });

    mockRepositories.forEach(repository => {
      expect(repository.saveLog).toHaveBeenCalledWith(expect.objectContaining({
        ...errorLog,
        createdAt: expect.any(Date)
      }));  
    })
    expect(mockErrorCallback).toHaveBeenCalled();
    expect(mockSuccessCallback).not.toHaveBeenCalled();
    expect(result).toBe(false);
  })

  test('should throw error on response code status != 200', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({
      ok: false
    } as Response));

    await checkServiceMultiple.executeCheck(url.wrong);

    expect(fetchSpy).toHaveBeenCalledWith(url.wrong);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(mockErrorCallback).toHaveBeenCalledWith(
      expect.stringContaining(url.wrong)
    );
    expect(mockSuccessCallback).not.toHaveBeenCalled();
    mockRepositories.forEach(repository => {
      expect(repository.saveLog).toHaveBeenCalledWith(
        expect.any(LogEntity)
      );
    })

    fetchSpy.mockRestore();
    
  })
});
