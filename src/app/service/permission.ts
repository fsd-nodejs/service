import * as assert from 'assert'

import { provide, inject } from 'midway'
import { Op } from 'sequelize'
import { IAdminPermissionModel, AdminPermissionInfo, GetAdminPermissionOpts } from '@/app/model/admin-permission'
import AdminRoleModel from '@/app/model/admin-role'
import AdminMenuModel from '@/app/model/admin-menu'
import MyError from '@/app/common/my-error'

@provide('PermissionService')
export class PermissionService {

  @inject('AdminPermissionModel')
  adminPermissionModel!: IAdminPermissionModel

  /**
   * 分页查询权限列表
   * @param {GetAdminPermissionOpts} queryParams
   */
  public async queryAdminPermission(queryParams: GetAdminPermissionOpts) {
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

    // 模糊匹配路径
    if (params.httpPath) {
      where.httpPath = {
        [Op.like]: `%${params.httpPath}`,
      }
    }

    // 模糊匹配请求方式
    if (params.httpMethod) {
      where.httpMethod = {
        [Op.like]: `%${params.httpMethod}`,
      }
    }

    const { rows: list, count: total } = await this.adminPermissionModel.findAndCountAll({
      order,
      where,
      limit: pageSize,
      offset: pageSize * (current - 1),
    })

    return {
      current,
      pageSize,
      total,
      list,
    }
  }

  /**
   * 通过ID获取单条权限数据
   * @param {String} id
   * @returns {AdminPermissionModel | null}
   */
  public async getAdminPermissionById(id: string) {
    return this.adminPermissionModel.findOne({
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
          model: AdminMenuModel,
          attributes: ['id', 'parentId', 'title', 'uri'],
        },
      ],
    })
  }

  /**
   * 创建权限
   * @param {AdminPermissionInfo} params
   * @returns {AdminPermissionModel}
   */
  public async createAdminPermission(params: AdminPermissionInfo) {
    return this.adminPermissionModel.create(params)
  }

  /**
   * 更新权限
   * @param {AdminPermissionInfo} params
   */
  public async updateAdminPermission(id: string, params: AdminPermissionInfo) {
    return this.adminPermissionModel.update(params, {
      where: {
        id,
      },
      limit: 1,
    })
  }

  /**
   * 删除多条权限数据
   * @param {string} ids
   * @returns {number}
   */
  public async removeAdminPermissionByIds(ids: string[]) {
    return this.adminPermissionModel.destroy({
      where: {
        id: ids,
      },
    })
  }

  /**
   * 检查权限是否存在于数据库，自动抛错
   * @param {string[]} ids
   */
  public async checkPermissionExists(ids: string[]) {
    const count = await this.adminPermissionModel.count({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    })
    assert.deepEqual(
      count,
      ids.length,
      new MyError('权限不存在，请检查', 400),
    )
  }

}
export type IPermissionService = PermissionService
