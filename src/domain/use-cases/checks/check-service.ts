import {
  LogRepository as LogRepositoryAbstract
} from '../../repositories/log.repository';
import { LogEntity, LogSecurityLevelEnum } from '../../entities/log.entity';

interface CheckServiceUseCase {
  executeCheck(url: string): Promise<boolean>;
}

type SuccessCallback = () => void
type ErrorCallback = (error: string) => void

export class CheckService implements CheckServiceUseCase {
  constructor(
    private readonly logRepository: LogRepositoryAbstract,
    private readonly successCallback: SuccessCallback,
    private readonly errorCallback: ErrorCallback
  ) {
  }

  async executeCheck(url: string): Promise<boolean> {
    try {
       const req = await fetch(url)
      if (!req.ok) {
        throw new Error(`Error on check service: ${req.status} ${req.statusText}`);
      }

      const log = new LogEntity(
        LogSecurityLevelEnum.low,
        `Check service executed successfully: ${url}`
      );
      this.logRepository.saveLog(log)
      this.successCallback()

      return true;
    } catch (error) {
      const errorStr = 
        `Error on check service ${url} : ${error}`;
      this.errorCallback(errorStr)
      const log = new LogEntity(
        LogSecurityLevelEnum.high,
        errorStr
      );
      this.logRepository.saveLog(log)

      return false;      
    }
  }
}