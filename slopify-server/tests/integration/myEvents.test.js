import { ObjectId } from "mongodb";
import { jest } from "@jest/globals";
import request from "supertest";

// Define mocks
const mockEvents = [
  { _id: "1", createdBy: "123", name: "Integration Test Event" },
];
const toArrayMock = jest.fn(() => mockEvents);
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
  };
});

// Dynamically import the test target AFTER mocking
const { createApp } = await import("../../createApp.js");

test("myEvents returns events from the mocked db", async () => {
  const app = await createApp({ testMode: true, user: { id: "123" } });

  const res = await request(app)
    .post("/graphql")
    .send({
      query: `
        query {
          myEvents {
            _id
            createdBy
            name
          }
        }
      `,
    });

  expect(res.statusCode).toBe(200);
  expect(res.body.data?.myEvents).toEqual(mockEvents);
});
