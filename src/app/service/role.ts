import { provide, inject } from 'midway'
import { IAdminRoleModel, GetAdminRoleOpts, AdminRoleInfo } from '@/app/model/admin-role'
import AdminPermissionModel from '@/app/model/admin-permission'
import { Op } from 'sequelize'

@provide('RoleService')
export class RoleService {

  @inject('AdminRoleModel')
  AdminRoleModel!: IAdminRoleModel

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

    const { rows: list, count: total } = await this.AdminRoleModel.findAndCountAll({
      order,
      where,
      limit: pageSize,
      offset: pageSize * (current - 1),
      include: [
        {
          model: AdminPermissionModel,
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
    return this.AdminRoleModel.create(params)
  }

  /**
   * 更新角色
   * @param {AdminRoleInfo} params
   * @returns {[number, AdminRoleModel[]]}
   */
  public async updateAdminRole(id: string, params: AdminRoleInfo) {
    return this.AdminRoleModel.update(params, {
      where: {
        id,
      },
      limit: 1,
    })
  }

  /**
   * 删除多条角色数据
   * @param {string} ids
   * @returns {number}
   */
  public async removeAdminRoleByIds(ids: string[]) {
    return this.AdminRoleModel.destroy({
      where: {
        id: ids,
      },
    })
  }

}
