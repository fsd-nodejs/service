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
  adminUserModel!: IAdminUserModel

  @inject('AdminRoleUserModel')
  adminRoleUserModel!: IAdminRoleUserModel

  @inject('AdminUserPermissionModel')
  adminUserPermissionModel!: IAdminUserPermissionModel

  /**
   * 查询管理员用户列表
   * @param {GetAdminUserOpts} queryParams
   */
  public async queryAdminUser(queryParams: GetAdminUserOpts) {
    const {
      current, pageSize, sorter, ...params
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

    // 模糊匹配帐号
    if (params.username) {
      where.username = {
        [Op.like]: `%${params.username}`,
      }
    }

    const { rows: list, count: total } = await this.adminUserModel.findAndCountAll({
      order,
      where,
      limit: pageSize,
      offset: pageSize * (current - 1),
      attributes: ['id', 'username', 'name', 'avatar', 'createdAt', 'updatedAt'],
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
    return this.adminUserModel.findOne({
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

    const user = await this.adminUserModel.create({
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

      await this.adminRoleUserModel.bulkCreate(roleUser)
    }

    // 如果有传递permissions
    if (permissions) {
      const userPermission = permissions.map(id => ({
        userId: user.id,
        permissionId: id,
      }))

      await this.adminUserPermissionModel.bulkCreate(userPermission)
    }

    return this.getAdminUserById(user.id)
  }

  /**
   * 更新管理员用户
   * @param {AdminUserInfo} params
   * @returns {[number, AdminUserModel[]]}
   */
  public async updateAdminUser(id: string, params: AdminUserInfo) {
    const { roles: newRoles, permissions: newPermissions, password } = params

    const user = await this.getAdminUserById(id) as AdminUserModel

    let newPassword = user.password
    // 如果有传递password
    if (password) {
      password !== user.password && (newPassword = this.ctx.helper.bhash(password))
    }

    // 如果有传递roles
    if (newRoles) {
      const oldRoles = user.roles.map(item => item.id)

      // 对比角色变更差异
      const [increase, decrease]: [any[], any[]] = this.ctx.helper.arrayDiff(newRoles, oldRoles)

      const increaseRoleUser = increase.map(item => ({
        roleId: item,
        userId: user.id,
      }))

      await this.adminRoleUserModel.bulkCreate(increaseRoleUser)
      await this.adminRoleUserModel.destroy({
        where: {
          roleId: decrease,
          userId: user.id,
        },
      })
    }

    // 如果有传递permissions
    if (newPermissions) {
      const oldPermissions = user.permissions.map(item => item.id)

      // 对比权限变更差异
      const [increase, decrease]: [any[], any[]] = this.ctx.helper.arrayDiff(newPermissions, oldPermissions)

      const increaseUserPermission = increase.map(item => ({
        userId: user.id,
        permissionId: item,
      }))

      await this.adminUserPermissionModel.bulkCreate(increaseUserPermission)
      await this.adminUserPermissionModel.destroy({
        where: {
          userId: user.id,
          permissionId: decrease,
        },
      })
    }

    return this.adminUserModel.update({
      ...params,
      password: newPassword,
    }, {
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
    return this.adminUserModel.destroy({
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
    const count = await this.adminUserModel.count({
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

