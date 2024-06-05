# 大前端

## Vue

vue项目中package.json文件的dependencies和devDependencies有什么区别



- `dependencies` 中的包是项目运行时必需的核心依赖，而 `devDependencies` 中的包是开发过程中使用的辅助依赖。
- 生产环境部署时，只需要安装 `dependencies` 中的包，而开发环境需要安装 `dependencies` 和 `devDependencies` 中的包。

## npm

> corepack enable作用

Corepack 是一个用于增强 npm 的包管理器，它提供了更快的安装速度和更好的本地缓存功能。启用 Corepack 后，它将替代标准的 npm 命令，并提供更快速的包安装和更好的缓存管理。

一旦你在项目中运行了 `corepack enable`，之后执行的所有 `npm` 命令都将由 Corepack 处理。这包括 `npm install`、`npm ci`、`npm update` 等等。Corepack 将自动管理你的本地缓存，以便在安装依赖时提供更快的速度，并且会在必要时自动下载缺失的包。

总的来说，`corepack enable` 的作用是在你的项目中启用 Corepack，以提高 npm 命令的性能和效率。

> npm ci作用

1. **安装速度**：`npm ci` 比 `npm install` 更快。`npm ci` 会跳过生成依赖树和解决依赖版本的步骤，而直接使用 `package-lock.json`（或 `npm-shrinkwrap.json`）文件中的精确版本信息来安装依赖项。因此，它通常比 `npm install` 更快。
2. **依赖版本的确定性**：`npm ci` 确保安装的依赖版本与 `package-lock.json` 中指定的一致。它会忽略 `package.json` 中的版本范围，并始终安装 `package-lock.json` 中指定的确切版本。这种确定性有助于在不同的环境中保持依赖的一致性，尤其是在持续集成和部署过程中。



> "@vuepress/plugin-sitemap": "^2.0.0-rc.30"

你也可以使用 `^` 或 `~` 符号来指定一个范围，例如：

- `^1.2.3`：允许安装 `1.x.x` 中最新的版本，但不包括 `2.0.0` 或更高的版本。
- `~1.2.3`：允许安装 `1.2.x` 中最新的版本，但不包括 `1.3.0` 或更高的版本。

如果你只想更新包的次要版本或补丁版本，而不改变主要版本号，你可以使用 `^` 或 `~` 符号。如果你想更新到指定版本，可以直接指定版本号。

更新后，记得运行 `npm install` 或 `npm ci` 来安装更新后的依赖项。