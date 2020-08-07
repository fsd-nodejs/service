import { Context, controller, get, provide, inject } from 'midway'
import { PermissionService } from '@/app/service/permission'
import { PermissionValidator } from '@/app/validator/permission'

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

    ctx.helper.success(ctx, result)
  }

}

