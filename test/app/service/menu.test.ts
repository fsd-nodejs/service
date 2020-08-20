import * as assert from 'power-assert'
import { app } from 'midway-mock/bootstrap'
import { IMenuService } from '@/app/service/menu'
import AdminMenuModel, { GetAdminMenuOpts, AdminMenuInfo } from '@/app/model/admin-menu'


describe('test/service/menu.test.ts', () => {
  let currentMenu: AdminMenuModel
  it('#queryAdminMenu >should get menu list total > 0', async () => {
    const auth = await app.applicationContext.getAsync<IMenuService>('MenuService')
    const queryParams: GetAdminMenuOpts = {
      pageSize: 10,
      current: 1,
    }
    const { total } = await auth.queryAdminMenu(queryParams)
    assert(total)
  })

  it('#createAdminMenu >should created menu', async () => {
    const ctx = app.mockContext()
    const auth = await ctx.requestContext.getAsync<IMenuService>('MenuService')
    const params: AdminMenuInfo = {
      title: 'fakeTitle',
      uri: 'fakeUri',
      roles: ['1'],
      permissionId: '1',
    }
    const menu = await auth.createAdminMenu(params) as AdminMenuModel

    assert(menu)
    currentMenu = menu
  })

  it('#getAdminMenuById >should get menu by id', async () => {
    const auth = await app.applicationContext.getAsync<IMenuService>('MenuService')
    const menu = await auth.getAdminMenuById(currentMenu.id)

    assert(menu)
  })

  it('#updateAdminMenu >should update menu', async () => {
    const ctx = app.mockContext()
    const auth = await ctx.requestContext.getAsync<IMenuService>('MenuService')
    const { id } = currentMenu
    const [total] = await auth.updateAdminMenu(id, {
      title: 'fakeTitle2',
      roles: [],
      permissionId: '2',
    })
    assert(total)
  })

  it('#removeAdminMenuByIds >should remove menu', async () => {
    const auth = await app.applicationContext.getAsync<IMenuService>('MenuService')
    const { id } = currentMenu
    const total = await auth.removeAdminMenuByIds([id])
    assert(total)
  })

})
