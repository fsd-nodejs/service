import { provide, inject } from 'midway'
import { IAdminMenuModel, AdminMenuInfo, GetAdminMenuOpts } from '@/app/model/admin-menu'
import AdminRoleModel from '@/app/model/admin-role'

import AdminPermissionModel from '../model/admin-permission'

@provide('MenuService')
export class MenuService {

  @inject('AdminMenuModel')
  AdminMenuModel!: IAdminMenuModel

  /**
   * 查询菜单列表(不分页)
   * @param {GetAdminMenuOpts} queryParams
   */
  public async queryAdminMenu(queryParams: GetAdminMenuOpts) {
    const { current, pageSize } = queryParams
    const { rows: list, count: total } = await this.AdminMenuModel.findAndCountAll({
      limit: pageSize,
      offset: pageSize * (current - 1),
      include: [
        {
          model: AdminPermissionModel,
          attributes: ['id', 'name', 'slug'],
        },
      ],
    })
    return {
      current,
      pageSize,
      total,
      list,
    }
  }

  /**
   * 通过ID获取单条菜单数据
   * @param {String} id
   * @returns {AdminMenuModel | null}
   */
  public async getAdminMenuById(id: string) {
    return this.AdminMenuModel.findOne({
      where: {
        id,
      },
      include: [
        {
          model: AdminRoleModel,
          through: {
            attributes: [],
          },
          attributes: ['id', 'name', 'slug'],
        },
        {
          model: AdminPermissionModel,
          attributes: ['id', 'name', 'slug'],
        },
      ],
    })
  }

  /**
   * 创建菜单
   * @param {AdminMenuInfo} params
   * @returns {AdminMenuInfo}
   */
  public async createAdminMenu(params: AdminMenuInfo) {
    return this.AdminMenuModel.create(params)
  }

  /**
   * 更新菜单
   * @param {AdminMenuInfo} params
   * @returns {[number, AdminMenuModel[]]}
   */
  public async updateAdminMenu(id: string, params: AdminMenuInfo) {
    return this.AdminMenuModel.update(params, {
      where: {
        id,
      },
      limit: 1,
    })
  }

  /**
   * 删除多条菜单数据
   * @param {string} ids
   * @returns {number}
   */
  public async removeAdminMenuByIds(ids: string[]) {
    return this.AdminMenuModel.destroy({
      where: {
        id: ids,
      },
    })
  }

}

export type IMenuService = MenuService
