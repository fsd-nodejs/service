import { provide, plugin, inject, Context } from 'midway'
import { GetAdminUserOpts, AdminUserInfo, IAdminUserModel } from '@/app/model/admin-user'
import { Jwt } from '@waiting/egg-jwt'

@provide('AdminUserService')
export class AdminUserService {

  @inject()
  ctx!: Context

  @inject('AdminUserModel')
  public AdminUserModel!: IAdminUserModel

  @plugin()
  jwt!: Jwt

  /**
   * 读取用户信息
   */
  public async getUser(options: GetAdminUserOpts): Promise<AdminUserInfo> {
    return {
      id: options.id,
      username: 'mockedName',
      phone: '12345678901',
      email: 'xxx.xxx@xxx.com',
    }
  }

  /**
   * 根据登录名查找用户
   * @param {String} username 登录名
   * @return {Promise[user]} 承载用户的 Promise 对象
   */
  public async getAdminUserByUserName(username: string) {
    const user = this.AdminUserModel.findOne({
      raw: true,
      where: {
        username,
      },
    })
    return user
  }


  /**
   * 生成Token
   * @param {Object} data 保存的数据
   */
  // public async createToken(data: object) {
  //   return this.jwt.sign(data, this.app.config.jwt.secret, { expiresIn: '12h' })
  // }

  /**
 * 验证token的合法性
 * @param {String} token
 */
  // public async verifyToken(token: string) {
  //   return new Promise((resolve) => {
  //     this.jwt.verify(token, this.app.config.jwt.secret, (err: Error, decoded: string) => {
  //       const result: {
  //         verify?: boolean,
  //         message?: string,
  //       } = {}
  //       if (err) {
  //         /*
  //           err = {
  //             name: 'TokenExpiredError',
  //             message: 'jwt expired',
  //             expiredAt: 1408621000
  //           }
  //         */
  //         result.verify = false
  //         result.message = err.message
  //       }
  //       else {
  //         result.verify = true
  //         result.message = decoded
  //       }
  //       resolve(result)
  //     })
  //   })
  // }

}

export type IAdminUserService = AdminUserService
