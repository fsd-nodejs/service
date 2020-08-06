import * as assert from 'assert'

import MyError from '@/app/common/my-error'
import { Middleware } from 'midway'

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
      assert(token === redisToken, new MyError('token已过期或者失效', 401))

      ctx.user = payload
    }
    catch (error) {
      // console.log(error.status)
      ctx.throw(error)
    }

    await next()
  }
}
