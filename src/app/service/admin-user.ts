import { provide, plugin, inject, Context, config } from 'midway'
import { GetAdminUserOpts, AdminUserInfo, IAdminUserModel } from '@/app/model/admin-user'
import { Jwt, JwtConfig } from '@waiting/egg-jwt'

@provide('AdminUserService')
export class AdminUserService {

  @inject()
  ctx!: Context

  @config('jwt')
  config!: JwtConfig

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
  public async createToken(data: object) {
    return this.jwt.sign(data, this.config.client.secret, { expiresIn: '72h' })
  }

  /**
   * 验证token的合法性
   * @param {String} token
   */
  public async verifyToken(token: string) {
    return this.jwt.verify(token, this.config.client.secret)
  }

}

export type IAdminUserService = AdminUserService
