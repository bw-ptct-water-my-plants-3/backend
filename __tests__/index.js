const db = require("../database/config");
const request = require("supertest");
const server = require("../server.js");

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
    let token;
    const res = await request(server).post("/auth/login").send({
      username: "test1",
      password: "password",
    });
    expect(res.body.token).toBe(token);
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
  it("returns a 401 due to missing req.body.username ", async () => {
    const res = await request(server).post("/auth/register").send({
      password: "password",
      phoneNumber: "40000005",
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
    const res = await request(server).get("/users");
    expect(res.statusCode).toBe(200);
    expect(res.type).toBe("application/json");
    expect(res.body.length).toBeGreaterThanOrEqual(3);
  });
});

// -------GET USER BY :ID----------
describe("get user by :id", () => {
  it("should specific Json data (username) of users/1", async () => {
    const res = await request(server).get("/users/1");
    expect(res.statusCode).toBe(200);
    expect(res.type).toBe("application/json");
    expect(res.body.username).toBe("test1");
    expect(res.body.phoneNumber).toBe("867-5309");
  });
  it("Shouldn't allow the hashed password to be returned (resulting in undefined)", async () => {
    const res = await request(server).get("/users/1");
    expect(res.body.password).toBe(undefined);
    expect(res.statusCode).toBe(200);
  });
  it("Should return status 404 if user doesn't exist", async () => {
    const res = await request(server).get("/users/10");
    expect(res.statusCode).toBe(404);
  });
});

// ----------- PUT/EDIT USER ----------
describe("put/edit user info", () => {
  it("Returns status 400 due to not providing a phoneNumber", async () => {
    const res = await request(server).put("/users/1").send({
      password: "password",
    });
    expect(res.statusCode).toEqual(400);
  });
  it("Returns status 404 body is sent, but the user is not found", async () => {
    const res = await request(server).put("/users/10").send({
      password: "password",
      phoneNumber: "12345",
    });
    expect(res.statusCode).toEqual(404);
  });
});
