import * as Joi from 'joi'
import { provide } from 'midway'

import Validator from './validator'


@provide('AuthValidator')
export class AuthValidator extends Validator {

  /**
   * 查询权限
   * @param {*} value
   * @memberof AuthValidator
   */
  public login(value: any) {
    return this.validate(value, {
      username: Joi.string()
        .trim()
        .required()
        .min(6)
        .max(190),
      password: Joi.string()
        .trim()
        .required()
        .min(6)
        .max(60),
    })
  }

}
