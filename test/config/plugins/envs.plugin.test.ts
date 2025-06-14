import { envsPlugin} from '../../../src/config/plugins/envs.plugin';

describe('envs.plugin.ts', () => {
  test('should load environment variables', () => {
    expect(envsPlugin).toEqual({
      PORT: expect.any(Number),
      MAILER_SERVICE: expect.any(String),
      MAILER_EMAIL: expect.any(String),
      MAILER_PASSWORD: expect.any(String),
      PROD: expect.any(Boolean),
      MONGO_URL: expect.any(String),
      MONGO_DB_NAME: expect.any(String),
      MONGO_USER: expect.any(String),
      MONGO_PASSWORD: expect.any(String),
      POSTGRES_URL: expect.any(String),
      POSTGRES_USER: expect.any(String),
      POSTGRES_PASSWORD: expect.any(String),
      POSTGRES_DB: expect.any(String)
    })
  });
});
