import { provide, inject } from 'midway'
import { IAdminPermissionModel, AdminPermissionInfo, GetAdminPermissionOpts } from '@/app/model/admin-permission'
import { Op } from 'sequelize'

@provide('PermissionService')
export class PermissionService {

  @inject('AdminPermissionModel')
  AdminPermissionModel!: IAdminPermissionModel

  /**
   * 创建权限
   * @param {AdminPermissionInfo} params
   */
  public async createAdminPermission(params: AdminPermissionInfo) {
    const { httpMethod = [], ...data } = params
    return this.AdminPermissionModel.create({
      ...data,
      httpMethod: httpMethod.join(','),
    })
  }

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
        [Op.like]: `%${params.id}%`,
      }
    }

    // 模糊匹配名称
    if (params.name) {
      where.name = {
        [Op.like]: `%${params.name}%`,
      }
    }

    // 模糊匹配标识
    if (params.slug) {
      where.slug = {
        [Op.like]: `%${params.slug}%`,
      }
    }

    // 模糊匹配路径
    if (params.httpPath) {
      where.httpPath = {
        [Op.like]: `%${params.httpPath}%`,
      }
    }

    // 模糊匹配请求方式
    if (params.httpMethod) {
      where.httpMethod = {
        [Op.like]: `%${params.httpMethod}%`,
      }
    }

    const { rows, count: total } = await this.AdminPermissionModel.findAndCountAll({
      order,
      where,
      raw: true,
      limit: pageSize,
      offset: pageSize * (current - 1),
    })
    const list = rows.map((item) => {
      const httpMethod = item.httpMethod.split(',')
      return { ...item, httpMethod }
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
   */
  public async getAdminPermissionById(id: string) {
    return this.AdminPermissionModel.findOne({
      raw: true,
      where: {
        id,
      },
    })
  }

  /**
   * 删除多条权限数据
   * @param {string} ids
   */
  public async removeAdminPermissionByIds(ids: string[]) {
    return this.AdminPermissionModel.destroy({
      where: {
        id: ids,
      },
    })
  }

}
