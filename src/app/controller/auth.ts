import * as assert from 'assert'

import {
  Context, controller, get, post, provide, inject,
} from 'midway'
import { AuthService } from '@/app/service/auth'
import { AuthValidator } from '@/app/validator/auth'
import MyError from '@/app/common/my-error'

@provide()
@controller('/auth')
export class AuthController {

  @inject('AuthService')
  service!: AuthService

  @inject('AuthValidator')
  validator!: AuthValidator

  /**
   * 登录，目前使用帐号+密码模式
   */
  @post('/login')
  public async login(ctx: Context): Promise<void> {
    // 如参数校验
    const params = this.validator.login(ctx.request.body)

    // 后续可能有多种登录方式
    const existAdmiUser = await this.service.localHandler(params)

    // 判断用户是否存在
    assert(existAdmiUser !== null, new MyError('这些凭据与我们的记录不符', 400))

    // 生成Token
    const token = await this.service.createAdminUserToken(existAdmiUser)

    // 缓存用户数据
    await this.service.cacheAdminUser(existAdmiUser)

    // 调用 rotateCsrfSecret 刷新用户的 CSRF token
    // ctx.rotateCsrfSecret()

    ctx.helper.success(ctx, {
      token,
      currentAuthority: 'admin',
      status: 'ok',
      type: 'account',
    })
  }

  /**
   * 退出登录
   */
  @get('/logout')
  public async logout(ctx: Context): Promise<void> {
    const { user } = ctx

    // 清理用户数据和token
    await this.service.removeAdminUserTokenById(user.id)
    await this.service.cleanAdminUserById(user.id)

    ctx.helper.success(ctx, {})
  }

  /**
   * 获取当前用户的信息
   */
  @get('/currentUser')
  public async currentUser(ctx: Context): Promise<void> {
    const { user } = ctx

    const currentUser = await this.service.getAdminUserById(user.id)

    ctx.helper.success(ctx, currentUser)
  }

}
