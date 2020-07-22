import { provide, plugin, Service } from 'midway'
import { GetUserOpts, UserInfo } from '@/app/model/user'
import { } from 'egg-jwt'


@provide()
export class UserService extends Service {

  @plugin()
  jwt: any

  /**
   * 读取用户信息
   */
  public async getUser(options: GetUserOpts): Promise<UserInfo> {
    return {
      id: options.id,
      username: 'mockedName',
      phone: '12345678901',
      email: 'xxx.xxx@xxx.com',
    }
  }

  /**
   * 根据登录名查找用户
   * @param {String} loginName 登录名
   * @return {Promise[user]} 承载用户的 Promise 对象
   */
  public async getUserByLoginName(loginName: string): Promise<UserInfo[]> {
    const query = { loginname: new RegExp('^' + loginName + '$', 'u') }
    return this.ctx.model.User.findOne(query).exec()
  }

  /**
   * 根据邮箱，查找用户
   * @param {String} email 邮箱地址
   * @return {Promise[user]} 承载用户的 Promise 对象
   */
  public async getUserByMail(email: string): Promise<UserInfo[]> {
    return this.ctx.model.User.findOne({ email }).exec()
  }


  /**
   * 生成Token
   * @param {Object} data 保存的数据
   */
  public async createToken(data: object) {
    return this.jwt.sign(data, this.app.config.jwt.secret, { expiresIn: '12h' })
  }

  /**
 * 验证token的合法性
 * @param {String} token
 */
  public async verifyToken(token: string) {
    return new Promise((resolve) => {
      this.jwt.verify(token, this.app.config.jwt.secret, (err: Error, decoded: string) => {
        const result: {
          verify?: boolean,
          message?: string,
        } = {}
        if (err) {
          /*
            err = {
              name: 'TokenExpiredError',
              message: 'jwt expired',
              expiredAt: 1408621000
            }
          */
          result.verify = false
          result.message = err.message
        }
        else {
          result.verify = true
          result.message = decoded
        }
        resolve(result)
      })
    })
  }

}
