import { EggAppInfo } from 'midway'

import { DefaultConfig } from './config.modal'


export default (appInfo: EggAppInfo) => {
  const config = {} as DefaultConfig

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1594797976100_9970'

  config.admin = {
    username: 'admin',
    password: 'admin',
  }

  // add your config here
  config.middleware = ['jwtAuth']

  // 所有的路径都走统一错误处理
  config.errorHandler = {
    match: '*',
  }

  config.welcomeMsg = 'Hello midwayjs!'

  config.sequelize = {
    host: '192.168.13.150',
    port: '3306',
    user: 'homestead',
    password: 'secret',
    database: 'shop_development',
    dialect: 'mysql',
    debug: false,
    timezone: '+08:00',
  }

  config.redis = {
    client: {
      port: 6379, // Redis port
      host: '192.168.13.150', // Redis host
      password: '',
      db: 0,
    },
  }

  // jwt
  config.jwt = {
    enable: true,
    client: {
      secret: '123456',
    },
    ignore: ['/auth/login', '/ping'],
  }

  // jwt token 校验中间件
  config.jwtAuth = {
    ignore: ['/auth/login', '/ping'],
  }

  return config
}
