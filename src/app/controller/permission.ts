import { Context, controller, get, provide } from 'midway'
// import { UserService } from '@/app/service/user'

@provide()
@controller('/permission')
export class PermissionController {

  // constructor(
  //   @inject() private userService: UserService,
  // ) { }

  @get('/:id')
  public async getUser(ctx: Context): Promise<void> {
    // const id = +ctx.params.id
    // const user = await this.userService.getUser({ id })

    ctx.body = {
      success: true,
      message: 'OK',
      data: ctx,
    }
  }

}

