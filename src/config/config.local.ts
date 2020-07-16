
export const development = {
  watchDirs: [
    'agent.ts',
    'app.ts',
    'interface.ts',
    'app',
    'config',
    'lib',
    'middleware',
    'service',
  ],
  overrideDefault: true,
}

export const mysql = {
  // 单数据库信息配置
  client: {
    // host
    host: '192.168.13.41',
    // 端口号
    port: '3306',
    // 用户名
    user: 'homestead',
    // 密码
    password: 'secret',
    // 数据库名
    database: 'laravel',
  },
  // 是否加载到 app 上，默认开启
  app: true,
  // 是否加载到 agent 上，默认关闭
  agent: false,
}
