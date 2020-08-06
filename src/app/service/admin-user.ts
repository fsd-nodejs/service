import { provide, plugin, inject, Context, config } from 'midway'
import { GetAdminUserOpts, AdminUserInfo, IAdminUserModel, AdminUserModel } from '@/app/model/admin-user'
import { Jwt, JwtConfig } from '@waiting/egg-jwt'
import { Redis } from 'ioredis'

@provide('AdminUserService')
export class AdminUserService {

  @inject()
  ctx!: Context

  @config('jwt')
  config!: JwtConfig

  @inject('AdminUserModel')
  AdminUserModel!: IAdminUserModel

  @plugin()
  jwt!: Jwt

  @plugin()
  redis!: Redis

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
   * @returns {String} 生成的Token字符串
   */
  public async createToken(data: AdminUserModel) {
    const token: string = this.jwt.sign({ id: data.id }, this.config.client.secret, { expiresIn: '72h' })
    await this.redis.set(`accessToken:${data.id}`, token, 'EX', 60 * 60 * 24 * 3)
    return token
  }

  /**
   * 验证token的合法性
   * @param {String} token
   * @returns {Boolean} 是否合法
   */
  public async verifyToken(token: string) {
    return this.jwt.verify(token, this.config.client.secret)
  }


  /**
   * 使用帐号密码，本地化登录
   * @param {Object} params 包涵username、password等参数
   * @returns {Promise[adminUser] | null} 承载用户的Promise对象
   */
  public async localHandler(params: { username: string, password: string }): Promise<AdminUserModel | null> {
    // 获取用户函数
    const getAdminUser = (username: string) => {
      return this.getAdminUserByUserName(username)
    }

    // 查询用户是否在数据库中
    const existAdmiUser = await getAdminUser(params.username)
    // 用户不存在
    if (!existAdmiUser) {
      return null
    }

    // 匹配密码
    const passhash = existAdmiUser.password
    const equal = this.ctx.helper.bcompare(params.password, passhash)
    if (!equal) {
      return null
    }

    // 通过验证
    return existAdmiUser
  }

}

export type IAdminUserService = AdminUserService
