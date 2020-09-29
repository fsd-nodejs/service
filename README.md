# service

[![codecov](https://codecov.io/gh/fsd-nodejs/service/branch/master/graph/badge.svg)](https://codecov.io/gh/fsd-nodejs/service)
[![GitHub Actions status](https://github.com/fsd-nodejs/service/workflows/Node.js%20CI/badge.svg)](https://github.com/fsd-nodejs/service)
[![codebeat badge](https://codebeat.co/badges/8b640045-39b8-403e-9c47-605b08df53af)](https://codebeat.co/projects/github-com-fsd-nodejs-service-master)

Node.js 全栈开发-后端服务(仅对管理后台，提供API服务)

用户端的服务，单独由其他项目提供

## 升级到2.x
midway在2.x有诸多特性提升，本项目作为示例工程，将一同升级到最新到版本。
各个功能和业务模块也将迁移到2.x搬去
同时sequelize也会替换成TypeORM
joi这层的验证功能，在2.x版本被集成进了框架，也将改写这部分代码。


## 快速入门

<!-- 在此次添加使用文档 -->

如需进一步了解，参见 [midway 文档][midway]。

### 本地开发

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### 部署

```bash
$ npm start
$ npm stop
```

### 单元测试

- [midway-bin] 内置了 [mocha], [thunk-mocha], [power-assert], [istanbul] 等框架，让你可以专注于写单元测试，无需理会配套工具。
- 断言库非常推荐使用 [power-assert]。
- 具体参见 [midway 文档 - 单元测试](https://eggjs.org/zh-cn/core/unittest)。

### 内置指令

- 使用 `npm run lint` 来做代码风格检查。
- 使用 `npm test` 来执行单元测试。
- 使用 `npm run autod` 来自动检测依赖更新，详细参见 [autod](https://www.npmjs.com/package/autod) 。


[midway]: https://midwayjs.org

## TODO

- 基础
- - [x] Admin登录
- - [ ] 普通用户登录-账户密码
- - [ ] OAuth 2.0
- - [ ] 日志监控
- - [ ] 本地上传文件服务
- - [x] 鉴权中间件
- - [ ] 接口响应统计中间件

- 超级管理
- - [x] 权限
- - [x] 角色
- - [x] 用户(管理员)
- - [x] 菜单
- - [ ] 日志

## 问题汇总
- sequlize  设置raw=true 无法自定义字段格式，get() set()

## 注意事项
- 单元测试需要导入部分测试数据
