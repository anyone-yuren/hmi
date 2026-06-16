<a name="readme-top"></a>

<div align="center">

<img height="120" src="https://raw.githubusercontent.com/anyone-yuren/multiway/master/favicon.ico">

<h1>RCS 4.0</h1>
<p>我们做了什么优化？</p>
Gbeata Admin是一套用于快速构建后台管理系统模板，也是后续为达成全系统UI保持交互、主题一致而搭建的技术架构。我们已经在平煤汇总平台， WCS（平煤一期）、调度系统重构得到落地实践，并且不断的在迭代完善。

文档地址：[https://docs.gbeata.cn/](https://docs.gbeata.cn/)

组件库地址：[https://component.gbeata.cn/](https://component.gbeata.cn/)

[English](./README.md) ・ 简体中文 ・ [更新日志](./CHANGELOG.md) · [报告问题][github-issues-link] · [请求功能][github-issues-link]

<!-- SHIELD GROUP -->

[![][npm-release-shield]][npm-release-link]
[![][npm-downloads-shield]][npm-downloads-link]
[![][github-releasedate-shield]][github-releasedate-link]
[![][github-action-release-shield]][github-action-release-link]<br/>
[![][github-contributors-shield]][github-contributors-link]

</div>

## 我们都做了什么

> 结合3.0上线后，项目上标准与非标的具体情况，以下我们将围绕项目实施与技术方案两个维度来讲解4.0关于前端做了什么优化。

### 项目实施

1. 保持原有3.0分模块部署的方案，优化打包部署形式，保留镜像部署与nginx部署。在此基础上，增加环境变量动态控制系统模块部署。
2. 增加独立大屏部署，通过环境变量参数控制，独立部署大屏，方便快速部署。

### 技术方案

1. 升级3.0系统所有技术栈架构，支持动态配置主题与布局，一件换肤与多语言切换不刷新系统（常规理解，我们还是会去手动刷新一下）
2. 支持模块化定制开发，支持动态路由与非标项目快速定制。
3. 支持动态变更logo，无需再次打包（这个跟部署形式有关，根据项目实际场景来选择）
4. 统一全站公共组件技术栈，开发公司级组件库（gbeata）,支持所有系统一键切换升级（设计中），为后续系统统一做铺垫。
5. 支持tailwindcss 与 css in js，支持响应式，支持pad与移动端（响应式设计细节放后）

## 性能优化对比

针对3.0 与 4.0， 我们使用相同维度与环境进行性能对比，拿监控页面为例，我们将以4个维度进行对比。

首次内容绘制（FCP, First Contentful Paint）：页面的第一部分内容（例如文本、图片）在屏幕上显示的时间。

最大内容绘制（LCP, Largest Contentful Paint）：页面的最大内容块完全渲染的时间，通常是页面的主要内容。

累积布局偏移（CLS, Cumulative Layout Shift）：页面元素在加载过程中发生的视觉稳定性变化（布局偏移）总量。

总阻塞时间（TBT, Total Blocking Time）：首次内容绘制和交互时间之间，由于主线程阻塞导致的时间。

> 3.0

![alt text](image-3.png)

> 4.0

![alt text](image-2.png)

<!-- 生成lighthouse对比 -->

| FCP       |    LCP    |        TBT |      CLS |
| :-------- | :-------: | ---------: | -------: |
| 19.1 秒   |  38.7 秒  | 4,060 毫秒 |  28.6 秒 |
| 6.7 秒    |  13.6 秒  | 1,400 毫秒 |  10.6 秒 |
| 优化 300% | 优化 284% |   优化290% | 优化269% |

当然我们还有很多可以优化的空间：
![alt text](image-4.png)

## 我们还做了什么

1. 新增四向车控制页面，重写、重构控制页面。
2. 重构监控页面交互（参考高德地图）
3. 重新设计任务模块交互
4. 重新设计车辆状态模块交互

## 使用

> \[!IMPORTANT]\
> 代码中包含gbeata组件库，如果不想使用到package/gbeata组件库源码，可直接从npm包中安装。

```bash
git clone git@github.com:anyone-yuren/react-antd-admin-pnpm.git

pnpm bootstrap

pnpm dev --filter gbeata-admin
```

也可以直接使用pnpm dev，但这样就会启动项目中所有包含dev命令的包项目。

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## 分支管理

发布组件库分支： `main`

预发布分支： `release-admin`

开发分支： `fature-admin`

<div align="right">

[![][back-to-top]](#readme-top)

</div>

</div>

<!-- LINK GROUP -->

[back-to-top]: https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square
[banner]: https://github.com/anyone-yuren/multiway/blob/master/iShot_2024-01-05_17.05.52.gif?raw=true
[bun-link]: https://bun.sh
[bun-shield]: https://img.shields.io/badge/-speedup%20with%20bun-black?logo=bun&style=for-the-badge
[codespaces-link]: https://codespaces.new/anyone-yuren/react-antd-admin-pnpm
[codespaces-shield]: https://github.com/codespaces/badge.svg
[contributors-contrib]: https://contrib.rocks/image?repo=anyone-yuren/react-antd-admin-pnpm
[contributors-link]: https://github.com/anyone-yuren/react-antd-admin-pnpm/graphs/contributors
[discord-link]: https://discord.gg/AYFPHvv2jT
[discord-shield]: https://img.shields.io/discord/1127171173982154893?color=5865F2&label=discord&labelColor=black&logo=discord&logoColor=white&style=flat-square
[fossa-license-link]: https://app.fossa.com/projects/git%2Bgithub.com%2Fanyone-yuren%2Freact-antd-admin-pnpm
[fossa-license-shield]: https://app.fossa.com/api/projects/git%2Bgithub.com%2Fanyone-yuren%2Freact-antd-admin-pnpm.svg?type=large
[github-action-release-link]: https://github.com/anyone-yuren/react-antd-admin-pnpm/actions/workflows/blank.yml
[github-action-release-shield]: https://img.shields.io/github/actions/workflow/status/anyone-yuren/react-antd-admin-pnpm/release.yml?label=release&labelColor=black&logo=githubactions&logoColor=white&style=flat-square
[github-action-test-link]: https://github.com/actions/workflows/anyone-yuren/react-antd-admin-pnpm/test.yml
[github-action-test-shield]: https://img.shields.io/github/actions/workflow/status/anyone-yuren/react-antd-admin-pnpm/test.yml?label=test&labelColor=black&logo=githubactions&logoColor=white&style=flat-square
[github-contributors-link]: https://github.com/anyone-yuren/react-antd-admin-pnpm/graphs/contributors
[github-contributors-shield]: https://img.shields.io/github/contributors/anyone-yuren/react-antd-admin-pnpm?color=c4f042&labelColor=black&style=flat-square
[github-forks-link]: https://github.com/anyone-yuren/react-antd-admin-pnpm/network/members
[github-forks-shield]: https://img.shields.io/github/forks/anyone-yuren/react-antd-admin-pnpm?color=8ae8ff&labelColor=black&style=flat-square
[github-issues-link]: https://github.com/anyone-yuren/react-antd-admin-pnpm/issues
[github-issues-shield]: https://img.shields.io/github/issues/anyone-yuren/react-antd-admin-pnpm?color=ff80eb&labelColor=black&style=flat-square
[github-license-link]: https://github.com/anyone-yuren/react-antd-admin-pnpm/blob/master/LICENSE
[github-license-shield]: https://img.shields.io/github/license/anyone-yuren/react-antd-admin-pnpm?color=white&labelColor=black&style=flat-square
[github-releasedate-link]: https://github.com/anyone-yuren/react-antd-admin-pnpm/releases
[github-releasedate-shield]: https://img.shields.io/github/release-date/anyone-yuren/react-antd-admin-pnpm?labelColor=black&style=flat-square
[github-stars-link]: https://github.com/anyone-yuren/react-antd-admin-pnpm/network/stargazers
[github-stars-shield]: https://img.shields.io/github/stars/anyone-yuren/react-antd-admin-pnpm?color=ffcb47&labelColor=black&style=flat-square
[react-antd-admin-pnpm]: https://github.com/anyone-yuren/react-antd-admin-pnpm
[lobe-commit]: https://github.com/anyone-yuren/lobe-commit/tree/master/packages/lobe-commit
[lobe-i18n]: https://github.com/anyone-yuren/lobe-commit/tree/master/packages/lobe-i18n
[lobe-theme]: https://github.com/anyone-yuren/sd-webui-lobe-theme
[npm-downloads-link]: https://www.npmjs.com/package/gbeata
[npm-downloads-shield]: https://img.shields.io/npm/dt/@anyone-yuren/ui?labelColor=black&style=flat-square
[npm-release-link]: https://www.npmjs.com/package/gbeata
[npm-release-shield]: https://img.shields.io/npm/v/@anyone-yuren/ui?color=369eff&labelColor=black&logo=npm&logoColor=white&style=flat-square
[pr-welcome-link]: https://github.com/anyone-yuren/react-antd-admin-pnpm/pulls
[pr-welcome-shield]: https://img.shields.io/badge/🤯_pr_welcome-%E2%86%92-ffcb47?labelColor=black&style=for-the-badge
[profile-link]: https://github.com/anyone-yuren
