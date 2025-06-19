
import { PostgresLogDataSource } from '../../../src/infrastructure/datasources/postgres-log.datasource';

jest.mock('../../../src/generated/prisma', () => ({
  PrismaClient: jest.fn(() => ({
    log: {
      create: jest.fn(({level})=> ({
        level,
        message: 'test message',
        origin: 'test origin',
        createdAt: new Date()
      })),
      findMany: jest.fn(()=> [newLog, newLog])
    }
  })),
  SecurityLevel: {
    HIGH: 'high',
    MEDIUM: 'medium',
    LOW: 'low'
  } 
}));

const newLog = {
  level: 'high',
  message: 'test message',
  origin: 'test origin',
  createdAt: new Date()
} as const

describe('postgres-log.datasource.ts', () => {
  const postgresLogDS = new PostgresLogDataSource();

  test('should save log correctly', async () => {
    expect(postgresLogDS.saveLog(newLog)).resolves.toBeUndefined();
  });

  test('should get all logs correctly', () => {
    const getLogsPromise = postgresLogDS.getLogs('low')
    
    expect(getLogsPromise).resolves.toEqual([newLog, newLog]);
  })
});
