// import { providerWrapper } from 'midway'
import {
  Column, CreatedAt, UpdatedAt, Model, Table, ForeignKey,
} from 'sequelize-typescript'
import AdminPermissionModel from '@/app/model/admin-permission'
import AdminRoleModel from '@/app/model/admin-role'


@Table({
  freezeTableName: true,
  tableName: 'admin_role_permissions',
})
export default class AdminRolePermissionModel extends Model<AdminRolePermissionModel> {

  @ForeignKey(() => AdminRoleModel)
  @Column({
    field: 'role_id',
  })
  roleId!: string


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


// export const factory = () => AdminRolePermissionModel
// providerWrapper([
//   {
//     id: 'AdminRolePermissionModel',
//     provider: factory,
//   },
// ])

export type IAdminRolePermissionModel = typeof AdminRolePermissionModel
