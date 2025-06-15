import mongoose from 'mongoose';
import { MongoDB } from '../../../../src/infrastructure/database/mongo/init';

describe('init mongo', () => {

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('should connect to mongo db', async () => {
    const { MONGO_URL, MONGO_DB_NAME } = process.env

    if (!MONGO_URL || !MONGO_DB_NAME) {
      throw new Error('Missing environment variables')
    }

    await expect( MongoDB.connect({
      dbName: MONGO_DB_NAME,
      uri: MONGO_URL
    })).resolves.toBeUndefined();
  });

  test('should fail to connect to mongo db', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(()=>{});

    await expect( MongoDB.connect({
      dbName: 'test',
      uri: 'wrong_uri'
    })).rejects.toBeInstanceOf(Error);

    expect(consoleSpy).toHaveBeenCalled();
  });

});
