import { providerWrapper } from 'midway'
import {
  Column, CreatedAt, UpdatedAt, DataType, Model, Scopes, Table, BelongsToMany, BelongsTo,
} from 'sequelize-typescript'
// import AdminPermissionModel from '@/app/model/admin-permission'
import AdminRoleModel from '@/app/model/admin-role'
import AdminRoleMenuModel from '@/app/model/admin-role-menu'

import AdminPermissionModel from './admin-permission'


const { STRING, INTEGER } = DataType

@Scopes(() => ({
  roles: {
    include: [
      {
        model: AdminRoleModel,
        through: { attributes: [] },
      },
    ],
  },
}))
@Table({
  freezeTableName: true,
  tableName: 'admin_menu',
})
export default class AdminMenuModel extends Model<AdminMenuModel> {

  @Column({
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  public get id() {
    return String(this.getDataValue('id'))
  }

  @Column({
    type: INTEGER,
    field: 'parent_id',
    comment: '父级ID',
  })
  parentId!: string

  @Column({
    type: STRING(50),
    comment: '排序，数值越大越靠后',
  })
  order!: string

  @Column({
    type: STRING(255),
    comment: '路径',
  })
  uri!: string

  @CreatedAt
  @Column({
    field: 'created_at',
  })
  createdAt!: Date

  @UpdatedAt
  @Column({
    field: 'updated_at',
  })
  updatedAt!: Date

  @BelongsToMany(() => AdminRoleModel, () => AdminRoleMenuModel)
  roles!: AdminRoleModel[]

  @BelongsTo(() => AdminPermissionModel, 'permission_id')
  permission!: AdminPermissionModel

}

export const factory = () => AdminMenuModel
providerWrapper([
  {
    id: 'AdminMenuModel',
    provider: factory,
  },
])

export type IAdminMenuModel = typeof AdminMenuModel
/**
 * 查询权限信息参数
 */
export interface GetAdminMenuOpts {
  pageSize: number
  current: number
}


/**
 * 菜单信息
 */
export interface AdminMenuInfo {
  id?: string
  parentId?: string
  order?: string
  title?: string
  path?: string
  roles?: string[]
  permissionId?: string
  createdAt?: Date
  updatedAt?: Date
}
