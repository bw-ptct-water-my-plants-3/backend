const supertest = require("supertest");
const server = require("../server");
const db = require("../database/config");

beforeAll(async () => {
  await db.migrate.latest();
});

beforeEach(async () => {
  await db.seed.run();
});

test("GET /:user_id/plants/, when logged in", async () => {
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

test("GET /:user_id/plants/, when token is invalid", async () => {
  const res = await supertest(server)
    .get("/users/4/plants/")
    .set("Authorization", "invalid_token");

  expect(res.statusCode).toBe(401);
  expect(res.type).toBe("application/json");
});
