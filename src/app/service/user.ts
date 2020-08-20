import * as assert from 'assert'

import { provide, inject, Context } from 'midway'
import { Op } from 'sequelize'
import AdminUserModel, { IAdminUserModel, AdminUserInfo, GetAdminUserOpts } from '@/app/model/admin-user'
import AdminRoleModel from '@/app/model/admin-role'
import AdminPermissionModel from '@/app/model/admin-permission'
import { IAdminRoleUserModel } from '@/app/model/admin-role-user'
import { IAdminUserPermissionModel } from '@/app/model/admin-user-permission'
import MyError from '@/app/common/my-error'

@provide('UserService')
export class UserService {

  @inject()
  ctx!: Context

  @inject('AdminUserModel')
  AdminUserModel!: IAdminUserModel

  @inject('AdminRoleUserModel')
  AdminRoleUserModel!: IAdminRoleUserModel

  @inject('AdminUserPermissionModel')
  AdminUserPermissionModel!: IAdminUserPermissionModel

  /**
   * 查询管理员用户列表(不分页)
   * @param {GetAdminUserOpts} queryParams
   */
  public async queryAdminUser(queryParams: GetAdminUserOpts) {
    const { current, pageSize } = queryParams
    const { rows: list, count: total } = await this.AdminUserModel.findAndCountAll({
      limit: pageSize,
      offset: pageSize * (current - 1),
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
          through: {
            attributes: [],
          },
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
   * 通过ID获取单条管理员用户数据
   * @param {String} id
   * @returns {AdminUserModel | null}
   */
  public async getAdminUserById(id: string) {
    return this.AdminUserModel.findOne({
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
          through: {
            attributes: [],
          },
          attributes: ['id', 'name', 'slug'],
        },
      ],
    })
  }

  /**
   * 创建管理员用户
   * @param {AdminUserInfo} params
   * @returns {AdminUserInfo}
   */
  public async createAdminUser(params: AdminUserInfo) {
    const { roles, permissions } = params

    const user = await this.AdminUserModel.create({
      name: params.name,
      username: params.username,
      avatar: params.avatar,
      password: params.password,
    })

    // 如果有传递roles
    if (roles) {
      const roleUser = roles.map(id => ({
        roleId: id,
        userId: user.id,
      }))

      await this.AdminRoleUserModel.bulkCreate(roleUser)
    }

    // 如果有传递permissions
    if (permissions) {
      const userPermission = permissions.map(id => ({
        userId: user.id,
        permissionId: id,
      }))

      await this.AdminUserPermissionModel.bulkCreate(userPermission)
    }

    return this.getAdminUserById(user.id)
  }

  /**
   * 更新管理员用户
   * @param {AdminUserInfo} params
   * @returns {[number, AdminUserModel[]]}
   */
  public async updateAdminUser(id: string, params: AdminUserInfo) {
    const { roles: newRoles, permissions: newPermissions } = params

    const user = await this.getAdminUserById(id) as AdminUserModel

    // 如果有传递roles
    if (newRoles) {
      const oldRoles = user?.roles.map(item => item.id)

      // 对比角色变更差异
      const [increase, decrease]: [any[], any[]] = this.ctx.helper.arrayDiff(newRoles, oldRoles)

      const increaseRoleUser = increase.map(item => ({
        roleId: item,
        userId: user.id,
      }))

      await this.AdminRoleUserModel.bulkCreate(increaseRoleUser)
      await this.AdminRoleUserModel.destroy({
        where: {
          roleId: decrease,
          userId: user.id,
        },
      })
    }

    // 如果有传递permissions
    if (newPermissions) {
      const oldPermissions = user?.permissions.map(item => item.id)

      // 对比权限变更差异
      const [increase, decrease]: [any[], any[]] = this.ctx.helper.arrayDiff(newPermissions, oldPermissions)

      const increaseUserPermission = increase.map(item => ({
        userId: user.id,
        permissionId: item,
      }))

      await this.AdminRoleUserModel.bulkCreate(increaseUserPermission)
      await this.AdminRoleUserModel.destroy({
        where: {
          userId: user.id,
          permissionId: decrease,
        },
      })
    }

    return this.AdminUserModel.update(params, {
      where: {
        id,
      },
      limit: 1,
    })
  }

  /**
   * 删除多条管理员用户数据
   * @param {string} ids
   * @returns {number}
   */
  public async removeAdminUserByIds(ids: string[]) {
    return this.AdminUserModel.destroy({
      where: {
        id: ids,
      },
    })
  }

  /**
   * 检查管理员用户是否存在于数据库，自动抛错
   * @param {string[]} ids
   */
  public async checkUserExists(ids: string[]) {
    const count = await this.AdminUserModel.count({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    })
    assert.deepEqual(
      count,
      ids.length,
      new MyError('管理员用户不存在，请检查', 400),
    )
  }

}

export type IUserService = UserService
