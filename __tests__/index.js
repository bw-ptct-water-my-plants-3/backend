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


