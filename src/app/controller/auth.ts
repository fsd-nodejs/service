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


  /**
   * 使用帐号密码，本地化登录
   * @param {Context} ctx 请求对象
   * @param {Object} params 包涵username、password等参数
   * @returns {Promise[adminUser] | null} 承载用户的Promise对象
   */
  private localHandler = async (ctx: Context, params: { username: string, password: string }) => {
    // 获取用户函数
    const getAdminUser = (username: string) => {
      return this.service.getAdminUserByUserName(username)
    }

    // 查询用户是否在数据库中
    const existAdmiUser = await getAdminUser(params.username)
    // 用户不存在
    if (!existAdmiUser) {
      return null
    }

    // 匹配密码
    const passhash = existAdmiUser.password
    const equal = ctx.helper.bcompare(params.password, passhash)
    if (!equal) {
      return null
    }

    // 通过验证
    return existAdmiUser
  }


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
    const handler = this.localHandler
    const existAdmiUser = await handler(ctx, ctx.request.body)

    // 调用 rotateCsrfSecret 刷新用户的 CSRF token
    // ctx.rotateCsrfSecret()
    if (!existAdmiUser) {
      ctx.body = {}
      return
    }
    const token = await this.service.createToken({
      id: existAdmiUser.id,
    })
    ctx.body = {
      token,
    }
  }

}
