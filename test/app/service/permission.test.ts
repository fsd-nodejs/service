import * as assert from 'power-assert'
import { app } from 'midway-mock/bootstrap'
import { PermissionService } from '@/app/service/permission'
import AdminPermissionModel, { GetAdminPermissionOpts, AdminPermissionInfo } from '@/app/model/admin-permission'


describe('test/service/permission.test.ts', () => {
  let currentPermission: AdminPermissionModel
  it('#queryAdminPermission >should get permission list total > 0', async () => {
    const permissionService = await app.applicationContext.getAsync<PermissionService>('PermissionService')
    const queryParams: GetAdminPermissionOpts = {
      pageSize: 10,
      current: 1,
    }
    const { total } = await permissionService.queryAdminPermission(queryParams)
    assert(total)
  })

  it('#queryAdminPermission >should get permission list and sorter by id asc', async () => {
    const permissionService = await app.applicationContext.getAsync<PermissionService>('PermissionService')
    const queryParams: GetAdminPermissionOpts = {
      pageSize: 10,
      current: 1,
    }
    const { list: descList } = await permissionService.queryAdminPermission(queryParams)
    const { list: ascList } = await permissionService.queryAdminPermission({
      ...queryParams,
      sorter: 'id_asc',
    })

    assert.notDeepEqual(descList[0].id, ascList[0].id)
  })

  it('#queryAdminPermission >should get permission list and query by id', async () => {
    const permissionService = await app.applicationContext.getAsync<PermissionService>('PermissionService')
    const queryParams: GetAdminPermissionOpts = {
      pageSize: 10,
      current: 1,
    }
    const { list } = await permissionService.queryAdminPermission(queryParams)
    const { total } = await permissionService.queryAdminPermission({
      ...queryParams,
      id: list[0].id,
    })

    assert(total)

  })

  it('#queryAdminPermission >should get permission list and query by name', async () => {
    const permissionService = await app.applicationContext.getAsync<PermissionService>('PermissionService')
    const queryParams: GetAdminPermissionOpts = {
      pageSize: 10,
      current: 1,
    }
    const { list } = await permissionService.queryAdminPermission(queryParams)
    const { total } = await permissionService.queryAdminPermission({
      ...queryParams,
      name: list[0].name,
    })

    assert(total)
  })


  it('#queryAdminPermission >should get permission list and query by slug', async () => {
    const permissionService = await app.applicationContext.getAsync<PermissionService>('PermissionService')
    const queryParams: GetAdminPermissionOpts = {
      pageSize: 10,
      current: 1,
    }
    const { list } = await permissionService.queryAdminPermission(queryParams)
    const { total } = await permissionService.queryAdminPermission({
      ...queryParams,
      slug: list[0].slug,
    })

    assert(total)
  })

  it('#queryAdminPermission >should get permission list and query by httpPath', async () => {
    const permissionService = await app.applicationContext.getAsync<PermissionService>('PermissionService')
    const queryParams: GetAdminPermissionOpts = {
      pageSize: 10,
      current: 1,
    }
    const { list } = await permissionService.queryAdminPermission(queryParams)
    const { total } = await permissionService.queryAdminPermission({
      ...queryParams,
      httpPath: list[0].httpPath,
    })

    assert(total)
  })

  it('#queryAdminPermission >should get permission list and query by httpMethod', async () => {
    const permissionService = await app.applicationContext.getAsync<PermissionService>('PermissionService')
    const queryParams: GetAdminPermissionOpts = {
      pageSize: 10,
      current: 1,
    }
    const { list } = await permissionService.queryAdminPermission(queryParams)
    const { total } = await permissionService.queryAdminPermission({
      ...queryParams,
      httpMethod: list[0].httpMethod,
    })

    assert(total)
  })

  it('#createAdminPermission >should created permission', async () => {
    const permissionService = await app.applicationContext.getAsync<PermissionService>('PermissionService')
    const params: AdminPermissionInfo = {
      name: 'fakeName',
      slug: 'fakeSlug',
      httpPath: '/fake/path',
    }
    const permission = await permissionService.createAdminPermission(params)

    assert(permission)
    currentPermission = permission
  })

  it('#getAdminPermissionById >should get permission by id', async () => {
    const permissionService = await app.applicationContext.getAsync<PermissionService>('PermissionService')
    const permission = await permissionService.getAdminPermissionById(currentPermission.id)

    assert(permission)
  })

  it('#updateAdminPermission >should update permission', async () => {
    const permissionService = await app.applicationContext.getAsync<PermissionService>('PermissionService')
    const { id } = currentPermission
    const [total] = await permissionService.updateAdminPermission(id, { httpPath: '/fake/path2' })
    assert(total)
  })

  it('#removeAdminPermissionByIds >should remove permission', async () => {
    const permissionService = await app.applicationContext.getAsync<PermissionService>('PermissionService')
    const { id } = currentPermission
    const total = await permissionService.removeAdminPermissionByIds([id])
    assert(total)
  })

})
