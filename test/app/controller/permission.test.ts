
import * as assert from 'power-assert'
import { app } from 'midway-mock/bootstrap'


describe('test/controller/permission.test.ts', () => {
  let currentUser: any
  let currentPermission: any
  before(async () => {
    app.mockCsrf()
    const response = await app.httpRequest()
      .post('/auth/login')
      .type('form')
      .send(app.config.admin)
      .expect(200)
    currentUser = response.body.data
  })

  it('should get /permission/query ', async () => {
    app.mockCsrf()
    const response = await app.httpRequest()
      .get('/permission/query')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .expect(200)
    assert(response.body.data.total)
  })

  it('should get /permission/show ', async () => {
    app.mockCsrf()
    const response = await app.httpRequest()
      .get('/permission/query')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .expect(200)
    assert(response.body.data.total)
    const { list } = response.body.data
    const response2 = await app.httpRequest()
      .get('/permission/show')
      .query({
        id: list[0].id,
      })
      .set('Authorization', `Bearer ${currentUser.token}`)
    assert.deepEqual(response2.body.data.id, list[0].id)
  })

  it('should post /permission/create ', async () => {
    app.mockCsrf()
    const params = {
      name: 'fakeName',
      slug: 'fakeSlug',
      httpMethod: ['GET', 'POST'],
      httpPath: '/fake/path',
    }
    const response = await app.httpRequest()
      .post('/permission/create')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .type('form')
      .send(params)
      .expect(201)
    assert(response.body.data)
    currentPermission = response.body.data
  })

  it('should patch /permission/update ', async () => {
    app.mockCsrf()
    const params = {
      id: currentPermission.id,
      httpPath: '/fake/path2',
    }
    const response = await app.httpRequest()
      .patch('/permission/update')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .type('form')
      .send(params)
      .expect(204)
    assert.deepEqual(response.status, 204)
  })

  it('should delete /permission/remove ', async () => {
    app.mockCsrf()
    const params = {
      ids: [currentPermission.id],
    }
    const response = await app.httpRequest()
      .del('/permission/remove')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .type('form')
      .send(params)
      .expect(204)
    assert.deepEqual(response.status, 204)
  })
})
