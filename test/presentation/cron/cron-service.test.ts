import { CronService } from '../../../src/presentation/cron/cron-service';
import { CronJob } from "cron";

describe('cron-service.ts', () => {
  test('should create cron job', () => {
    const spyCronJob = jest.spyOn(CronJob.prototype, 'start').mockImplementation(() => {});
    const mockCallback = jest.fn();
    const cronExpression = '* * * * * *';
    const job = CronService.createJob(cronExpression, mockCallback);

    expect(spyCronJob).toHaveBeenCalledTimes(1);
    expect(job).toBeInstanceOf(CronJob);
    
  });
});