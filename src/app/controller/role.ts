import {
  Context, controller, get, provide, inject, del, post, patch,
} from 'midway'
import { RoleService } from '@/app/service/role'
import { RoleValidator } from '@/app/validator/role'

@provide()
@controller('/role')
export class RoleController {

  @inject('RoleService')
  service!: RoleService

  @inject('RoleValidator')
  validator!: RoleValidator

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

    const result = await this.service.getAdminRoleById(query.id)

    ctx.helper.success(ctx, result)
  }

  @post('/create')
  public async create(ctx: Context): Promise<void> {
    // 校验提交的参数
    const params = this.validator.createRole(ctx.request.body)

    const result = await this.service.createAdminRole({
      ...params,
      httpMethod: params.httpMethod.join(','),
    })

    ctx.helper.success(ctx, result, null, 201)
  }

  @patch('/update')
  public async update(ctx: Context): Promise<void> {
    // 校验提交的参数
    const { id, ...params } = this.validator.updateRole(ctx.request.body)
    params.httpMethod = params.httpMethod?.join(',')

    await this.service.updateAdminRole(id, params)

    ctx.helper.success(ctx, null, null, 204)
  }

  @del('/remove')
  public async remove(ctx: Context): Promise<void> {
    // 校验提交的参数
    const params = this.validator.removeRole(ctx.request.body)

    await this.service.removeAdminRoleByIds(params.ids)

    ctx.helper.success(ctx, null, null, 204)
  }

}

