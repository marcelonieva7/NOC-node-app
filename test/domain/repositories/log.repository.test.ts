import { LogRepository } from "../../../src/domain/repositories/log.repository";

describe('LogRepository Base Class', () => {

  class MockLogRepository extends LogRepository {

    saveLog = jest.fn(() => Promise.resolve())
    
    getLogs = jest.fn(()=> Promise.resolve([]));
    
  }
  test('should be implemented', () => {
    const logRepository = new MockLogRepository();
    logRepository.saveLog()
    logRepository.getLogs()

    expect(logRepository).toBeDefined();
    expect(logRepository.saveLog).toHaveReturnedWith(Promise.resolve());
    expect(logRepository.getLogs).toHaveReturnedWith(Promise.resolve([]));
  });
});