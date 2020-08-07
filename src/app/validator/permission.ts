import * as Joi from 'joi'
import { provide } from 'midway'

import Validator from './validator'


@provide('PermissionValidator')
export class PermissionValidator extends Validator {

  /**
   * 查询权限
   * @param {*} value
   * @memberof PermissionValidator
   */
  public queryPermission(value: any) {
    return this.validate(value, {
      current: Joi.number().max(100000).default(1),
      pageSize: Joi.number().max(1000).default(10),
      id: Joi.string().max(10),
      slug: [Joi.string().max(50), Joi.empty()],
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
