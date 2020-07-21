// eslint-disable-next-line import/no-extraneous-dependencies
import 'tsconfig-paths/register'


export const cors = {
  enable: true,
  package: 'egg-cors',
}

export const validate = {
  enable: true,
  package: 'egg-validate',
}

export const redis = {
  enable: true,
  package: 'egg-redis',
}

// false 禁用全部安全检查用于临时调试
// export const security = false
