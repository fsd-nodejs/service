import * as assert from 'power-assert'
import { app } from 'midway-mock/bootstrap'
import { IPermissionService } from '@/app/service/permission'
import AdminPermissionModel, { GetAdminPermissionOpts, AdminPermissionInfo } from '@/app/model/admin-permission'


describe('test/service/permission.test.ts', () => {
  let currentPermission: AdminPermissionModel
  it('#queryAdminPermission >should get permission list total > 0', async () => {
    const auth = await app.applicationContext.getAsync<IPermissionService>('PermissionService')
    const queryParams: GetAdminPermissionOpts = {
      pageSize: 10,
      current: 1,
    }
    const { total } = await auth.queryAdminPermission(queryParams)
    assert(total)
  })

  it('#queryAdminPermission >should get permission list and sorter by id asc', async () => {
    const auth = await app.applicationContext.getAsync<IPermissionService>('PermissionService')
    const queryParams: GetAdminPermissionOpts = {
      pageSize: 10,
      current: 1,
    }
    const { list: descList } = await auth.queryAdminPermission(queryParams)
    const { list: ascList } = await auth.queryAdminPermission({
      ...queryParams,
      sorter: 'id_asc',
    })

    assert.notDeepEqual(descList[0].id, ascList[0].id)
  })

  it('#queryAdminPermission >should get permission list and query by id', async () => {
    const auth = await app.applicationContext.getAsync<IPermissionService>('PermissionService')
    const queryParams: GetAdminPermissionOpts = {
      pageSize: 10,
      current: 1,
    }
    const { list } = await auth.queryAdminPermission(queryParams)
    const { total } = await auth.queryAdminPermission({
      ...queryParams,
      id: list[0].id,
    })

    assert(total)

  })

  it('#queryAdminPermission >should get permission list and query by name', async () => {
    const auth = await app.applicationContext.getAsync<IPermissionService>('PermissionService')
    const queryParams: GetAdminPermissionOpts = {
      pageSize: 10,
      current: 1,
    }
    const { list } = await auth.queryAdminPermission(queryParams)
    const { total } = await auth.queryAdminPermission({
      ...queryParams,
      name: list[0].name,
    })

    assert(total)
  })


  it('#queryAdminPermission >should get permission list and query by slug', async () => {
    const auth = await app.applicationContext.getAsync<IPermissionService>('PermissionService')
    const queryParams: GetAdminPermissionOpts = {
      pageSize: 10,
      current: 1,
    }
    const { list } = await auth.queryAdminPermission(queryParams)
    const { total } = await auth.queryAdminPermission({
      ...queryParams,
      slug: list[0].slug,
    })

    assert(total)
  })

  it('#queryAdminPermission >should get permission list and query by httpPath', async () => {
    const auth = await app.applicationContext.getAsync<IPermissionService>('PermissionService')
    const queryParams: GetAdminPermissionOpts = {
      pageSize: 10,
      current: 1,
    }
    const { list } = await auth.queryAdminPermission(queryParams)
    const { total } = await auth.queryAdminPermission({
      ...queryParams,
      httpPath: list[0].httpPath,
    })

    assert(total)
  })

  it('#queryAdminPermission >should get permission list and query by httpMethod', async () => {
    const auth = await app.applicationContext.getAsync<IPermissionService>('PermissionService')
    const queryParams: GetAdminPermissionOpts = {
      pageSize: 10,
      current: 1,
    }
    const { list } = await auth.queryAdminPermission(queryParams)
    const { total } = await auth.queryAdminPermission({
      ...queryParams,
      httpMethod: list[0].httpMethod,
    })

    assert(total)
  })

  it('#createAdminPermission >should created permission', async () => {
    const auth = await app.applicationContext.getAsync<IPermissionService>('PermissionService')
    const params: AdminPermissionInfo = {
      name: 'fakeName',
      slug: 'fakeSlug',
      httpPath: '/fake/path',
    }
    const permission = await auth.createAdminPermission(params)

    assert(permission)
    currentPermission = permission
  })

  it('#getAdminPermissionById >should get permission by id', async () => {
    const auth = await app.applicationContext.getAsync<IPermissionService>('PermissionService')
    const permission = await auth.getAdminPermissionById(currentPermission.id)

    assert(permission)
  })

  it('#updateAdminPermission >should update permission', async () => {
    const auth = await app.applicationContext.getAsync<IPermissionService>('PermissionService')
    const { id } = currentPermission
    const [total] = await auth.updateAdminPermission(id, { httpPath: '/fake/path2' })
    assert(total)
  })

  it('#removeAdminPermissionByIds >should remove permission', async () => {
    const auth = await app.applicationContext.getAsync<IPermissionService>('PermissionService')
    const { id } = currentPermission
    const total = await auth.removeAdminPermissionByIds([id])
    assert(total)
  })

})
