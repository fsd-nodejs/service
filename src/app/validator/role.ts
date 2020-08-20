import * as Joi from 'joi'
import { provide } from 'midway'

import Validator from './validator'


@provide('RoleValidator')
export class RoleValidator extends Validator {

  /**
   * 查询权限列表
   * @param {*} value
   * @memberof RoleValidator
   */
  public queryRole(value: any) {
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
        .trim()
        .max(10)
        .optional(),
      slug: Joi.string()
        .trim()
        .max(50)
        .optional(),
      sorter: Joi.string()
        .trim()
        .max(50)
        .regex(/^[a-zA-Z]*(_asc|_desc)$/)
        .optional(),
    })
  }

  /**
   * 查询权限
   * @param {*} value
   * @memberof RoleValidator
   */
  public showRole(value: any) {
    return this.validate(value, {
      id: Joi.string()
        .trim()
        .max(10)
        .required(),
    })
  }

  /**
   * 删除权限
   * @param {*} value
   * @memberof RoleValidator
   */
  public removeRole(value: any) {
    return this.validate(value, {
      ids: Joi.array()
        .items(
          Joi.string()
            .trim()
            .max(10),
        )
        .min(1),
    })
  }

  /**
   * 创建权限
   * @param {*} value
   * @memberof RoleValidator
   */
  public createRole(value: any) {
    return this.validate(value, {
      name: Joi.string()
        .trim()
        .max(50)
        .required(),
      slug: Joi.string()
        .trim()
        .max(50)
        .required(),
      permissions: Joi.array()
        .items(
          Joi.string()
            .trim()
            .max(10),
        )
        .optional(),
    })
  }

  /**
   * 修改权限
   * @param {*} value
   * @memberof RoleValidator
   */
  public updateRole(value: any) {
    return this.validate(value, {
      id: Joi.string()
        .max(10)
        .required(),
      name: Joi.string()
        .trim()
        .max(50)
        .optional(),
      slug: Joi.string()
        .trim()
        .max(50)
        .optional(),
      permissions: Joi.array()
        .items(
          Joi.string()
            .trim()
            .max(10),
        )
        .optional(),
    })
  }

}
