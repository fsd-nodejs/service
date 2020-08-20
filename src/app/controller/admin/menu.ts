import * as assert from 'assert'

import {
  Context, controller, get, provide, inject, del, post, patch,
} from 'midway'
import MyError from '@/app/common/my-error'
import { MenuService } from '@/app/service/menu'
import { MenuValidator } from '@/app/validator/menu'
import { RoleService } from '@/app/service/role'
import { PermissionService } from '@/app/service/permission'
import { AdminMenuInfo } from '@/app/model/admin-menu'

@provide()
@controller('/admin/menu')
export class MenuController {

  @inject('MenuService')
  service!: MenuService

  @inject('RoleService')
  RoleService!: RoleService

  @inject('PermissionService')
  PermissionService!: PermissionService

  @inject('MenuValidator')
  validator!: MenuValidator

  @get('/query')
  public async query(ctx: Context): Promise<void> {
    // 校验提交的参数
    const query = this.validator.queryMenu(ctx.request.query)

    const result = await this.service.queryAdminMenu(query)

    ctx.helper.success(ctx, result)
  }

  @get('/show')
  public async show(ctx: Context): Promise<void> {
    // 校验提交的参数
    const query = this.validator.showMenu(ctx.request.query)

    // 检查菜单是否存在
    await this.service.checkMenuExists([query.id])

    const result = await this.service.getAdminMenuById(query.id)

    ctx.helper.success(ctx, result)
  }

  @post('/create')
  public async create(ctx: Context): Promise<void> {
    // 校验提交的参数
    const params = this.validator.createMenu(ctx.request.body)
    const { roles = [], permissionId } = params

    // 检查角色是否存在
    await this.RoleService.checkRoleExists(roles)

    // 检查权限是否存在
    permissionId && await this.PermissionService.checkPermissionExists([permissionId])

    const result = await this.service.createAdminMenu(params)

    ctx.helper.success(ctx, result, null, 201)
  }

  @patch('/update')
  public async update(ctx: Context): Promise<void> {
    // 校验提交的参数
    const { id, ...params } = this.validator.updateMenu(ctx.request.body)
    const { roles = [], permissionId } = params

    // 检查菜单是否存在
    await this.service.checkMenuExists([id])

    // 检查角色是否存在
    await this.RoleService.checkRoleExists(roles)

    // 检查权限是否存在
    permissionId && await this.PermissionService.checkPermissionExists([permissionId])


    const [total] = await this.service.updateAdminMenu(id, params as AdminMenuInfo)
    assert(total, new MyError('更新失败', 400))

    ctx.helper.success(ctx, null, null, 204)
  }

  @del('/remove')
  public async remove(ctx: Context): Promise<void> {
    // 校验提交的参数
    const params = this.validator.removeMenu(ctx.request.body)

    // 检查菜单是否存在
    await this.service.checkMenuExists(params.ids)

    const total = await this.service.removeAdminMenuByIds(params.ids)
    assert(total, new MyError('删除失败', 400))

    ctx.helper.success(ctx, null, null, 204)
  }

}

