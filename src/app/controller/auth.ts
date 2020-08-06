import {
  Context, config, controller, get, post, provide, inject,
} from 'midway'
import { IAdminUserService } from '@/app/service/admin-user'
@provide()
@controller('/auth')
export class AuthController {

  constructor(@config() private readonly welcomeMsg: string) { }

  @inject('AdminUserService')
  service!: IAdminUserService

  @get('/', { middleware: ['apiMiddleware'] })
  public index(ctx: Context): void {
    ctx.body = `${this.welcomeMsg} - ${ctx.api.reqTimeStr}`
  }

  @post('/login')
  public async login(ctx: Context): Promise<void> {
    // 如参数校验
    const rule = {
      username: { type: 'string', required: true },
      password: { type: 'string', required: true },
    }
    ctx.validate(rule, ctx.request.body)

    // 后续可能有多种登录方式
    const existAdmiUser = await this.service.localHandler(ctx.request.body)

    // 调用 rotateCsrfSecret 刷新用户的 CSRF token
    // ctx.rotateCsrfSecret()
    if (!existAdmiUser) {
      ctx.helper.error(ctx, 422, '这些凭据与我们的记录不符')
      return
    }
    // 生成Token
    const token = await this.service.createToken(existAdmiUser)

    // 缓存用户数据
    await this.service.cacheAdminUser(existAdmiUser)

    ctx.helper.success(ctx, {
      token,
      currentAuthority: 'admin',
      status: 'ok',
      type: 'account',
    })
  }

  // @post('/logout')
  // public async logout(ctx: Context): Promise<void> { }

}
