import * as assert from 'assert'

import {
  Context, controller, get, provide, inject, del, post, patch,
} from 'midway'
import MyError from '@/app/common/my-error'
import { MenuService } from '@/app/service/menu'
import { MenuValidator } from '@/app/validator/menu'

@provide()
@controller('/menu')
export class MenuController {

  @inject('MenuService')
  service!: MenuService

  @inject('MenuValidator')
  validator!: MenuValidator

  @get('/query')
  public async query(ctx: Context): Promise<void> {
    const result = await this.service.queryAdminMenu()

    ctx.helper.success(ctx, result)
  }

  @get('/show')
  public async show(ctx: Context): Promise<void> {
    // 校验提交的参数
    const query = this.validator.showMenu(ctx.request.query)

    const result = await this.service.getAdminMenuById(query.id)

    ctx.helper.success(ctx, result)
  }

  @post('/create')
  public async create(ctx: Context): Promise<void> {
    // 校验提交的参数
    const params = this.validator.createMenu(ctx.request.body)

    const result = await this.service.createAdminMenu(params)

    ctx.helper.success(ctx, result, null, 201)
  }

  @patch('/update')
  public async update(ctx: Context): Promise<void> {
    // 校验提交的参数
    const { id, ...params } = this.validator.updateMenu(ctx.request.body)

    const [total] = await this.service.updateAdminMenu(id, params)
    assert(total, new MyError('更新失败', 400))

    ctx.helper.success(ctx, null, null, 204)
  }

  @del('/remove')
  public async remove(ctx: Context): Promise<void> {
    // 校验提交的参数
    const params = this.validator.removeMenu(ctx.request.body)

    const total = await this.service.removeAdminMenuByIds(params.ids)
    assert(total, new MyError('删除失败', 400))

    ctx.helper.success(ctx, null, null, 204)
  }

}

