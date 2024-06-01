# 大前端

## Vue

vue项目中package.json文件的dependencies和devDependencies有什么区别



- `dependencies` 中的包是项目运行时必需的核心依赖，而 `devDependencies` 中的包是开发过程中使用的辅助依赖。
- 生产环境部署时，只需要安装 `dependencies` 中的包，而开发环境需要安装 `dependencies` 和 `devDependencies` 中的包。