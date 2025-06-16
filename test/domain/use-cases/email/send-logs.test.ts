import { LogEntity } from '../../../../src/domain/entities/log.entity';
import { SendLogsEmail } from '../../../../src/domain/use-cases/email/send-logs';
import { mockRepository } from '../../../utils/utils-test';

describe('send-logs.ts', () => {
  const mockEmailService = {
    sendEmail: jest.fn(),
    sendEmailWithFSLogs: jest.fn()
  }
  const sendLogsEmail = new SendLogsEmail(
    mockRepository,
    mockEmailService
  );
  const destinations = ["email1", "email2"];

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  })

  test('should catch error and return false', async () => {
    const error = new Error('error');

    mockEmailService.sendEmailWithFSLogs.mockImplementation(() => {
      throw error;
    })
    const result = await sendLogsEmail.execute(destinations);

    expect(mockEmailService.sendEmailWithFSLogs).toHaveBeenCalledWith(destinations);
    expect(mockRepository.saveLog).toHaveBeenCalledWith(
      expect.any(LogEntity)
    )
    expect(result).toBe(false);
  });

  test('should send email with logs to all destinations', async () => {
    const result = await sendLogsEmail.execute(destinations);

    expect(mockEmailService.sendEmailWithFSLogs).toHaveBeenNthCalledWith(1, destinations);
    expect(mockRepository.saveLog).toHaveBeenNthCalledWith(1,
      expect.any(LogEntity)
    )
    expect(result).toBe(true);
  });

  test('should send email with logs to one destination', async () => {
    const destination = 'email_test@test.com';
    const result = await sendLogsEmail.execute(destination);

    expect(mockEmailService.sendEmailWithFSLogs).toHaveBeenCalledWith(destination);
    expect(mockRepository.saveLog).toHaveBeenCalledWith(
      expect.any(LogEntity)
    )
    expect(result).toBe(true);
  });
});
