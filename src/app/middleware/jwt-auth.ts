import { Middleware } from 'midway'
import * as assert from 'power-assert'

// jwt auth
export default (): Middleware => {
  return async (ctx, next) => {
    const [, token] = ctx.header.authorization.split(' ')

    try {
      // 解密，获取payload
      const { payload } = ctx.app.jwt.decode(token)

      // redisToken不存在表示token已过期
      const redisToken = await ctx.app.redis.get(`admin:accessToken:${payload.id}`)

      // 验证是否为最新的token
      assert(token === redisToken, 'token已过期或者失效')

      ctx.header.userId = payload.id
    }
    catch (error) {
      ctx.throw(401, 'Authentication Failed', { originalError: { message: 'RedisToken was expired!' } })
    }

    await next()
  }
}
