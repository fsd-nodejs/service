import * as assert from 'power-assert'
import { app } from 'midway-mock/bootstrap'
import { IRoleService } from '@/app/service/role'
import AdminRoleModel, { GetAdminRoleOpts, AdminRoleInfo } from '@/app/model/admin-role'


describe('test/service/role.test.ts', () => {
  let currentRole: AdminRoleModel
  it('#queryAdminRole >should get role list total > 0', async () => {
    const auth = await app.applicationContext.getAsync<IRoleService>('RoleService')
    const queryParams: GetAdminRoleOpts = {
      pageSize: 10,
      current: 1,
    }
    const { total } = await auth.queryAdminRole(queryParams)
    assert(total)
  })

  it('#queryAdminRole >should get role list and query by id', async () => {
    const auth = await app.applicationContext.getAsync<IRoleService>('RoleService')
    const queryParams: GetAdminRoleOpts = {
      pageSize: 10,
      current: 1,
    }
    const { list } = await auth.queryAdminRole(queryParams)
    const { total } = await auth.queryAdminRole({
      ...queryParams,
      id: list[0].id,
    })

    assert(total)

  })

  it('#queryAdminRole >should get role list and query by name', async () => {
    const auth = await app.applicationContext.getAsync<IRoleService>('RoleService')
    const queryParams: GetAdminRoleOpts = {
      pageSize: 10,
      current: 1,
    }
    const { list } = await auth.queryAdminRole(queryParams)
    const { total } = await auth.queryAdminRole({
      ...queryParams,
      name: list[0].name,
    })

    assert(total)
  })


  it('#queryAdminRole >should get role list and query by slug', async () => {
    const auth = await app.applicationContext.getAsync<IRoleService>('RoleService')
    const queryParams: GetAdminRoleOpts = {
      pageSize: 10,
      current: 1,
    }
    const { list } = await auth.queryAdminRole(queryParams)
    const { total } = await auth.queryAdminRole({
      ...queryParams,
      slug: list[0].slug,
    })

    assert(total)
  })

  it('#createAdminRole >should created role', async () => {
    const ctx = app.mockContext()
    const auth = await ctx.requestContext.getAsync<IRoleService>('RoleService')
    const params: AdminRoleInfo = {
      name: 'fakeName',
      slug: 'fakeSlug',
      permissions: ['1'],
    }
    const role = await auth.createAdminRole(params) as AdminRoleModel

    assert(role)
    currentRole = role
  })

  it('#queryAdminRole >should get role list and sorter by id asc', async () => {
    const auth = await app.applicationContext.getAsync<IRoleService>('RoleService')
    const queryParams: GetAdminRoleOpts = {
      pageSize: 10,
      current: 1,
    }
    const { list: descList } = await auth.queryAdminRole(queryParams)
    const { list: ascList } = await auth.queryAdminRole({
      ...queryParams,
      sorter: 'id_asc',
    })

    assert.notDeepEqual(descList[0].id, ascList[0].id)
  })

  it('#getAdminRoleById >should get role by id', async () => {
    const auth = await app.applicationContext.getAsync<IRoleService>('RoleService')
    const role = await auth.getAdminRoleById(currentRole.id)

    assert(role)
  })

  it('#updateAdminRole >should update role', async () => {
    const ctx = app.mockContext()
    const auth = await ctx.requestContext.getAsync<IRoleService>('RoleService')
    const { id } = currentRole
    const [total] = await auth.updateAdminRole(id, { name: 'fakeName2', permissions: ['2'] })
    assert(total)
  })

  it('#removeAdminRoleByIds >should remove role', async () => {
    const auth = await app.applicationContext.getAsync<IRoleService>('RoleService')
    const { id } = currentRole
    const total = await auth.removeAdminRoleByIds([id])
    assert(total)
  })

})
