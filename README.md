# service

Node.js 全栈开发-后端服务

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
- - [ ] Admin登录
- - [ ] 普通用户登录-账户密码
- - [ ] OAuth 2.0
- - [ ] 日志监控
- - [ ] 本地上传文件服务
- - [ ] 鉴权中间件
- - [ ] 接口响应统计中间件

- 超级管理
- - [ ] 权限
- - [ ] 角色
- - [ ] 用户
- - [ ] 菜单
- - [ ] 日志
