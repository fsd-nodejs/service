import * as assert from 'assert'

import {
  Context, controller, get, provide, inject, del, post, patch,
} from 'midway'
import MyError from '@/app/common/my-error'
import { UserService } from '@/app/service/user'
import { AdminUserValidator } from '@/app/validator/admin-user'
import { RoleService } from '@/app/service/role'
import { PermissionService } from '@/app/service/permission'

@provide()
@controller('/admin/menu')
export class UserController {

  @inject('UserService')
  service!: UserService

  @inject('RoleService')
  RoleService!: RoleService

  @inject('PermissionService')
  PermissionService!: PermissionService

  @inject('AdminUserValidator')
  validator!: AdminUserValidator

  @get('/query')
  public async query(ctx: Context): Promise<void> {
    // 校验提交的参数
    const query = this.validator.queryUser(ctx.request.query)

    const result = await this.service.queryAdminUser(query)

    ctx.helper.success(ctx, result)
  }

  @get('/show')
  public async show(ctx: Context): Promise<void> {
    // 校验提交的参数
    const query = this.validator.showUser(ctx.request.query)

    // 检查管理员是否存在
    await this.service.checkUserExists([query.id])

    const result = await this.service.getAdminUserById(query.id)

    ctx.helper.success(ctx, result)
  }

  @post('/create')
  public async create(ctx: Context): Promise<void> {
    // 校验提交的参数
    const params = this.validator.createUser(ctx.request.body)
    const { roles = [], permissions = [] } = params

    // 检查角色是否存在
    await this.RoleService.checkRoleExists(roles)

    // 检查权限是否存在
    await this.PermissionService.checkPermissionExists(permissions)

    const result = await this.service.createAdminUser(params)

    ctx.helper.success(ctx, result, null, 201)
  }

  @patch('/update')
  public async update(ctx: Context): Promise<void> {
    // 校验提交的参数
    const { id, ...params } = this.validator.updateUser(ctx.request.body)
    const { roles = [], permissions = [] } = params

    // 检查管理员是否存在
    await this.service.checkUserExists([id])

    // 检查角色是否存在
    await this.RoleService.checkRoleExists(roles)

    // 检查权限是否存在
    await this.PermissionService.checkPermissionExists(permissions)

    const [total] = await this.service.updateAdminUser(id, params)
    assert(total, new MyError('更新失败', 400))

    ctx.helper.success(ctx, null, null, 204)
  }

  @del('/remove')
  public async remove(ctx: Context): Promise<void> {
    // 校验提交的参数
    const params = this.validator.removeUser(ctx.request.body)

    // 检查管理员是否存在
    await this.service.checkUserExists(params.ids)

    const total = await this.service.removeAdminUserByIds(params.ids)
    assert(total, new MyError('删除失败', 400))

    ctx.helper.success(ctx, null, null, 204)
  }

}

