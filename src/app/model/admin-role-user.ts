import { providerWrapper } from 'midway'
import {
  Column, CreatedAt, UpdatedAt, Model, Table, ForeignKey,
} from 'sequelize-typescript'
import AdminUserModel from '@/app/model/admin-user'
import AdminRoleModel from '@/app/model/admin-role'


@Table({
  freezeTableName: true,
  tableName: 'admin_role_users',
})
export default class AdminRoleUserModel extends Model<AdminRoleUserModel> {

  @ForeignKey(() => AdminRoleModel)
  @Column({
    field: 'role_id',
  })
  roleId!: string

  @ForeignKey(() => AdminUserModel)
  @Column({
    field: 'user_id',
  })
  userId!: string

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

export const factory = () => AdminRoleUserModel
providerWrapper([
  {
    id: 'AdminRoleUserModel',
    provider: factory,
  },
])

export type IAdminRoleUserModel = typeof AdminRoleUserModel
