import * as assert from 'assert'

import {
  Context, controller, get, provide, inject, del, post, patch,
} from 'midway'
import MyError from '@/app/common/my-error'
import { RoleService } from '@/app/service/role'
import { RoleValidator } from '@/app/validator/role'
import { PermissionService } from '@/app/service/permission'

@provide()
@controller('/role')
export class RoleController {

  @inject('RoleService')
  service!: RoleService

  @inject('RoleValidator')
  validator!: RoleValidator

  @inject('PermissionService')
  PermissionService!: PermissionService

  @get('/query')
  public async query(ctx: Context): Promise<void> {
    // 校验提交的参数
    const query = this.validator.queryRole(ctx.request.query)

    const result = await this.service.queryAdminRole(query)

    ctx.helper.success(ctx, result)
  }

  @get('/show')
  public async show(ctx: Context): Promise<void> {
    // 校验提交的参数
    const query = this.validator.showRole(ctx.request.query)

    // 检查角色是否存在
    await this.service.checkRoleExists([query.id])

    const result = await this.service.getAdminRoleById(query.id)

    ctx.helper.success(ctx, result)
  }

  @post('/create')
  public async create(ctx: Context): Promise<void> {
    // 校验提交的参数
    const params = this.validator.createRole(ctx.request.body)
    const { permissions = [] } = params

    // 检查权限是否存在
    await this.PermissionService.checkPermissionExists(permissions)

    const result = await this.service.createAdminRole(params)

    ctx.helper.success(ctx, result, null, 201)
  }

  @patch('/update')
  public async update(ctx: Context): Promise<void> {
    // 校验提交的参数
    const { id, ...params } = this.validator.updateRole(ctx.request.body)

    // 检查角色是否存在
    await this.service.checkRoleExists([id])

    // 检查权限是否存在
    const { permissions: newPermissions = [] } = params
    await this.PermissionService.checkPermissionExists(newPermissions)

    const [total] = await this.service.updateAdminRole(id, params)
    assert(total, new MyError('更新失败', 400))

    ctx.helper.success(ctx, null, null, 204)
  }

  @del('/remove')
  public async remove(ctx: Context): Promise<void> {
    // 校验提交的参数
    const params = this.validator.removeRole(ctx.request.body)

    // 检查角色是否存在
    await this.service.checkRoleExists(params.ids)

    const total = await this.service.removeAdminRoleByIds(params.ids)
    assert(total, new MyError('删除失败', 400))

    ctx.helper.success(ctx, null, null, 204)
  }

}

