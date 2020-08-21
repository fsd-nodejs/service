import { providerWrapper } from 'midway'
import {
  Column, CreatedAt, UpdatedAt, DataType, Model, Table, BelongsToMany,
} from 'sequelize-typescript'
import AdminPermissionModel from '@/app/model/admin-permission'
import AdminRolePermissionModel from '@/app/model/admin-role-permission'
import AdminMenuModel from '@/app/model/admin-menu'
import AdminRoleMenuModel from '@/app/model/admin-role-menu'


const { STRING, INTEGER } = DataType

@Table({
  freezeTableName: true,
  tableName: 'admin_roles',
})
export default class AdminRoleModel extends Model<AdminRoleModel> {

  @Column({
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  public get id() {
    return String(this.getDataValue('id'))
  }

  @Column({
    type: STRING(50),
    comment: '名称',
  })
  name!: string

  @Column({
    type: STRING(50),
    comment: '标识',
  })
  slug!: string

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

  @BelongsToMany(() => AdminPermissionModel, () => AdminRolePermissionModel)
  permissions!: AdminPermissionModel[]

  @BelongsToMany(() => AdminMenuModel, () => AdminRoleMenuModel)
  menu!: AdminMenuModel[]

}

export const factory = () => AdminRoleModel
providerWrapper([
  {
    id: 'AdminRoleModel',
    provider: factory,
  },
])

export type IAdminRoleModel = typeof AdminRoleModel

/**
 * 查询角色信息参数
 */
export interface GetAdminRoleOpts {
  id?: string // 自增id
  name?: string // 名称
  slug?: string // 标识
  sorter?: string // 排序
  pageSize: number
  current: number
}

/**
 * 角色信息
 */
export interface AdminRoleInfo {
  id?: string
  name?: string
  slug?: string
  permissions?: string[]
  createdAt?: Date
  updatedAt?: Date
}
