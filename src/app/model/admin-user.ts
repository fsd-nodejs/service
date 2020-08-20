import { providerWrapper } from 'midway'
import {
  Column, CreatedAt, UpdatedAt, DataType, Model, Table, BelongsToMany,
} from 'sequelize-typescript'
import AdminRoleModel from '@/app/model/admin-role'
import AdminRoleUserModel from '@/app/model/admin-role-user'
import AdminPermissionModel from '@/app/model/admin-permission'
import AdminUserPermissionModel from '@/app/model/admin-user-permission'


const { STRING, INTEGER } = DataType

@Table({
  freezeTableName: true,
  tableName: 'admin_users',
})
export default class AdminUserModel extends Model<AdminUserModel> {

  @Column({
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  public get id() {
    return String(this.getDataValue('id'))
  }

  @Column({
    type: STRING(190),
    allowNull: false,
    comment: '用户名',
  })
  username!: string

  @Column({
    type: STRING(60),
    allowNull: false,
    comment: '密码',
  })
  password!: string

  @Column({
    type: STRING(255),
    comment: '名称',
  })
  name!: string

  @Column({
    type: STRING(255),
    comment: '头像',
  })
  avatar!: string

  @Column({
    type: STRING(100),
    comment: '记住token',
    field: 'remember_token',
  })
  rememberToken!: string

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

  @BelongsToMany(() => AdminRoleModel, () => AdminRoleUserModel)
  roles!: AdminRoleModel[]

  @BelongsToMany(() => AdminPermissionModel, () => AdminUserPermissionModel)
  permissions!: AdminPermissionModel[]

}

export const factory = () => AdminUserModel
providerWrapper([
  {
    id: 'AdminUserModel',
    provider: factory,
  },
])

export type IAdminUserModel = typeof AdminUserModel

/**
 * 查询管理员用户信息参数
 */
export interface GetAdminUserOpts {
  id: string
  name?: string // 名称
  username?: string // 帐号
  pageSize: number
  current: number
}

/**
 * 管理员用户信息
 */
export interface AdminUserInfo {
  id: string
  username?: string
  name?: string
  password?: string
  avatar?: string
  roles?: string[]
  permissions?: string[]
  createdAt?: Date
  updatedAt?: Date
}
