import * as Joi from 'joi'
import { provide } from 'midway'

import Validator from './validator'


@provide('PermissionValidator')
export default class PermissionValidator extends Validator {

  /**
   * 查询权限
   * @param {*} value
   * @memberof PermissionValidator
   */
  public queryPermission(value: any) {
    return this.validate(value, {
      current: Joi.number(),
      pageSize: Joi.number().max(1000),
    })
  }

  public createPermission(value: any) {
    return this.validate(value, {
      name: Joi.string()
        .trim()
        .required(),
      slug: Joi.string()
        .trim()
        .required(),
    })
  }

}
