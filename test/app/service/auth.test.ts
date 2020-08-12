import * as assert from 'power-assert'
import { app } from 'midway-mock/bootstrap'
import { IAuthService } from '@/app/service/auth'



describe('test/service/auth.test.ts', () => {
  it('#getAdminUserByUserName >should get exists user', async () => {
    const auth = await app.applicationContext.getAsync<IAuthService>('AuthService')
    const user = await auth.getAdminUserByUserName('admin')
    assert(user)
    assert.deepEqual(user?.username, 'admin')
  })

  it('#getAdminUserTokenById >should get null when user not exists', async () => {
    const auth = await app.applicationContext.getAsync<IAuthService>('AuthService')
    const user = await auth.getAdminUserByUserName('fakeAdmin')
    assert.deepEqual(user, null)
  })

  it('#localHandler >should get exists user and password is passed', async () => {
    const ctx = app.mockContext()
    const auth = await ctx.requestContext.getAsync<IAuthService>('AuthService')
    const params = { username: 'admin', password: 'admin' }
    const user = await auth.localHandler(params)
    assert(user)
    assert.deepEqual(user?.username, params.username)
  })

  it('#localHandler >should get null when user not exists', async () => {
    const ctx = app.mockContext()
    const auth = await ctx.requestContext.getAsync<IAuthService>('AuthService')
    const params = { username: 'fakeAdmin', password: 'admin' }
    const user = await auth.localHandler(params)
    assert.deepEqual(user, null)
  })

  it('#localHandler >should get null when user password not equal', async () => {
    const ctx = app.mockContext()
    const auth = await ctx.requestContext.getAsync<IAuthService>('AuthService')
    const params = { username: 'admin', password: '123456' }
    const user = await auth.localHandler(params)
    assert.deepEqual(user, null)
  })

  it('#createAdminUserToken >should created token to redis', async () => {
    const auth = await app.applicationContext.getAsync<IAuthService>('AuthService')
    const user = await auth.getAdminUserByUserName('admin')
    assert(user)
    const token = user && await auth.createAdminUserToken(user)
    assert(token)
  })

  it('#getAdminUserTokenById >should get token from redis', async () => {
    const auth = await app.applicationContext.getAsync<IAuthService>('AuthService')
    const user = await auth.getAdminUserByUserName('admin')
    assert(user)
    const token = user && await auth.getAdminUserTokenById(user.id)
    assert(token)
  })

  it('#removeAdminUserTokenById >should remove token from redis', async () => {
    const auth = await app.applicationContext.getAsync<IAuthService>('AuthService')
    const user = await auth.getAdminUserByUserName('admin')
    assert(user)
    const removed = user && await auth.removeAdminUserTokenById(user.id)
    assert(removed)
  })

  it('#cacheAdminUser >should get OK when cached user to redis', async () => {
    const auth = await app.applicationContext.getAsync<IAuthService>('AuthService')
    const user = await auth.getAdminUserByUserName('admin')
    assert(user)
    const cached = user && await auth.cacheAdminUser(user)
    assert.deepEqual(cached, 'OK')
  })

  it('#getAdminUserById >should get userinfo from redis', async () => {
    const auth = await app.applicationContext.getAsync<IAuthService>('AuthService')
    const user = await auth.getAdminUserByUserName('admin')
    assert(user)
    const userinfo = user && await auth.getAdminUserById(user.id)
    assert(userinfo)
    assert.deepEqual(userinfo?.username, user?.username)
  })

  it('#cleanAdminUserById >should remove userinfo from redis', async () => {
    const auth = await app.applicationContext.getAsync<IAuthService>('AuthService')
    const user = await auth.getAdminUserByUserName('admin')
    assert(user)
    const removed = user && await auth.cleanAdminUserById(user.id)
    assert(removed)
  })
})
