import { provide, plugin, inject, Context, config } from 'midway'
import { Jwt, JwtConfig } from '@waiting/egg-jwt'
import { Redis } from 'ioredis'
import AdminUserModel, { IAdminUserModel, AdminUserInfo } from '@/app/model/admin-user'


@provide('AuthService')
export class AuthService {

  @config('jwt')
  jwtConfig!: JwtConfig

  @inject()
  ctx!: Context

  @inject('AdminUserModel')
  adminUserModel!: IAdminUserModel

  @plugin()
  jwt!: Jwt

  @plugin()
  redis!: Redis

  /**
   * 生成Token(会缓存到Redis中)
   * @param {AdminUserModel} data 保存的数据
   * @returns {String} 生成的Token字符串
   */
  public async createAdminUserToken(data: AdminUserModel) {
    const token: string = this.jwt.sign({ id: data.id }, this.jwtConfig.client.secret, { expiresIn: '72h' })
    await this.redis.set(`admin:accessToken:${data.id}`, token, 'EX', 60 * 60 * 24 * 3)
    return token
  }

  /**
   * 获取用户Redis Token
   * @param {String} id 管理员用户id
   * @returns {String} Redis中的Token
   */
  public async getAdminUserTokenById(id: string) {
    return this.redis.get(`admin:accessToken:${id}`)
  }

  /**
   * 移除用户Redis Token
   * @param {String} id 管理员用户id
   * @returns {number} 变更的数量
   */
  public async removeAdminUserTokenById(id: string) {
    return this.redis.del(`admin:accessToken:${id}`)
  }

  /**
   * 根据登录名查找用户
   * @param {String} username 登录名
   * @returns {AdminUserModel | null} 承载用户的 Promise 对象
   */
  public async getAdminUserByUserName(username: string) {
    const user = await this.adminUserModel.findOne({
      where: {
        username,
      },
    })
    return user
  }

  /**
   * 读取Redis缓存中的管理员用户信息
   * @param {String} id
   * @returns {AdminUserInfo} 管理员用户信息
   */
  public async getAdminUserById(id: string) {
    const userinfo = await this.redis.get(`admin:userinfo:${id}`) as string
    return JSON.parse(userinfo) as AdminUserInfo
  }

  /**
   * 缓存用户
   * @param {AdminUserModel} data 用户数据
   * @returns {OK | null} 缓存处理结果
   */
  public async cacheAdminUser(data: AdminUserModel) {
    const {
      id, username, name, avatar, createdAt, updatedAt,
    } = data

    const userinfo = {
      id, username, name, avatar, createdAt, updatedAt,
    }

    return this.redis.set(`admin:userinfo:${userinfo.id}`, JSON.stringify(userinfo), 'EX', 60 * 60 * 24 * 3)
  }

  /**
   * 清理用户缓存数据
   * @param {String} id 用户id
   * @returns {number} 缓存处理结果
   */
  public async cleanAdminUserById(id: string) {
    return this.redis.del(`admin:userinfo:${id}`)
  }

  /**
   * 使用帐号密码，本地化登录
   * @param {Object} params 包涵username、password等参数
   * @returns {Promise[adminUser] | null} 承载用户的Promise对象
   */
  public async localHandler(params: { username: string, password: string }) {
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
