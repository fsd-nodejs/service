import * as bcrypt from 'bcryptjs'
import * as moment from 'moment'
import { Context } from 'midway'


moment.locale('zh-cn')


export const bhash = (str: string) => {
  return bcrypt.hashSync(str, 10)
}

export const bcompare = (str: string, hash: string) => {
  return bcrypt.compareSync(str, hash)
}

// 处理成功响应
export const success = (ctx: Context, result = null, message = '请求成功', status = 200) => {
  ctx.body = {
    code: 0,
    message,
    data: result,
  }
  ctx.status = status
}

// 处理失败响应
export const error = (ctx: Context, code: number, message: string) => {
  ctx.body = {
    code,
    message,
  }
  ctx.status = code
}