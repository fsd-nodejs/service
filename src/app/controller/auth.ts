import {
  Context, config, plugin, controller, get, post, provide, inject,
} from 'midway'
import { IAdminUserService } from '@/app/service/admin-user'
import { Jwt } from '@waiting/egg-jwt'

@provide()
@controller('/auth')
export class AuthController {

  constructor(@config() private readonly welcomeMsg: string) { }

  @plugin()
  jwt!: Jwt

  @inject('AdminUserService')
  service!: IAdminUserService


  @get('/', { middleware: ['apiMiddleware'] })
  public index(ctx: Context): void {
    ctx.body = `${this.welcomeMsg} - ${ctx.api.reqTimeStr}`
  }

  @post('/login')
  public async login(ctx: Context): Promise<void> {
    // 获取用户函数
    const getAdminUser = (username: string) => {
      return this.service.getAdminUserByUserName(username)
    }

    const rule = {
      username: { type: 'string', required: true },
      password: { type: 'string', required: true },
    }
    ctx.validate(rule, ctx.request.body)
    const { username, password } = ctx.request.body

    // 查询用户是否在数据库中
    const existAdmiUser = await getAdminUser(username)

    // 用户不存在
    if (!existAdmiUser) {
      ctx.body = {}
      return
    }

    // 调用 rotateCsrfSecret 刷新用户的 CSRF token
    // ctx.rotateCsrfSecret()

    ctx.body = { token: this.jwt.sign({ username, password }), existAdmiUser }
  }

}
