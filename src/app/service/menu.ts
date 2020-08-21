import * as assert from 'assert'

import { provide, inject, Context } from 'midway'
import { Op } from 'sequelize'
import AdminMenuModel, { IAdminMenuModel, AdminMenuInfo, GetAdminMenuOpts } from '@/app/model/admin-menu'
import AdminRoleModel from '@/app/model/admin-role'
import AdminPermissionModel from '@/app/model/admin-permission'
import { IAdminRoleMenuModel } from '@/app/model/admin-role-menu'
import MyError from '@/app/common/my-error'

@provide('MenuService')
export class MenuService {

  @inject()
  ctx!: Context

  @inject('AdminMenuModel')
  adminMenuModel!: IAdminMenuModel

  @inject('AdminRoleMenuModel')
  adminRoleMenuModel!: IAdminRoleMenuModel

  /**
   * 查询菜单列表
   * @param {GetAdminMenuOpts} queryParams
   */
  public async queryAdminMenu(queryParams: GetAdminMenuOpts) {
    const { current, pageSize } = queryParams
    const { rows: list, count: total } = await this.adminMenuModel.findAndCountAll({
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
    return this.adminMenuModel.findOne({
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
    const { roles } = params

    const menu = await this.adminMenuModel.create({
      parentId: params.parentId,
      title: params.title,
      uri: params.uri,
      permissionId: params.permissionId,
    })

    // 如果有传递roles
    if (roles) {
      const roleMenu = roles.map(id => ({
        roleId: id,
        menuId: menu.id,
      }))

      await this.adminRoleMenuModel.bulkCreate(roleMenu)
    }

    return this.getAdminMenuById(menu.id)
  }

  /**
   * 更新菜单
   * @param {AdminMenuInfo} params
   * @returns {[number, AdminMenuModel[]]}
   */
  public async updateAdminMenu(id: string, params: AdminMenuInfo) {
    const { roles: newRoles } = params

    const menu = await this.getAdminMenuById(id) as AdminMenuModel

    // 如果有传递roles
    if (newRoles) {
      const oldRoles = menu.roles.map(item => item.id)

      // 对比角色变更差异
      const [increase, decrease]: [any[], any[]] = this.ctx.helper.arrayDiff(newRoles, oldRoles)

      const increaseRoleMenu = increase.map(item => ({
        roleId: item,
        menuId: menu.id,
      }))

      await this.adminRoleMenuModel.bulkCreate(increaseRoleMenu)
      await this.adminRoleMenuModel.destroy({
        where: {
          roleId: decrease,
          menuId: menu.id,
        },
      })
    }

    return this.adminMenuModel.update(params, {
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
    return this.adminMenuModel.destroy({
      where: {
        id: ids,
      },
    })
  }

  /**
   * 检查菜单是否存在于数据库，自动抛错
   * @param {string[]} ids
   */
  public async checkMenuExists(ids: string[]) {
    const count = await this.adminMenuModel.count({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    })
    assert.deepEqual(
      count,
      ids.length,
      new MyError('菜单不存在，请检查', 400),
    )
  }

  /**
   * 批量更新菜单的排序和父级ID
   * @param {menu[]} params
   */
  public async orderAdminMemu(params: any[]) {
    const queue = params.map((item) => {
      const { id, ...filed } = item
      return this.adminMenuModel.update(filed, {
        where: {
          id,
        },
      })
    })
    return Promise.all(queue)
  }

}
