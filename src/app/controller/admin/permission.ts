import * as assert from 'assert'

import {
  Context, controller, get, provide, inject, del, post, patch,
} from 'midway'
import MyError from '@/app/common/my-error'
import { PermissionService } from '@/app/service/permission'
import { PermissionValidator } from '@/app/validator/permission'
import { AdminPermissionInfo } from '@/app/model/admin-permission'

@provide()
@controller('/admin/permission')
export class PermissionController {

  @inject('PermissionService')
  service!: PermissionService

  @inject('PermissionValidator')
  validator!: PermissionValidator

  @get('/query')
  public async query(ctx: Context): Promise<void> {
    // 校验提交的参数
    const query = this.validator.queryPermission(ctx.request.query)

    const result = await this.service.queryAdminPermission(query)

    ctx.helper.success(ctx, result)
  }

  @get('/show')
  public async show(ctx: Context): Promise<void> {
    // 校验提交的参数
    const query = this.validator.showPermission(ctx.request.query)

    // 检查权限是否存在
    await this.service.checkPermissionExists([query.id])

    const result = await this.service.getAdminPermissionById(query.id)

    ctx.helper.success(ctx, result)
  }

  @post('/create')
  public async create(ctx: Context): Promise<void> {
    // 校验提交的参数
    const params = this.validator.createPermission(ctx.request.body)

    const result = await this.service.createAdminPermission({
      ...params,
      httpMethod: params.httpMethod?.join(','),
    } as unknown as AdminPermissionInfo)

    ctx.helper.success(ctx, result, null, 201)
  }

  @patch('/update')
  public async update(ctx: Context): Promise<void> {
    // 校验提交的参数
    const { id, ...params } = this.validator.updatePermission(ctx.request.body)

    // 检查权限是否存在
    await this.service.checkPermissionExists([id as string])

    const [total] = await this.service.updateAdminPermission(id as string, {
      ...params,
      httpMethod: params.httpMethod?.join(','),
    } as unknown as AdminPermissionInfo)
    assert(total, new MyError('更新失败', 400))

    ctx.helper.success(ctx, null, null, 204)
  }

  @del('/remove')
  public async remove(ctx: Context): Promise<void> {
    // 校验提交的参数
    const params = this.validator.removePermission(ctx.request.body)

    // 检查权限是否存在
    await this.service.checkPermissionExists(params.ids)

    const total = await this.service.removeAdminPermissionByIds(params.ids)
    assert(total, new MyError('删除失败', 400))

    ctx.helper.success(ctx, null, null, 204)
  }

}

