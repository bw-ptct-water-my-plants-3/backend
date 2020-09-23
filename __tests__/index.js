const supertest = require("supertest");
const server = require("../server");
const db = require("../database/config");

beforeAll(async () => {
  await db.migrate.latest();
});

beforeEach(async () => {
  await db.seed.run();
});

test("GET /:user_id/plants/, getting array of plants when logged in", async () => {
  const loginRes = await supertest(server).post("/auth/login").send({
    username: "test4",
    password: "valid_password",
  });

  const res = await supertest(server)
    .get(`/users/${loginRes.body.userid}/plants/`)
    .set("Authorization", loginRes.body.token);

  expect(res.statusCode).toBe(200);
  expect(res.type).toBe("application/json");
});

test("GET /:user_id/plants/, getting array of plants when token is invalid", async () => {
  const res = await supertest(server)
    .get("/users/4/plants/")
    .set("Authorization", "invalid_token");

  expect(res.statusCode).toBe(401);
  expect(res.type).toBe("application/json");
});

test("POST /:user_id/plants/, posting a plant when logged in", async () => {
  const loginRes = await supertest(server).post("/auth/login").send({
    username: "test4",
    password: "valid_password",
  });

  const newPlant = await supertest(server)
    .post(`/users/${loginRes.body.userid}/plants/`)
    .set("Authorization", loginRes.body.token)
    .send({ nickname: "nebula", species: "astronomical", h2oFrequency: 5 });

  expect(newPlant.statusCode).toBe(201);
  expect(newPlant.type).toBe("application/json");
});

test("POST /:user_id/plants/, posting a plant while logged in with missing fields", async () => {
  const loginRes = await supertest(server).post("/auth/login").send({
    username: "test4",
    password: "valid_password",
  });

  const newPlant = await supertest(server)
    .post(`/users/${loginRes.body.userid}/plants/`)
    .set("Authorization", loginRes.body.token)
    .send({ nickname: "wowcoolPlant", species: "outtathisworld" });

  expect(newPlant.statusCode).toBe(400);  
  expect(newPlant.type).toBe("application/json");
});
