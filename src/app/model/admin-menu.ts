import { providerWrapper } from 'midway'
import {
  Column, CreatedAt, UpdatedAt, DataType, Model, Scopes, Table, BelongsTo, BelongsToMany,
} from 'sequelize-typescript'
import AdminPermissionModel from '@/app/model/admin-permission'
import AdminRoleModel from '@/app/model/admin-role'
import AdminRoleMenuModel from '@/app/model/admin-role-menu'


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
  id!: string

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
  path!: string

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

  @BelongsTo(() => AdminPermissionModel, 'slug')
  permission!: string

  @BelongsToMany(() => AdminRoleModel, () => AdminRoleMenuModel)
  roles!: AdminRoleModel[]

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
 * 菜单信息
 */
export interface AdminMenuInfo {
  id?: string
  parentId?: string
  order?: string
  title?: string
  path?: string
  permission?: string
  createdAt?: Date
  updatedAt?: Date
}
