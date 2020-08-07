import * as Joi from 'joi'
import { provide } from 'midway'

import Validator from './validator'


@provide('PermissionValidator')
export class PermissionValidator extends Validator {

  /**
   * 查询权限列表
   * @param {*} value
   * @memberof PermissionValidator
   */
  public queryPermission(value: any) {
    return this.validate(value, {
      current: Joi.number()
        .max(100000)
        .default(1)
        .optional(),
      pageSize: Joi.number()
        .max(1000)
        .default(10)
        .optional(),
      id: Joi.string()
        .max(10)
        .optional(),
      slug: Joi.string()
        .max(50)
        .optional(),
      httpPath: Joi.string()
        .max(50)
        .optional(),
      httpMethod: Joi.string()
        .max(50)
        .optional(),
      sorter: Joi.string()
        .max(50)
        .regex(/^[a-zA-Z]*(_asc|_desc)$/)
        .optional(),
    })
  }

  /**
   * 查询权限
   * @param {*} value
   * @memberof PermissionValidator
   */
  public showPermission(value: any) {
    return this.validate(value, {
      id: Joi.string()
        .max(10)
        .required(),
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
