import {
  Context, controller, get, provide, inject, del, post, put,
} from 'midway'
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

  @post('/create')
  public async create(ctx: Context): Promise<void> {
    // 校验提交的参数
    const params = this.validator.createPermission(ctx.request.body)

    const result = await this.service.createAdminPermission({
      ...params,
      httpMethod: params.httpMethod.join(','),
    })

    ctx.helper.success(ctx, result, null, 201)
  }

  @put('/update')
  public async update(ctx: Context): Promise<void> {
    // 校验提交的参数
    const { id, ...params } = this.validator.updatePermission(ctx.request.body)

    await this.service.updateAdminPermission(id, {
      ...params,
      httpMethod: params.httpMethod.join(','),
    })

    ctx.helper.success(ctx, null, null, 204)
  }

  @del('/remove')
  public async remove(ctx: Context): Promise<void> {
    // 校验提交的参数
    const params = this.validator.removePermission(ctx.request.body)

    await this.service.removeAdminPermissionByIds(params.ids)

    ctx.helper.success(ctx, null, null, 204)
  }

}

