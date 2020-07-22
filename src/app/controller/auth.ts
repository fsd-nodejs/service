import {
  Context, config, plugin, controller, get, provide,
} from 'midway'

@provide()
@controller('/auth')
export class AuthController {

  @plugin()
  jwt: any

  constructor(@config() private readonly welcomeMsg: string) { }

  @get('/', { middleware: ['apiMiddleware'] })
  public index(ctx: Context): void {
    ctx.body = `${this.welcomeMsg} - ${ctx.api.reqTimeStr}`
  }

  @get('/login')
  public login(ctx: Context): void {
    const rule = {
      username: { type: 'string', required: true },
      password: { type: 'string', required: true },
    }
    ctx.validate(rule, ctx.request.body)
    ctx.body = { token: this.jwt.sign({ name: 'tony' }) }
  }

}
