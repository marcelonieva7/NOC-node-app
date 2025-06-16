import {
  LogEntity,
  LogSecurityLevelEnum,
} from "../../../src/domain/entities/log.entity";
import { LogModel } from "../../../src/infrastructure/database/mongo/models/log.model";
import { MongoLogDBDataSource } from "../../../src/infrastructure/datasources/mongo-log.datasource";
import { MongoDBHelper } from "../../utils/utils-test";

describe("mongo-log.datasource.ts", () => {
  const mongoLogDS = new MongoLogDBDataSource();
  const level = LogSecurityLevelEnum.medium;
  const newLog = new LogEntity({
    level,
    message: "test message",
    origin: "test origin",
  });

  beforeAll(async () => {
    await MongoDBHelper.connect();
  });

  afterAll(async () => {
    await MongoDBHelper.disconnect();
  });

  beforeEach(async () => {
    await LogModel.deleteMany();
    jest.restoreAllMocks();
  });

  test("should save log correctly", async () => {
    const spyConsole = jest.spyOn(console, "log").mockImplementation(() => {});
    await mongoLogDS.saveLog(newLog);

    expect(spyConsole).toHaveBeenNthCalledWith(
      1,
      expect.any(String),
      expect.any(String)
    );
  });

  test("should get logs", async () => {
    const spyModel = jest.spyOn(LogModel, "find");
    await mongoLogDS.saveLog(newLog);
    await mongoLogDS.saveLog(newLog);

    const logs = await mongoLogDS.getLogs(level);

    expect(logs.length).toBe(2);
    expect(spyModel).toHaveBeenCalledWith({ level });

    logs.forEach((log) => {
      expect(log.level).toBe(level);
    });
  });
});
