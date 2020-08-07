// import { Context, controller, get, inject, provide } from 'midway'
// import { IAdminUserService } from '@/app/service/admin-user'

// @provide()
// @controller('/adminUser')
// export class AdminUserController {

//   @inject('AdminUserService')
//   service!: IAdminUserService

//   @get('/')
//   public async getUser(ctx: Context): Promise<void> {
//     const { id } = ctx.params
//     const user = await this.service.getUser({ id })

//     ctx.body = {
//       success: true,
//       message: 'OK',
//       data: user,
//     }
//   }

// }

