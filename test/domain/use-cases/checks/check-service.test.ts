import { LogEntity, LogSecurityLevelEnum } from '../../../../src/domain/entities/log.entity';
import { CheckService } from '../../../../src/domain/use-cases/checks/check-service';
import { mockRepository } from '../../../utils/utils-test';

describe('check-service.ts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  })

  const mockSuccessCallback = jest.fn();
  const mockErrorCallback = jest.fn();

  const checkService = new CheckService(
    mockRepository,
    mockSuccessCallback,
    mockErrorCallback
  );

  const url = {
    good: 'http://google.com',
    wrong: 'http://googlddasdsadase.com'
  }

  const origin = 'check-service.ts';

  test('should save log and call success callback', async () => {
    const result = await checkService.executeCheck(url.good)

    const successLog = new LogEntity({
      level: LogSecurityLevelEnum.low,
      message: expect.stringContaining(url.good),
      origin
    });
    
    expect(mockRepository.saveLog).toHaveBeenCalledWith(expect.objectContaining({
      ...successLog,
      createdAt: expect.any(Date)
    }));
    expect(mockSuccessCallback).toHaveBeenCalled();
    expect(mockErrorCallback).not.toHaveBeenCalled();
    expect(result).toBe(true);    
  });

  test('should save log and call error callback', async () => {
    const result = await checkService.executeCheck(url.wrong)

    const errorLog = new LogEntity({
      level: LogSecurityLevelEnum.high,
      message: expect.stringContaining(url.wrong),
      origin
    });
    
    expect(mockRepository.saveLog).toHaveBeenCalledWith(expect.objectContaining({
      ...errorLog,
      createdAt: expect.any(Date)
    }));
    expect(mockErrorCallback).toHaveBeenCalled();
    expect(mockSuccessCallback).not.toHaveBeenCalled();
    expect(result).toBe(false);
  })

  test('should throw error on response code status != 200', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({
      ok: false
    } as Response));

    await checkService.executeCheck(url.wrong);

    expect(fetchSpy).toHaveBeenCalledWith(url.wrong);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(mockErrorCallback).toHaveBeenCalledWith(
      expect.stringContaining(url.wrong)
    );
    expect(mockSuccessCallback).not.toHaveBeenCalled();
    expect(mockRepository.saveLog).toHaveBeenCalledWith(
      expect.any(LogEntity)
    );    
  })
});
