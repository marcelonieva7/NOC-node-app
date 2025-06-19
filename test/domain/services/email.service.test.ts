import { BaseEmailService, SendEmailOptions } from "../../../src/domain/services/email.service";

describe('BaseEmailService', () => {
  class MockEmailService extends BaseEmailService {
    sendEmailWithFSLogs = jest.fn(()=> Promise.resolve());
    sendEmail = jest.fn(()=> Promise.resolve());
  }
  test('should be implemented', () => {
    const mockEmailService = new MockEmailService();
    mockEmailService.sendEmailWithFSLogs()
    mockEmailService.sendEmail()
    
    expect(mockEmailService).toBeDefined();
    expect(mockEmailService.sendEmailWithFSLogs).toHaveReturnedWith(Promise.resolve());
    expect(mockEmailService.sendEmail).toHaveReturnedWith(Promise.resolve());
  });
});