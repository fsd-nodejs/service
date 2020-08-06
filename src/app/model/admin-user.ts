import { providerWrapper } from 'midway'
import {
  Column, CreatedAt, UpdatedAt, DataType, Model, Scopes, Table,
} from 'sequelize-typescript'


const { STRING, INTEGER } = DataType

@Scopes({
  avaliable: {
    where: { status: 1 },
  },
})
@Table({
  freezeTableName: true,
  tableName: 'admin_users',
})
export class AdminUserModel extends Model {

  @Column({
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: string

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
}

/**
 * 管理员用户信息
 */
export interface AdminUserInfo {
  id: string
  username?: string
  password?: string
  phone?: string
  email?: string
  pass?: string
  active?: string
}
