import 'joi-i18n'
import * as Joi from 'joi'
import MyError from '@/app/common/my-error'

import locales from './locales'

// 汉化错误提示信息
Joi.addLocaleData('zh_CN', locales)

export default class Validator {

  protected validate(rule: any, schema: Joi.SchemaLike) {
    const { error, value } = Joi.validate(rule, schema, { locale: 'zh_CN' })
    if (error) {
      throw new MyError('Validation Failed', 422, error.details)
    }
    return value
  }

}
