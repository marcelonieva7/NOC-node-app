import { MongoDB } from '../src/infrastructure/database/mongo/init';
import { ServerApp } from '../src/presentation/server';

describe('app.ts', () => {
  const MongoSpy = jest
    .spyOn(MongoDB, 'connect')
    .mockImplementation(() => undefined as unknown as Promise<void>);
  const startSpy = jest
    .spyOn(ServerApp, 'start')
    .mockImplementation(() => {});

  beforeEach(() => {
    jest.clearAllMocks();
  })
  test('should call main and start server', async () => {
    const { main } = await import('../src/app');

    expect(startSpy).toHaveBeenCalledTimes(1);
    expect(MongoSpy).toHaveBeenCalledTimes(1);
    expect(main()).resolves.toBeUndefined();
  });

  test('should catch and handle error on app start', async () => {
    const err = Error('error')
    const exitCode = 1
    MongoSpy.mockImplementation(() => {
      throw err;
    });
    
    const processSpy = jest
      .spyOn(process, 'exit')
      .mockImplementation(() => undefined as unknown as never);
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const { main, handleError } = await import('../src/app');

    expect(startSpy).not.toHaveBeenCalled();
    expect(()=> main()).rejects.toThrow(err);

    handleError(err);
    
    expect(processSpy).toHaveBeenNthCalledWith(1,exitCode);
    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(String), err);
  })
  
});
