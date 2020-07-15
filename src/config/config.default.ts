import { EggAppInfo } from 'midway'

import { DefaultConfig } from './config.modal'


export default (appInfo: EggAppInfo) => {
  const config = {} as DefaultConfig

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1594797976100_9970';

  // add your config here
  config.middleware = []

  config.welcomeMsg = 'Hello midwayjs!'

  return config
}
