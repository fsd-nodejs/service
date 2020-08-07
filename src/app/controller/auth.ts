import * as assert from 'assert'

import {
  Context, config, controller, get, post, provide, inject,
} from 'midway'
import { AuthService } from '@/app/service/auth'
import { AdminUserModel } from '@/app/model/admin-user'
import MyError from '@/app/common/my-error'

@provide()
@controller('/auth')
export class AuthController {

  constructor(@config() private readonly welcomeMsg: string) { }

  @inject('AuthService')
  service!: AuthService

  @get('/', { middleware: ['apiMiddleware'] })
  public index(ctx: Context): void {
    ctx.body = `${this.welcomeMsg} - ${ctx.api.reqTimeStr}`
  }

  /**
   * 登录，目前使用帐号+密码模式
   */
  @post('/login')
  public async login(ctx: Context): Promise<void> {
    // 如参数校验
    const rule = {
      username: { type: 'string', required: true },
      password: { type: 'string', required: true },
    }

    ctx.validate(rule, ctx.request.body)

    // 后续可能有多种登录方式
    const existAdmiUser = await this.service.localHandler(ctx.request.body) as AdminUserModel

    // 调用 rotateCsrfSecret 刷新用户的 CSRF token
    ctx.rotateCsrfSecret()

    // 判断用户是否存在
    assert(existAdmiUser !== null, new MyError('这些凭据与我们的记录不符', 400))

    // 生成Token
    const token = await this.service.createAdminUserToken(existAdmiUser)

    // 缓存用户数据
    await this.service.cacheAdminUser(existAdmiUser)

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
