import * as Joi from 'joi'
import MyError from '@/app/common/my-error'


export default class Validator {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected validate(rule: any, schema: Joi.SchemaLike) {
    const { error, value } = Joi.validate(rule, schema)
    if (error) {
      throw new MyError('Validation Failed', 422, error.details)
    }
    return value
  }

}
