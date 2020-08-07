import { provide, inject } from 'midway'
import { IAdminPermissionModel, AdminPermissionInfo, GetAdminPermissionOpts } from '@/app/model/admin-permission'
import { WhereAttributeHash } from 'sequelize'

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
      pageSize = 10, current = 1, sorter, ...where
    } = queryParams

    return this.AdminPermissionModel.findAll({
      order: [['id', 'desc']],
      where: where as WhereAttributeHash,
      raw: true,
      limit: pageSize,
      offset: pageSize * (current - 1),
    })
  }

}
