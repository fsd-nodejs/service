import { providerWrapper } from 'midway'
import {
  Column, CreatedAt, UpdatedAt, Model, Table, ForeignKey,
} from 'sequelize-typescript'
import AdminMenuModel from '@/app/model/admin-menu'
import AdminRoleModel from '@/app/model/admin-role'


@Table({
  freezeTableName: true,
  tableName: 'admin_role_menu',
})
export default class AdminRoleMenuModel extends Model<AdminRoleMenuModel> {

  @ForeignKey(() => AdminRoleModel)
  @Column({
    field: 'role_id',
  })
  roleId!: string

  @ForeignKey(() => AdminMenuModel)
  @Column({
    field: 'menu_id',
  })
  menuId!: string

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

export const factory = () => AdminRoleMenuModel
providerWrapper([
  {
    id: 'AdminRoleMenuModel',
    provider: factory,
  },
])

export type IAdminRoleMenuModel = typeof AdminRoleMenuModel
