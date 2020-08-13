
import * as assert from 'power-assert'
import { app } from 'midway-mock/bootstrap'


describe('test/controller/auth.test.ts', () => {
  let currentUser: any

  it('should POST /auth/login by wrong username and password', async () => {
    app.mockCsrf()
    const response = await app.httpRequest()
      .post('/auth/login')
      .type('form')
      .send({
        username: app.config.admin.username,
        password: '123456',
      })
      .expect(400)
    assert.deepEqual(response.body.code, 400)
  })

  it('should POST /auth/login by wrong input', async () => {
    app.mockCsrf()
    const response = await app.httpRequest()
      .post('/auth/login')
      .type('form')
      .expect(422)
    assert.deepEqual(response.body.code, 422)
  })

  it('should POST /auth/login by correct username and password', async () => {
    app.mockCsrf()
    const response = await app.httpRequest()
      .post('/auth/login')
      .type('form')
      .send(app.config.admin)
      .expect(200)
    assert(response.body.data.token)
    currentUser = response.body.data
  })

  it('should GET /auth/currentUser', async () => {
    const response = await app.httpRequest()
      .get('/auth/currentUser')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .expect(200)
    assert.deepEqual(response.body.code, 200)
  })

  it('should GET 404', async () => {
    const response = await app.httpRequest()
      .get('/auth/currentUsersss')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .expect(404)
    assert.deepEqual(response.body.code, 404)
  })

  it('should GET /auth/logout', async () => {
    const response = await app.httpRequest()
      .get('/auth/logout')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .expect(200)
    assert.deepEqual(response.body.code, 200)
  })

  it('should GET /auth/currentUser was logouted', async () => {
    const response = await app.httpRequest()
      .get('/auth/currentUser')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .expect(401)
    assert.deepEqual(response.body.code, 401)
  })
})
