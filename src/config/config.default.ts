import { EggAppInfo } from 'midway'

import { DefaultConfig } from './config.modal'


export default (appInfo: EggAppInfo) => {
  const config = {} as DefaultConfig

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1594797976100_9970'

  // add your config here
  config.middleware = []

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
  }

  config.redis = {
    client: {
      port: 6379, // Redis port
      host: '192.168.13.150', // Redis host
      password: '',
      db: 0,
    },
  }

  config.jwt = {
    enable: true,
    client: {
      secret: '123456',
    },
    ignore: '/auth/login',
  }

  return config
}
