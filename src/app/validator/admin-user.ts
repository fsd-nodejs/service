import * as Joi from 'joi'
import { provide } from 'midway'

import Validator from './validator'


@provide('AdminUserValidator')
export class AdminUserValidator extends Validator {

  /**
 * 查询管理员用户列表
 * @param {*} value
 * @memberof AdminUserValidator
 */
  public queryUser(value: any) {
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
      name: Joi.string()
        .trim()
        .max(50)
        .optional(),
      username: Joi.string()
        .trim()
        .max(50)
        .optional(),
    })
  }

  /**
   * 查询管理员用户
   * @param {*} value
   * @memberof AdminUserValidator
   */
  public showUser(value: any) {
    return this.validate(value, {
      id: Joi.string()
        .trim()
        .max(10)
        .required(),
    })
  }

  /**
   * 删除管理员用户
   * @param {*} value
   * @memberof AdminUserValidator
   */
  public removeUser(value: any) {
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
   * 创建管理员用户
   * @param {*} value
   * @memberof AdminUserValidator
   */
  public createUser(value: any) {
    return this.validate(value, {
      username: Joi.string()
        .trim()
        .min(5)
        .max(190)
        .required(),
      name: Joi.string()
        .trim()
        .min(5)
        .max(255)
        .required(),
      avatar: Joi.string()
        .trim()
        .max(255)
        .optional(),
      password: Joi.string()
        .trim()
        .min(5)
        .max(60)
        .required(),
      roles: Joi.array()
        .items(
          Joi.string()
            .trim()
            .max(10),
        )
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

  /**
   * 修改管理员用户
   * @param {*} value
   * @memberof AdminUserValidator
   */
  public updateUser(value: any) {
    return this.validate(value, {
      id: Joi.string()
        .max(10)
        .required(),
      username: Joi.string()
        .trim()
        .min(5)
        .max(190)
        .required(),
      name: Joi.string()
        .trim()
        .min(5)
        .max(255)
        .required(),
      avatar: Joi.string()
        .trim()
        .max(255)
        .optional(),
      password: Joi.string()
        .trim()
        .min(5)
        .max(60)
        .required(),
      roles: Joi.array()
        .items(
          Joi.string()
            .trim()
            .max(10),
        )
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
