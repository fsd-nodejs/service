// eslint-disable-next-line import/no-extraneous-dependencies
import 'tsconfig-paths/register'


export const cors = {
  enable: true,
  package: 'egg-cors',
}

export const mysql = {
  enable: true,
  package: 'egg-mysql',
}

// false 禁用全部安全检查用于临时调试
// export const security = false
