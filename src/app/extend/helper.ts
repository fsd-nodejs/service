import * as bcrypt from 'bcryptjs'
import * as moment from 'moment'
import { Context } from 'midway'


moment.locale('zh-cn')

/**
 * 密文转hash
 * @param str 需要加密的内容
 * @returns {String} 密文
 */
export const bhash = (str: string) => {
  return bcrypt.hashSync(str, 10)
}

/**
 * hash是否正确
 * @param str 需要匹配的内容
 * @param hash hash值
 * @returns {Boolean} 是否匹配
 */
export const bcompare = (str: string, hash: string) => {
  return bcrypt.compareSync(str, hash)
}

/**
 * 处理成功响应
 * @param ctx
 * @param result
 * @param message
 * @param status
 */
export const success = (ctx: Context, result = null, message = '请求成功', status = 200) => {
  ctx.body = {
    code: 0,
    message,
    data: result,
  }
  ctx.status = status
}

/**
 * 处理失败响应
 * @param ctx
 * @param code
 * @param message
 */
export const error = (ctx: Context, code: number, message: string) => {
  ctx.body = {
    code,
    message,
  }
  ctx.status = code
}
