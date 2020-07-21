import * as bcrypt from 'bcryptjs'
import * as moment from 'moment'


moment.locale('zh-cn')


export const bhash = (str: string) => {
  return bcrypt.hashSync(str, 10)
}

export const bcompare = (str: string, hash: string) => {
  return bcrypt.compareSync(str, hash)
}
