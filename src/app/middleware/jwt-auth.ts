import { Redis } from 'ioredis'
import { plugin, provide, WebMiddleware, Middleware } from 'midway'
import * as assert from 'power-assert'
import { Jwt } from '@waiting/egg-jwt'

// jwt auth
@provide()
export class JwtAuth implements WebMiddleware {

  @plugin()
  jwt!: Jwt

  @plugin()
  redis!: Redis

  public resolve(): Middleware {
    return async (ctx, next) => {
      const [, token] = ctx.header.authorization.split(' ')

      try {
        // 解密，获取payload
        const { payload } = this.jwt.decode(token)
        // redisToken不存在表示token已过期
        const redisToken = await this.redis.get(`admin:accessToken:${payload.id}`)

        // 验证是否为最新的token
        assert(token === redisToken, 'token已过期或者失效')

        ctx.header.userId = payload.id
      }
      catch (error) {
        ctx.logger.error('jwt验证失败：', error)
        ctx.throw(401, 'Unauthorized', { originalError: error })
      }

      await next()
    }
  }

}
