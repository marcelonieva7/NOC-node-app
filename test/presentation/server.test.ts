import { ServerApp, startMessage } from '../../src/presentation/server';
import { CronService } from "../../src/presentation/cron/cron-service";

jest.mock('../../src/presentation/cron/cron-service');

describe('server.ts', () => {
  const consoleLogSpy = jest
    .spyOn(console, 'log')
    .mockImplementation(() => {});
  test('start should start server ', () => {
    expect(()=>ServerApp.start()).not.toThrow();
    expect(CronService.createJob).toHaveBeenCalledTimes(1);
    expect(consoleLogSpy).toHaveBeenNthCalledWith(1, startMessage);
  });
});
