import { Sequelize } from 'sequelize-typescript'
import { provide, scope, ScopeEnum } from 'midway'
import { AdminUserModel } from '@/app/model/admin-user'
import { AdminPermissionModel } from '@/app/model/admin-permission'
import { AdminRoleModel } from '@/app/model/admin-role'
import { AdminRolePermissionModel } from '@/app/model/admin-role-permission'


interface SequelizeConfig {
  host: string
  port: number
  user: string
  password: string
  database: string
  dialect: 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | undefined
  debug: boolean
  timezone: string
}

@scope(ScopeEnum.Singleton)
@provide('DB')
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class DB {

  public static sequelize: Sequelize

  public static async initDB(conf: SequelizeConfig) {
    const {
      database, user, password, port, host, dialect, debug, timezone,
    } = conf
    DB.sequelize = new Sequelize(
      database,
      user,
      password,
      {
        database,
        username: user,
        password,
        dialect,
        host,
        port,
        timezone,
        logging: debug,
      },
    )
    await DB.sequelize.addModels([AdminUserModel, AdminPermissionModel, AdminRoleModel, AdminRolePermissionModel])

    try {
      await DB.sequelize.authenticate()
    }
    catch (error) {
      error.message = `DB connection error: ${error.message}`
      throw error
    }
  }

}
