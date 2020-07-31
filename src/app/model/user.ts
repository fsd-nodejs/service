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
export class UserModel extends Model {

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
  })
  remember_token!: string

  @CreatedAt
  @Column({
    field: 'created_at',
  })
  created_at!: Date

  @UpdatedAt
  @Column({
    field: 'updated_at',
  })
  updated_at!: Date

}

export const factory = () => UserModel
providerWrapper([
  {
    id: 'UserModel',
    provider: factory,
  },
])

export type IUserModel = typeof UserModel

/**
 * 查询管理员用户信息参数
 */
export interface GetUserOpts {
  id: string
}

/**
 * 管理员用户信息
 */
export interface UserInfo {
  id: string
  username: string
  password?: string
  phone?: string
  email?: string
  pass?: string
  active?: string
}
