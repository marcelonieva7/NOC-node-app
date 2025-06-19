import { CronJob } from "cron";

type CronExpression = string | Date;


export class CronService {

  static createJob(
    cronExpression: CronExpression,
    task: () => void
  ): CronJob {
    
    const job = new CronJob(
      cronExpression,
      task
    );    
    job.start();
    
    return job;
  }
}