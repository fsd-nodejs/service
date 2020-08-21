import * as assert from 'assert'

import { provide, inject, Context } from 'midway'
import { Op } from 'sequelize'
import AdminRoleModel, { IAdminRoleModel, GetAdminRoleOpts, AdminRoleInfo } from '@/app/model/admin-role'
import AdminPermissionModel, { IAdminPermissionModel } from '@/app/model/admin-permission'
import { IAdminRolePermissionModel } from '@/app/model/admin-role-permission'
import AdminMenuModel from '@/app/model/admin-menu'
import MyError from '@/app/common/my-error'

@provide('RoleService')
export class RoleService {

  @inject()
  ctx!: Context

  @inject('AdminRoleModel')
  AdminRoleModel!: IAdminRoleModel

  @inject('AdminPermissionModel')
  AdminPermissionModel!: IAdminPermissionModel

  @inject('AdminRolePermissionModel')
  AdminRolePermissionModel!: IAdminRolePermissionModel

  /**
   * 分页查询角色列表
   * @param {GetAdminRoleOpts} queryParams
   */
  public async queryAdminRole(queryParams: GetAdminRoleOpts) {
    const {
      pageSize, current, sorter, ...params
    } = queryParams
    const where: any = {}
    let order: any = [['id', 'desc']]

    // 排序方式
    if (sorter) {
      order = [sorter.split('_')]
    }

    // 模糊匹配id
    if (params.id) {
      where.id = {
        [Op.like]: `%${params.id}`,
      }
    }

    // 模糊匹配名称
    if (params.name) {
      where.name = {
        [Op.like]: `%${params.name}`,
      }
    }

    // 模糊匹配标识
    if (params.slug) {
      where.slug = {
        [Op.like]: `%${params.slug}`,
      }
    }

    const { rows: list, count: total } = await this.AdminRoleModel.findAndCountAll({
      order,
      where,
      limit: pageSize,
      offset: pageSize * (current - 1),
      include: [
        {
          model: AdminPermissionModel,
          attributes: ['id', 'name', 'slug'],
          through: {
            attributes: [],
          },
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
   * 通过ID获取单条角色数据
   * @param {String} id
   * @returns {AdminRoleModel | null}
   */
  public async getAdminRoleById(id: string) {
    return this.AdminRoleModel.findOne({
      where: {
        id,
      },
      include: [
        {
          model: AdminPermissionModel,
          through: {
            attributes: [],
          },
          attributes: ['id', 'name', 'slug'],
        },
        {
          model: AdminMenuModel,
          through: {
            attributes: [],
          },
          attributes: ['id', 'parentId', 'title', 'uri'],
        },
      ],
    })
  }

  /**
   * 创建角色
   * @param {AdminRoleInfo} params
   * @returns {AdminRoleInfo}
   */
  public async createAdminRole(params: AdminRoleInfo) {
    const { permissions } = params

    const role = await this.AdminRoleModel.create({
      name: params.name,
      slug: params.slug,
    })

    // 如果有传递permissions
    if (permissions) {
      const rolePermissions = permissions.map(id => ({
        roleId: role.id,
        permissionId: id,
      }))
      await this.AdminRolePermissionModel.bulkCreate(rolePermissions)
    }

    return this.getAdminRoleById(role.id)
  }

  /**
   * 更新角色
   * @param {AdminRoleInfo} params
   * @returns {[number, AdminRoleModel[]]}
   */
  public async updateAdminRole(id: string, params: AdminRoleInfo) {
    const { permissions: newPermissions } = params

    const role = await this.getAdminRoleById(id) as AdminRoleModel

    // 如果有传递permissions
    if (newPermissions) {
      const oldPermissions = role.permissions.map(item => item.id)

      // 对比权限变更差异
      const [increase, decrease]: [any[], any[]] = this.ctx.helper.arrayDiff(newPermissions, oldPermissions)

      const increaseRolePermissions = increase.map(item => ({
        roleId: role.id,
        permissionId: item,
      }))

      await this.AdminRolePermissionModel.bulkCreate(increaseRolePermissions)
      await this.AdminRolePermissionModel.destroy({
        where: {
          roleId: role.id,
          permissionId: decrease,
        },
      })
    }

    return this.AdminRoleModel.update(params, {
      where: {
        id,
      },
      limit: 1,
    })
  }

  /**
   * 删除多条角色数据
   * @param {string[]} ids
   * @returns {number}
   */
  public async removeAdminRoleByIds(ids: string[]) {
    return this.AdminRoleModel.destroy({
      where: {
        id: ids,
      },
    })
  }

  /**
   * 检查角色是否存在于数据库，自动抛错
   * @param {string[]} ids
   */
  public async checkRoleExists(ids: string[]) {
    const count = await this.AdminRoleModel.count({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    })
    assert.deepEqual(
      count,
      ids.length,
      new MyError('角色不存在，请检查', 400),
    )
  }

}

export type IRoleService = RoleService
