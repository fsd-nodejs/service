import * as assert from 'assert'

import { Context, controller, get, provide, inject } from 'midway'
import { PermissionService } from '@/app/service/permission'
import { PermissionValidator } from '@/app/validator/permission'
import MyError from '@/app/common/my-error'

@provide()
@controller('/permission')
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

    const result = await this.service.getAdminPermissionById(query.id)
    assert(result !== null, new MyError('未找到对应数据', 400))

    ctx.helper.success(ctx, result)
  }

}

