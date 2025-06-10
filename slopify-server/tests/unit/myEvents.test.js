// myEvents.test.js
import { ObjectId } from "mongodb";
import { jest } from "@jest/globals";
import { getUserByEmail } from "../../db.js";

// Define mocks
const toArrayMock = jest.fn().mockResolvedValue([{ id: 1 }]);
const findMock = jest.fn(() => ({ toArray: toArrayMock }));
const collectionMock = jest.fn(() => ({ find: findMock }));
const mockDb = { collection: collectionMock };

// Mock the db module BEFORE importing any other code
await jest.unstable_mockModule("../../db.js", () => {
  return {
    ObjectId,
    getDb: () => mockDb,
    startDB: () => {},
    closeDB: () => {},
    CreateUser: () => {},
    getUserByEmail: () =>  {}
  };
});

// Dynamically import the test target AFTER mocking
const { myEvents } = await import("../../graphql/resolvers.js");
const { getDb } = await import("../../db.js");

describe("myEvents", () => {
  beforeEach(() => {
    findMock.mockClear();
    toArrayMock.mockClear();
  });

  it("should return [] if no user in context", async () => {
    const result = await myEvents(null, null, {});
    expect(result).toEqual([]);
  });

  it("should return events from the db", async () => {
    const db = getDb();
    const mockEvents = [{ id: 1 }, { id: 2 }];
    toArrayMock.mockResolvedValue(mockEvents);

    const context = { user: { id: "user123" } };
    const result = await myEvents(null, null, context);

    expect(db.collection).toHaveBeenCalledWith("events");
    expect(findMock).toHaveBeenCalledWith({
      createdBy: "user123",
      deleted: { $ne: true },
    });
    expect(result).toEqual(mockEvents);
  });
});
