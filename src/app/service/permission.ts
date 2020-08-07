import { provide, inject } from 'midway'
import { IAdminPermissionModel, AdminPermissionInfo, GetAdminPermissionOpts } from '@/app/model/admin-permission'
import { Op } from 'sequelize'

@provide('PermissionService')
export class PermissionService {

  @inject('AdminPermissionModel')
  AdminPermissionModel!: IAdminPermissionModel

  /**
   * 创建权限
   */
  public async createAdminPermission(data: AdminPermissionInfo) {
    return this.AdminPermissionModel.create(data)
  }

  /**
   * 分页查询权限列表
   */
  public async queryAdminPermission(queryParams: GetAdminPermissionOpts) {
    const {
      pageSize, current, sorter, ...params
    } = queryParams
    const where: any = {}

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

    const { rows: list, count: total } = await this.AdminPermissionModel.findAndCountAll({
      order: [['id', 'desc']],
      where,
      raw: true,
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

}
