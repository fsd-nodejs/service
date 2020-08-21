import * as assert from 'power-assert'
import { app } from 'midway-mock/bootstrap'
import { MenuService } from '@/app/service/menu'
import AdminMenuModel, { GetAdminMenuOpts, AdminMenuInfo } from '@/app/model/admin-menu'


describe('test/service/menu.test.ts', () => {
  let currentMenu: AdminMenuModel
  it('#queryAdminMenu >should get menu list total > 0', async () => {
    const menuService = await app.applicationContext.getAsync<MenuService>('MenuService')
    const queryParams: GetAdminMenuOpts = {
      pageSize: 10,
      current: 1,
    }
    const { total } = await menuService.queryAdminMenu(queryParams)
    assert(total)
  })

  it('#createAdminMenu >should created menu', async () => {
    const ctx = app.mockContext()
    const menuService = await ctx.requestContext.getAsync<MenuService>('MenuService')
    const params: AdminMenuInfo = {
      title: 'fakeTitle',
      uri: 'fakeUri',
      roles: ['1'],
      permissionId: '1',
    }
    const menu = await menuService.createAdminMenu(params) as AdminMenuModel

    assert(menu)
    currentMenu = menu
  })

  it('#getAdminMenuById >should get menu by id', async () => {
    const menuService = await app.applicationContext.getAsync<MenuService>('MenuService')
    const menu = await menuService.getAdminMenuById(currentMenu.id)

    assert(menu)
  })

  it('#updateAdminMenu >should update menu', async () => {
    const ctx = app.mockContext()
    const menuService = await ctx.requestContext.getAsync<MenuService>('MenuService')
    const { id } = currentMenu
    const [total] = await menuService.updateAdminMenu(id, {
      title: 'fakeTitle2',
      roles: [],
      permissionId: '2',
    })
    assert(total)
  })

  it('#removeAdminMenuByIds >should remove menu', async () => {
    const menuService = await app.applicationContext.getAsync<MenuService>('MenuService')
    const { id } = currentMenu
    const total = await menuService.removeAdminMenuByIds([id])
    assert(total)
  })


  it('#orderAdminMemu >should order menu', async () => {
    const menuService = await app.applicationContext.getAsync<MenuService>('MenuService')
    const queryParams: GetAdminMenuOpts = {
      pageSize: 1000,
      current: 1,
    }
    const { list } = await menuService.queryAdminMenu(queryParams)

    const newList = list.map((item, index) => {
      return {
        id: item.id,
        parentId: item.parentId,
        order: list.length - index,
      }
    })

    await menuService.orderAdminMemu(newList)

    const newMenu = await menuService.getAdminMenuById(list[0].id)

    assert.deepEqual(newMenu?.order, newList[0].order)

    const sortList = list.map((item, index) => {
      return {
        id: item.id,
        parentId: item.parentId,
        order: index + 1,
      }
    })
    await menuService.orderAdminMemu(sortList)
  })

})
