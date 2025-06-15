import { LogSecurityLevelEnum } from '../../../../../src/domain/entities/log.entity';
import { LogModel } from '../../../../../src/infrastructure/database/mongo/models/log.model';
import { MongoDBHelper } from '../../../../utils/utils-test';

describe('log.model.ts', () => {
  beforeAll(async () => {
    await MongoDBHelper.connect();
  });

  afterAll(async () => {
    await MongoDBHelper.disconnect();
  });

  test('should return log model', async () => {
    const logData = {
      level: 'low',
      message: 'test message',
      origin: 'test origin',
    };
    const log = await LogModel.create(logData);

    expect(log).toEqual(expect.objectContaining({
      ...logData,
      createdAt: expect.any(Date),
      id: expect.any(String)
    }))

    await LogModel.deleteOne({ _id: log.id });
  });

  test('log model should return log schema', async () => {
    const schema = LogModel.schema.obj;

    expect(schema).toEqual({
      createdAt: { type: Date, default: expect.any(Number) },
      level: {
        type: String,
        required: true,
        enum: Object.values(LogSecurityLevelEnum)
      },
      message: { type: String, required: true },
      origin: { type: String, required: true }
    })    
  })
});
