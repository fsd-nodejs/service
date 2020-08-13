
import * as assert from 'power-assert'
import { app } from 'midway-mock/bootstrap'


describe('test/controller/role.test.ts', () => {
  let currentUser: any
  let currentRole: any
  before(async () => {
    app.mockCsrf()
    const response = await app.httpRequest()
      .post('/auth/login')
      .type('form')
      .send(app.config.admin)
      .expect(200)
    currentUser = response.body.data
  })

  it('should get /role/query ', async () => {
    app.mockCsrf()
    const response = await app.httpRequest()
      .get('/role/query')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .expect(200)
    assert(response.body.data.total)
  })

  it('should get /role/show ', async () => {
    app.mockCsrf()
    const response = await app.httpRequest()
      .get('/role/query')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .expect(200)
    assert(response.body.data.total)
    const { list } = response.body.data
    const response2 = await app.httpRequest()
      .get('/role/show')
      .query({
        id: list[0].id,
      })
      .set('Authorization', `Bearer ${currentUser.token}`)
    assert.deepEqual(response2.body.data.id, list[0].id)
  })

  it('should post /role/create ', async () => {
    app.mockCsrf()
    const params = {
      name: 'fakeName',
      slug: 'fakeSlug',
    }
    const response = await app.httpRequest()
      .post('/role/create')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .type('form')
      .send(params)
      .expect(201)
    assert(response.body.data)
    currentRole = response.body.data
  })

  it('should patch /role/update ', async () => {
    app.mockCsrf()
    const params = {
      id: currentRole.id,
      slug: 'fakeSlug2',
    }
    const response = await app.httpRequest()
      .patch('/role/update')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .type('form')
      .send(params)
      .expect(204)
    assert.deepEqual(response.status, 204)
  })

  it('should delete /role/remove ', async () => {
    app.mockCsrf()
    const params = {
      ids: [currentRole.id],
    }
    const response = await app.httpRequest()
      .del('/role/remove')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .type('form')
      .send(params)
      .expect(204)
    assert.deepEqual(response.status, 204)
  })
})
