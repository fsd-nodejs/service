import * as Joi from 'joi'
import { provide } from 'midway'

import Validator from './validator'


@provide('MenuValidator')
export class MenuValidator extends Validator {

  /**
 * 查询菜单列表
 * @param {*} value
 * @memberof MenuValidator
 */
  public queryMenu(value: any) {
    return this.validate(value, {
      current: Joi.number()
        .max(100000)
        .default(1)
        .optional(),
      pageSize: Joi.number()
        .max(1000)
        .default(10)
        .optional(),
    })
  }

  /**
   * 查询菜单
   * @param {*} value
   * @memberof MenuValidator
   */
  public showMenu(value: any) {
    return this.validate(value, {
      id: Joi.string()
        .trim()
        .max(10)
        .required(),
    })
  }

  /**
   * 删除菜单
   * @param {*} value
   * @memberof MenuValidator
   */
  public removeMenu(value: any) {
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
   * 创建菜单
   * @param {*} value
   * @memberof MenuValidator
   */
  public createMenu(value: any) {
    return this.validate(value, {
      parentId: Joi.string()
        .trim()
        .max(10)
        .optional()
        .default('0'),
      title: Joi.string()
        .trim()
        .max(50)
        .required(),
      uri: Joi.string()
        .trim()
        .max(255)
        .uri({ allowRelative: true })
        .required(),
      roles: Joi.array()
        .items(
          Joi.string()
            .trim()
            .max(10),
        )
        .optional(),
      permissionId: Joi.string()
        .trim()
        .max(10)
        .optional(),
    })
  }

  /**
   * 修改菜单
   * @param {*} value
   * @memberof MenuValidator
   */
  public updateMenu(value: any) {
    return this.validate(value, {
      id: Joi.string()
        .max(10)
        .required(),
      parentId: Joi.string()
        .trim()
        .max(10)
        .optional()
        .default('0'),
      title: Joi.string()
        .trim()
        .max(50)
        .required(),
      uri: Joi.string()
        .trim()
        .max(255)
        .uri({ allowRelative: true })
        .required(),
      roles: Joi.array()
        .items(
          Joi.string()
            .trim()
            .max(10),
        )
        .optional(),
      permissionId: Joi.string()
        .trim()
        .max(10)
        .optional(),
    })
  }

  /**
   * 排序菜单
   * @param {*} value
   * @memberof MenuValidator
   */
  public orderMenu(value: any) {
    return this.validate(value, {
      orders: Joi.array().items(Joi.object({
        id: Joi.string()
          .trim()
          .max(10)
          .required(),
        parentId: Joi.string()
          .trim()
          .max(10)
          .optional()
          .default('0'),
      })),
    })
  }

}
