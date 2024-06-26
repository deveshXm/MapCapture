import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { app, server } from "../index";
import User from "../models/User";
import { MapData } from "../models/MapData";

let mongoServer: MongoMemoryServer;
let authToken: string;
let userId: string;
let mapDataId: string;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.disconnect(); // Disconnect from any existing connection
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
  server.close(); // Close the server after tests
});

describe("User Routes", () => {
  test("POST /api/users/register - Register a new user", async () => {
    const res = await request(app).post("/api/users/register").send({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("token");
  });

  test("POST /api/users/login - Login user", async () => {
    const res = await request(app).post("/api/users/login").send({
      email: "test@example.com",
      password: "password123",
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    authToken = res.body.token;

    // Get userId from token
    const payload = JSON.parse(Buffer.from(authToken.split(".")[1], "base64").toString());
    userId = payload._id;
  });
});

describe("Map Routes", () => {
  test("POST /api/maps - Save map data", async () => {
    const res = await request(app)
      .post("/api/maps")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        center: [0, 0],
        zoom: 10,
        capturedImage: "base64encodedimage",
        annotation: "Test annotation",
      });
    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty("_id");
    mapDataId = res.body.data._id;
  });

  test("GET /api/maps/:id - Get specific map data", async () => {
    const res = await request(app).get(`/api/maps/${mapDataId}`).set("Authorization", `Bearer ${authToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("_id", mapDataId);
  });

  test("GET /api/maps/user/maps - Get user map data", async () => {
    const res = await request(app).get("/api/maps/user/maps").set("Authorization", `Bearer ${authToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBeTruthy();
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  test("GET /api/maps/top-regions - Get top regions", async () => {
    const res = await request(app).get("/api/maps/top-regions").set("Authorization", `Bearer ${authToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBeTruthy();
  });
});

describe("Error Handling", () => {
  test("GET /api/maps/:id - Get non-existent map data", async () => {
    const res = await request(app).get(`/api/maps/${new mongoose.Types.ObjectId()}`).set("Authorization", `Bearer ${authToken}`);
    expect(res.status).toBe(404);
  });

  test("POST /api/maps - Save map data without authentication", async () => {
    const res = await request(app)
      .post("/api/maps")
      .send({
        center: [0, 0],
        zoom: 10,
        capturedImage: "base64encodedimage",
      });
    expect(res.status).toBe(401);
  });
});
