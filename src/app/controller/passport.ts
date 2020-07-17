
import {
  Context, config, controller, get, provide, post,
} from 'midway'

@provide()
@controller('/passport')
export class PassportController {

  constructor(@config() private readonly welcomeMsg: string) { }

  @get('/', { middleware: ['apiMiddleware'] })
  public index(ctx: Context): void {
    ctx.body = `${this.welcomeMsg} - ${ctx.api.reqTimeStr}`
  }

  @post('/login')
  public login(ctx: Context): void {
    const createRule = {
      username: {
        type: 'string',
      },
      password: {
        type: 'string',
      },
    }
    ctx.validate(createRule)
    ctx.body = {
      success: true,
      message: 'OK',
      data: {},
    }
  }

}
