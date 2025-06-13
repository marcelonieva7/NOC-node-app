import {
  LogRepository as LogRepositoryAbstract
} from '../../repositories/log.repository';
import { LogEntity, LogSecurityLevelEnum } from '../../entities/log.entity';

interface CheckServiceMultipleUseCase {
  executeCheck(url: string): Promise<boolean>;
}

type SuccessCallback = () => void
type ErrorCallback = (error: string) => void

const origin = 'check-service.ts';

export class CheckServiceMultiple implements CheckServiceMultipleUseCase {
  constructor(
    private readonly logRepository: LogRepositoryAbstract[],
    private readonly successCallback?: SuccessCallback,
    private readonly errorCallback?: ErrorCallback
  ) {
  }

  private saveMultipleSources(log: LogEntity) {
    for (const logRepository of this.logRepository) {
      logRepository.saveLog(log)
    }
  }

  async executeCheck(url: string): Promise<boolean> {
    try {
      const req = await fetch(url)
      if (!req.ok) {
        throw new Error(`Error on check service: ${req.status} ${req.statusText}`);
      }

      const log = new LogEntity({
        level: LogSecurityLevelEnum.low,
        message: `Check service executed successfully: ${url}`,
        origin
      });
      this.saveMultipleSources(log)
      this.successCallback && this.successCallback()

      return true;
    } catch (error) {
      const errorStr = 
        `Error on check service ${url} : ${error}`;
      this.errorCallback && this.errorCallback(errorStr)
      const log = new LogEntity({
        level: LogSecurityLevelEnum.high,
        message: errorStr,
        origin
      });
      this.saveMultipleSources(log)

      return false;      
    }
  }
}