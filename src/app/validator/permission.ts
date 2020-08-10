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

  /**
   * 删除权限
   * @param {*} value
   * @memberof PermissionValidator
   */
  public removePermission(value: any) {
    return this.validate(value, {
      ids: Joi.array().items(Joi.string()).min(1),
    })
  }

  /**
   * 创建权限
   * @param {*} value
   * @memberof PermissionValidator
   */
  public createPermission(value: any) {
    return this.validate(value, {
      name: Joi.string()
        .trim()
        .max(50)
        .required(),
      slug: Joi.string()
        .trim()
        .max(50)
        .required(),
      httpMethod: Joi.array()
        .items(
          Joi.string()
            .valid(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD', 'ANY'])
            .empty()
            .label('httpMethod'),
        ).unique()
        .required(),
      httpPath: Joi.string()
        .uri({ allowRelative: true })
        .required(),
    })
  }

  /**
   * 修改权限
   * @param {*} value
   * @memberof PermissionValidator
   */
  public updatePermission(value: any) {
    return this.validate(value, {
      id: Joi.string()
        .max(50)
        .required(),
      name: Joi.string()
        .trim()
        .max(50)
        .required(),
      slug: Joi.string()
        .trim()
        .max(50)
        .required(),
      httpMethod: Joi.array()
        .items(
          Joi.string()
            .valid(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD', 'ANY'])
            .empty()
            .label('httpMethod'),
        ).unique()
        .required(),
      httpPath: Joi.string()
        .uri({ allowRelative: true })
        .required(),
    })
  }

}
