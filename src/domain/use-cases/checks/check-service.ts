interface CheckServiceUseCase {
  executeCheck(url: string): Promise<boolean>;
}

export class CheckService implements CheckServiceUseCase {
  constructor() {
  }

  async executeCheck(url: string): Promise<boolean> {
    try {
       const req = await fetch(url)
      if (!req.ok) {
        throw new Error(`Error on check service: ${url}`);
      }
      console.log(`Check service executed successfully: ${url}`);

      return true;
    } catch (error) {
      console.error(error);

      return false;      
    }
  }
}