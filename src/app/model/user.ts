/**
 * 查询用户信息参数
 */
export interface GetUserOpts {
  id: string
}

/**
 * 用户信息
 */
export interface UserInfo {
  id: string
  username: string
  password?: string
  phone?: string
  email?: string
  pass?: string
  active?: string
}
