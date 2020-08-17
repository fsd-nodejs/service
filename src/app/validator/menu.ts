import * as Joi from 'joi'
import { provide } from 'midway'

import Validator from './validator'


@provide('MenuValidator')
export class MenuValidator extends Validator {

  /**
   * 查询菜单
   * @param {*} value
   * @memberof MenuValidator
   */
  public showMenu(value: any) {
    return this.validate(value, {
      id: Joi.string()
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
      ids: Joi.array().items(Joi.string()).min(1),
    })
  }

  /**
   * 创建菜单
   * @param {*} value
   * @memberof MenuValidator
   */
  public createMenu(value: any) {
    return this.validate(value, {
      name: Joi.string()
        .trim()
        .max(50)
        .required(),
      slug: Joi.string()
        .trim()
        .max(50)
        .required(),
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
        .max(50)
        .required(),
      name: Joi.string()
        .trim()
        .max(50)
        .optional(),
      slug: Joi.string()
        .trim()
        .max(50)
        .optional(),
    })
  }

}
