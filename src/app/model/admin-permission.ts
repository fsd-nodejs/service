import { providerWrapper } from 'midway'
import {
  Column, CreatedAt, UpdatedAt, DataType, Model, Table, BelongsToMany, HasMany,
} from 'sequelize-typescript'
import AdminRoleModel from '@/app/model/admin-role'
import AdminRolePermissionModel from '@/app/model/admin-role-permission'
import AdminMenuModel from '@/app/model/admin-menu'


const { STRING, INTEGER, TEXT } = DataType

@Table({
  freezeTableName: true,
  tableName: 'admin_permissions',
})
export default class AdminPermissionModel extends Model<AdminPermissionModel> {

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

  @Column({
    type: STRING(255),
    comment: '请求方式 ["ANY", "DELETE", "POST", "GET", "PUT", "PATCH", "OPTIONS", "HEAD"]',
    field: 'http_method',
  })
  public get httpMethod(): string[] {
    return String(this.getDataValue('httpMethod')).split(',')
  }

  @Column({
    type: TEXT,
    comment: '请求路径',
    field: 'http_path',
  })
  httpPath!: string

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

  @BelongsToMany(() => AdminRoleModel, () => AdminRolePermissionModel)
  roles!: AdminRoleModel[]

  @HasMany(() => AdminMenuModel, { foreignKey: 'permission_id' })
  menu!: AdminMenuModel[]

}

export const factory = () => AdminPermissionModel
providerWrapper([
  {
    id: 'AdminPermissionModel',
    provider: factory,
  },
])

export type IAdminPermissionModel = typeof AdminPermissionModel

/**
 * 查询权限信息参数
 */
export interface GetAdminPermissionOpts {
  id?: string // 自增id
  name?: string // 名称
  slug?: string // 标识
  httpMethod?: string[] // 请求方式
  httpPath?: string // 请求路径
  sorter?: string // 排序
  pageSize: number
  current: number
}

/**
 * 权限信息
 */
export interface AdminPermissionInfo {
  id?: string
  name?: string
  slug?: string
  httpMethod?: string[] // ["ANY", "DELETE", "POST", "GET", "PUT", "PATCH", "OPTIONS", "HEAD"]
  httpPath?: string
  createdAt?: Date
  updatedAt?: Date
}
