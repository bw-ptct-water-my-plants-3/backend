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

test("DELETE /:user_id/plants/:id, deleting a specific plant while logged in", async () => {
  const loginRes = await supertest(server).post("/auth/login").send({
    username: "test4",
    password: "valid_password",
  });

  const deletedPlant = await supertest(server)
    .delete(`/users/${loginRes.body.userid}/plants/5`)
    .set("Authorization", loginRes.body.token);

  expect(deletedPlant.statusCode).toBe(204);
});

test("DELETE /:user_id/plants/:id, deleting a specific plant that does not exist whie logged in", async () => {
  const loginRes = await supertest(server).post("/auth/login").send({
    username: "test4",
    password: "valid_password",
  });

  const doesNotExist = await supertest(server)
    .delete(`/users/${loginRes.body.userid}/plants/10`)
    .set("Authorization", loginRes.body.token);

  expect(doesNotExist.statusCode).toBe(404);
});

test("PUT /:user_id/plants/:id, editing a specific plant while logged in", async () => {
  const loginRes = await supertest(server).post("/auth/login").send({
    username: "test4",
    password: "valid_password"
  })

  const editPlant = await supertest(server)
  .put(`/users/${loginRes.body.userid}/plants/5`)
  .set("Authorization", loginRes.body.token)
  .send({ nickname: "titan", species: "SaturnsMoon", h2oFrequency: 9 })

  expect(editPlant.statusCode).toBe(200)
})