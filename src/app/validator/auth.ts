import * as Joi from 'joi'
import { provide } from 'midway'

import Validator from './validator'


@provide('AuthValidator')
export class AuthValidator extends Validator {

  /**
   * 帐号密码登录校验
   * @param {*} value
   * @memberof AuthValidator
   */
  public login(value: any) {
    return this.validate(value, {
      username: Joi.string()
        .trim()
        .required()
        .min(5)
        .max(190),
      password: Joi.string()
        .trim()
        .required()
        .min(5)
        .max(60),
    })
  }

}
