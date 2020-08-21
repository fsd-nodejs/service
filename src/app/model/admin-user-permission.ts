import { providerWrapper } from 'midway'
import {
  Column, CreatedAt, UpdatedAt, Model, Table, ForeignKey,
} from 'sequelize-typescript'
import AdminUserModel from '@/app/model/admin-user'
import AdminPermissionModel from '@/app/model/admin-permission'


@Table({
  freezeTableName: true,
  tableName: 'admin_user_permissions',
})
export default class AdminUserPermissionModel extends Model<AdminUserPermissionModel> {

  @ForeignKey(() => AdminUserModel)
  @Column({
    field: 'user_id',
  })
  userId!: string

  @ForeignKey(() => AdminPermissionModel)
  @Column({
    field: 'permission_id',
  })
  permissionId!: string

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

export const factory = () => AdminUserPermissionModel
providerWrapper([
  {
    id: 'AdminUserPermissionModel',
    provider: factory,
  },
])

export type IAdminUserPermissionModel = typeof AdminUserPermissionModel
