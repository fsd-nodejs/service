import { Context, config, controller, get, provide } from 'midway'

@provide()
@controller('/')
export class HomeController {

  @config()
  private readonly welcomeMsg!: string

  @get('/', { middleware: ['apiMiddleware'] })
  public index(ctx: Context): void {
    ctx.body = `${this.welcomeMsg} - ${ctx.api.reqTimeStr}`
  }

  @get('/ping')
  public ping(ctx: Context): void {
    ctx.body = 'OK'
  }

}
