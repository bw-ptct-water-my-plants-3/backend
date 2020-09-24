const db = require('../database/config')
const request = require('supertest')
const server = require('../server.js')


beforeEach(async () => {
    await db.seed.run()
    //seed so tests db has something to test..
})


afterAll(async () => {
    await db.destroy()
    //anti-stall after test
})

// -----------AUTH-----------
describe("auth via JWT working",  () => {
    it('grants auth with valid creds', async () => {
        let token;
        const res = await request(server)
          .post('/auth/login')
          .send({
            username: "test1",
            password: "password",
          })
          expect(res.body.token).toBe(token)
    })
    it('def does NOT with bad creds, resulting in 401 and no token', async () => {
        const res = await request(server)
          .post('/auth/login')
          .send({
            username: "notAuth'd",
            password: "password",
          })
          expect(res.statusCode).toBe(401)
          expect(res.body.token).toBe(undefined)
    })
    it('Returns status 400 due to missing req.body.password', async () => {
        const res = await request(server)
          .post('/auth/login')
          .send({
            username: "notAuth'd"
          })
          expect(res.statusCode).toBe(400)
          expect(res.body.message).toBe("Please enter a username and password")
    })
})

// -----------REGISTER-------------
describe("register",  () => {
    it('returns 201', async () => {
        const res = await request(server)
            .post("/auth/register")
            .send({
                username: "user100",
                password: "password",
                phoneNumber: "40000005"
            })
            expect(res.statusCode).toBe(201)
    })
    it('gets a 409 on .unique username constraint/usertaken ', async () => {
        const res = await request(server)
            .post("/auth/register")
            .send({
                username: "test1",
                password: "password",
                phoneNumber: "40000005"
            })
            expect(res.statusCode).toBe(409)
    })
    it('returns 401 due to name length db constraint', async () => {
        const res = await request(server)
            .post("/auth/register")
            .send({
                username: "tesasdasdasasdasddasdasdasdt1",
                password: "password",
                phoneNumber: "40000005"
            })
            expect(res.statusCode).toBe(401)
    })
    it('gets a 409 on .unique phoneNumber constraint', async () => {
        const res = await request(server)
            .post("/auth/register")
            .send({
                username: "test100000",
                password: "password",
                phoneNumber: "867-5309"
            })
            expect(res.statusCode).toBe(409)
    })
})
