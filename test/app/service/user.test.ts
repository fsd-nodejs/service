import * as assert from 'power-assert'
import { app } from 'midway-mock/bootstrap'
import { UserService } from '@/app/service/user'
import AdminUserModel, { GetAdminUserOpts, AdminUserInfo } from '@/app/model/admin-user'


describe('test/service/user.test.ts', () => {
  let currentUser: AdminUserModel
  it('#queryAdminUser >should get user list total > 0', async () => {
    const userService = await app.applicationContext.getAsync<UserService>('UserService')
    const queryParams: GetAdminUserOpts = {
      pageSize: 10,
      current: 1,
    }
    const { total } = await userService.queryAdminUser(queryParams)
    assert(total)
  })

  it('#queryAdminUser >should get user list and query by id', async () => {
    const userService = await app.applicationContext.getAsync<UserService>('UserService')
    const queryParams: GetAdminUserOpts = {
      pageSize: 10,
      current: 1,
    }
    const { list } = await userService.queryAdminUser(queryParams)
    const { total } = await userService.queryAdminUser({
      ...queryParams,
      id: list[0].id,
    })

    assert(total)

  })

  it('#queryAdminUser >should get user list and query by name', async () => {
    const userService = await app.applicationContext.getAsync<UserService>('UserService')
    const queryParams: GetAdminUserOpts = {
      pageSize: 10,
      current: 1,
    }
    const { list } = await userService.queryAdminUser(queryParams)
    const { total } = await userService.queryAdminUser({
      ...queryParams,
      name: list[0].name,
    })

    assert(total)
  })


  it('#queryAdminUser >should get user list and query by username', async () => {
    const userService = await app.applicationContext.getAsync<UserService>('UserService')
    const queryParams: GetAdminUserOpts = {
      pageSize: 10,
      current: 1,
    }
    const { list } = await userService.queryAdminUser(queryParams)
    const { total } = await userService.queryAdminUser({
      ...queryParams,
      username: list[0].username,
    })

    assert(total)
  })

  it('#createAdminUser >should created user', async () => {
    const ctx = app.mockContext()
    const userService = await ctx.requestContext.getAsync<UserService>('UserService')
    const params: AdminUserInfo = {
      name: 'fakeName',
      username: 'fakeUserName',
      password: ctx.helper.bhash('123456'),
      roles: ['1'],
      permissions: ['1'],
    }
    const user = await userService.createAdminUser(params) as AdminUserModel

    assert(user)
    currentUser = user
  })

  it('#queryAdminUser >should get user list and sorter by id asc', async () => {
    const userService = await app.applicationContext.getAsync<UserService>('UserService')
    const queryParams: GetAdminUserOpts = {
      pageSize: 10,
      current: 1,
    }
    const { list: descList } = await userService.queryAdminUser(queryParams)
    const { list: ascList } = await userService.queryAdminUser({
      ...queryParams,
      sorter: 'id_asc',
    })

    assert.notDeepEqual(descList[0].id, ascList[0].id)
  })

  it('#getAdminUserById >should get user by id', async () => {
    const userService = await app.applicationContext.getAsync<UserService>('UserService')
    const user = await userService.getAdminUserById(currentUser.id)

    assert(user)
  })

  it('#updateAdminUser >should update user', async () => {
    const ctx = app.mockContext()
    const userService = await ctx.requestContext.getAsync<UserService>('UserService')
    const { id } = currentUser
    const [total] = await userService.updateAdminUser(id, {
      name: 'fakeName2',
      username: 'fakeUserName2',
      password: '123456',
      roles: [],
      permissions: [],
    })
    assert(total)
  })

  it('#removeAdminUserByIds >should remove user', async () => {
    const userService = await app.applicationContext.getAsync<UserService>('UserService')
    const { id } = currentUser
    const total = await userService.removeAdminUserByIds([id])
    assert(total)
  })

})
