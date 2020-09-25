const request = require("supertest");
const server = require("../server");
const db = require("../database/config");

beforeAll(async () => {
  await db.migrate.latest();
});

beforeEach(async () => {
  await db.seed.run();
  //seed so tests db has something to test..
});

afterAll(async () => {
  await db.destroy();
  //anti-stall after test
});

// -----------AUTH-----------
describe("auth via JWT working", () => {
  it("grants auth with valid creds", async () => {
    const res = await request(server).post("/auth/login").send({
      username: "test1",
      password: "password",
    });
    expect(res.statusCode).toBe(200);
  });
  it("def does NOT with bad creds, resulting in 401 and no token", async () => {
    const res = await request(server).post("/auth/login").send({
      username: "notAuth'd",
      password: "password",
    });
    expect(res.statusCode).toBe(401);
    expect(res.body.token).toBe(undefined);
  });
  it("Returns status 400 due to missing req.body.password", async () => {
    const res = await request(server).post("/auth/login").send({
      username: "notAuth'd",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Please enter a username and password");
  });
});

// -----------REGISTER-------------
describe("register", () => {
  it("returns 201", async () => {
    const res = await request(server).post("/auth/register").send({
      username: "user100",
      password: "password",
      phoneNumber: "40000005",
    });
    expect(res.statusCode).toBe(201);
  });
  it("returns a 401 due to missing req.body.password ", async () => {
    const res = await request(server).post("/auth/register").send({
      username: "test1234",
      phoneNumber: "123456789",
    });
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe(
      "username, password, and phonenumber are REQUIRED"
    );
  });
  it("returns a 401 due to a missing req.body.phoneNumber", async () => {
    const res = await request(server).post("/auth/register").send({
      username: "test1234",
      password: "validPassword",
    });
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe(
      "username, password, and phonenumber are REQUIRED"
    );
  });
  it("gets a 409 on .unique username constraint/usertaken ", async () => {
    const res = await request(server).post("/auth/register").send({
      username: "test1",
      password: "password",
      phoneNumber: "40000005",
    });
    expect(res.statusCode).toBe(409);
    expect(res.body.message).toBe("Username is already taken");
  });
  it("returns 401 due to name length db constraint", async () => {
    const res = await request(server).post("/auth/register").send({
      username: "tesasdasdasasdasddasdasdasdt1",
      password: "password",
      phoneNumber: "40000005",
    });
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Username can NOT exceed 20 characters");
  });
  it("gets a 409 on .unique phoneNumber constraint", async () => {
    const res = await request(server).post("/auth/register").send({
      username: "test100000",
      password: "password",
      phoneNumber: "867-5309",
    });
    expect(res.statusCode).toBe(409);
    expect(res.body.message).toBe("This phone number is already in use");
  });
});

// without Auth middleware
//---------GET USERS--------------
describe("get users", () => {
  it("Should return Users tbl with a .length >= 3 (seed array length)", async () => {
    const auth = await request(server).post("/auth/login").send({
      username: "test1",
      password: "password",
    });

    const res = await request(server)
      .get("/users/")
      .set("Authorization", auth.body.token);

    expect(res.statusCode).toBe(200);
    expect(res.type).toBe("application/json");
    expect(res.body.length).toBeGreaterThanOrEqual(3);
  });
});

// -------GET USER BY :ID----------
describe("get user by :id", () => {
  it("should specific Json data (username) of users/1", async () => {
    const auth = await request(server).post("/auth/login").send({
      username: "test1",
      password: "password",
    });
    const res = await request(server)
      .get("/users/1")
      .set("Authorization", auth.body.token);

    expect(res.statusCode).toBe(200);
    expect(res.type).toBe("application/json");
    expect(res.body.username).toBe("test1");
    expect(res.body.phoneNumber).toBe("867-5309");
  });
  it("Shouldn't allow the hashed password to be returned (resulting in undefined)", async () => {
    const auth = await request(server).post("/auth/login").send({
      username: "test1",
      password: "password",
    });

    const res = await request(server)
      .get("/users/1")
      .set("Authorization", auth.body.token);

    expect(res.body.password).toBe(undefined);
    expect(res.statusCode).toBe(200);
  });

  it("Should return status 404 if user doesn't exist", async () => {
    const auth = await request(server).post("/auth/login").send({
      username: "test1",
      password: "password",
    });

    const res = await request(server)
      .get("/users/10")
      .set("Authorization", auth.body.token);

    expect(res.statusCode).toBe(404);
  });
});

// ----------- PUT/EDIT USER ----------
describe("put/edit user info", () => {
  it("Returns status 400 due to not providing a phoneNumber", async () => {
    const auth = await request(server).post("/auth/login").send({
      username: "test1",
      password: "password",
    });

    const res = await request(server)
      .put("/users/1")
      .set("Authorization", auth.body.token)
      .send({
        password: "password",
      });
    expect(res.statusCode).toEqual(400);
  });
  it("Returns status 404 body is sent, but the user is not found", async () => {
    const auth = await request(server).post("/auth/login").send({
      username: "test1",
      password: "password",
    });

    const res = await request(server)
      .put("/users/10")
      .set("Authorization", auth.body.token)
      .send({
        password: "password",
        phoneNumber: "12345",
      });

    expect(res.statusCode).toEqual(404);
  });
});

//--------------middleware-------------
describe("middleware", () => {
  it("Should return 401 without valid token", async () => {
    const res = await request(server).get("/users/");

    expect(res.statusCode).toBe(401);
  });
});

//--------------PLANTS CRUD------------
describe("plants", () => {
  it("GET /:user_id/plants/:id, getting a plant by ID while logged in", async () => {
    const loginRes = await request(server).post("/auth/login").send({
      username: "test4",
      password: "valid_password",
    });

    const specificPlant = await request(server)
      .get(`/users/${loginRes.body.userid}/plants/5`)
      .set("Authorization", loginRes.body.token);

    expect(specificPlant.statusCode).toBe(200);
  });

  it("GET /:user_id/plants/:id, getting a plant by ID that does not exist while logged in", async () => {
    const loginRes = await request(server).post("/auth/login").send({
      username: "test4",
      password: "valid_password",
    });

    const specificPlant = await request(server)
      .get(`/users/${loginRes.body.userid}/plants/10`)
      .set("Authorization", loginRes.body.token);

    expect(specificPlant.statusCode).toBe(404);
  });

  it("GET /:user_id/plants/, getting array of plants when logged in", async () => {
    const loginRes = await request(server).post("/auth/login").send({
      username: "test4",
      password: "valid_password",
    });

    const res = await request(server)
      .get(`/users/${loginRes.body.userid}/plants/`)
      .set("Authorization", loginRes.body.token);

    expect(res.statusCode).toBe(200);
    expect(res.type).toBe("application/json");
  });

  it("GET /:user_id/plants/, getting array of plants when token is invalid", async () => {
    const res = await request(server)
      .get("/users/4/plants/")
      .set("Authorization", "invalid_token");

    expect(res.statusCode).toBe(401);
    expect(res.type).toBe("application/json");
  });

  it("POST /:user_id/plants/, posting a plant when logged in", async () => {
    const loginRes = await request(server).post("/auth/login").send({
      username: "test4",
      password: "valid_password",
    });

    const newPlant = await request(server)
      .post(`/users/${loginRes.body.userid}/plants/`)
      .set("Authorization", loginRes.body.token)
      .send({ nickname: "nebula", species: "astronomical", h2oFrequency: 5 });

    expect(newPlant.statusCode).toBe(201);
    expect(newPlant.type).toBe("application/json");
  });

  it("POST /:user_id/plants/, posting a plant while logged in with missing fields", async () => {
    const loginRes = await request(server).post("/auth/login").send({
      username: "test4",
      password: "valid_password",
    });

    const newPlant = await request(server)
      .post(`/users/${loginRes.body.userid}/plants/`)
      .set("Authorization", loginRes.body.token)
      .send({ nickname: "wowcoolPlant", species: "outtathisworld" });

    expect(newPlant.statusCode).toBe(400);
    expect(newPlant.type).toBe("application/json");
  });

  it("DELETE /:user_id/plants/:id, deleting a specific plant while logged in", async () => {
    const loginRes = await request(server).post("/auth/login").send({
      username: "test4",
      password: "valid_password",
    });

    const deletedPlant = await request(server)
      .delete(`/users/${loginRes.body.userid}/plants/5`)
      .set("Authorization", loginRes.body.token);

    expect(deletedPlant.statusCode).toBe(204);
  });

  it("DELETE /:user_id/plants/:id, deleting a specific plant that does not exist whie logged in", async () => {
    const loginRes = await request(server).post("/auth/login").send({
      username: "test4",
      password: "valid_password",
    });

    const doesNotExist = await request(server)
      .delete(`/users/${loginRes.body.userid}/plants/10`)
      .set("Authorization", loginRes.body.token);

    expect(doesNotExist.statusCode).toBe(404);
  });

  it("PUT /:user_id/plants/:id, editing a specific plant while logged in", async () => {
    const loginRes = await request(server).post("/auth/login").send({
      username: "test4",
      password: "valid_password",
    });

    const editPlant = await request(server)
      .put(`/users/${loginRes.body.userid}/plants/5`)
      .set("Authorization", loginRes.body.token)
      .send({ nickname: "titan", species: "SaturnsMoon", h2oFrequency: 9 });

    expect(editPlant.statusCode).toBe(200);
  });

  it("PUT /:user_id/plants/:id, editing a specific plant with missing fields while logged in", async () => {
    const loginRes = await request(server).post("/auth/login").send({
      username: "test4",
      password: "valid_password",
    });

    const editPlant = await request(server)
      .put(`/users/${loginRes.body.userid}/plants/5`)
      .set("Authorization", loginRes.body.token)
      .send({ nickname: "titan", species: "SaturnsMoon" });

    expect(editPlant.statusCode).toBe(400);
  });
});
