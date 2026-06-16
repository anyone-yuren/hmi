# 🤖 HMI (Human-Machine Interface) Monorepo System

这是一个基于 **Monorepo** 架构构建的工业机器人/AGV（自动导引车）高科技人机交互系统（HMI）。项目集成实时数据流监控、二维/三维点云雷达渲染、多语言国际化管理以及高度可定制的中后台业务组件。

## 🏗️ 项目架构 (Project Architecture)

项目采用 [Turborepo](https://turbo.build/) 管理 Monorepo 状态，并使用 `pnpm` 作为包管理工具。

```text
hmi/
├── apps/
│   ├── deployer/          # 🚀 机器人现场部署端 HMI (React + Vite + Three.js)
│   └── customer/          # 👥 终端客户使用端 HMI (React + Vite)
├── packages/
│   ├── ui/                # 💎 纯原子 UI 组件库 (动画、微件、特效)
│   ├── gbeata/            # 📊 基于 Ant Design 深度定制的高级业务组件库 (表格、表单)
│   ├── locales/           # 🌐 国际化静态资产包 (支持 Excel 多语言双向转换脚本)
│   └── store/             # 🧠 基于 Zustand 的全局跨应用状态管理中心
├── internal/              # ⚙️ 内部工程化配置 (eslint-config, tailwind-config, ts-config)
└── script-locale/         # 🛠️ 自动化多语言翻译、同步与校验工具链
```

✨ 核心特性 (Key Features)
高性能三维点云渲染：在 apps/deployer 深度整合 Three.js 与 React Three Fiber，配合多线程 Web Worker，在低配车载平板上依然能流畅、高频渲染激光雷达安全区域（Safety Zones）与实时点云。

现代化技术栈：全量拥抱 React 18, TypeScript, Zustand 状态流, Tailwind CSS 以及 Framer Motion 动态微交互。

动态运行时配置 (Runtime Window Config)：支持局域网 WebSocket 终点、机器人 ID 的部署时动态挂载，实现“一次编译，现场到处运行”。

Monorepo 资产高复用：packages/ 共享机制有效隔离了业务逻辑与纯资产依赖，彻底规避跨应用代码复制。

🛠️ 开发环境配置 (Development Setup)

1. 前置要求
   Node.js: ^18.x 或更高版本 (项目推荐通过 .node-version 锁定环境)

PNPM: ^8.x 或更高版本

2. 安装依赖
   在项目根目录下执行以下命令锁版本安装：

Bash
pnpm install 3. 本地启动开发服务
使用 Turbo 缓存与并行处理能力，同时启动所有子应用及共享包的监控：

Bash
pnpm dev
如果你只想单独开发部署端应用：

Bash
pnpm --filter deployer dev 4. 项目打包 (Build)
Bash
pnpm build
🌐 国际化与翻译工作流 (Localization Workflow)
项目提供了健全的国际化工具链（位于 script-locale/），支持实施人员或翻译团队通过 Excel 直接管理语言包：

Excel 转 JSON：当翻译人员修改了 HMI多语言翻译.xlsx 后，运行以下命令自动更新 packages/locales 字典：

Bash
pnpm i18n:import
JSON 转 Excel：将代码中新抽离的 Key 导出为 Excel 交付给翻译团队：

Bash
pnpm i18n:export
👮 代码提交规范 (Git Commit Guidelines)
本项目引入了 Commitlint 与 commitizen 强制约束提交规范。在提交代码时，请使用以下命令代替传统的 git commit：

Bash
pnpm commit
格式遵循：<type>(<scope>): <subject> (例如: feat(deployer): 优化安全区域Canvas在高频点云下的渲染吞吐量)

---

### 💡 优化后的子应用目录描述（例如 `apps/deployer/README.md`）

如果现场实施人员或前端新进组同事只需要看 `deployer` 应用，可以在 `apps/deployer/` 目录下放置如下描述：

```markdown
# 🚀 HMI Deployer Application
```

这是机器人/AGV 现场部署及参数标定专用的受控 HMI 端应用。

## 📦 核心视图模块说明 (Core View Modules)

- **`/views/Safety`**：安全避障区域与 3D 点云可视化面板。数据通过高性能长连接传输，内置全屏监控与画布受控切换。
- **`/views/Hybrid`**：混合动力与激光 SLAM/反射板定位标定画布，支持现场建图与姿态（Pose）修正。
- **`/views/Vision`**：视觉相机（Vision Pick/Stock）货物料架、堆垛状态识别标定。
- **`/views/Diagnosis`**：设备核心健康度诊断、故障排查、历史日志高速检索。

## 🔩 实施部署说明 (Field Deployment)

为了避免在现场因为不同的车辆 IP 或局域网环境重复执行 `pnpm build` 打包，本项目采用**运行时动态注入配置**：

1. 打包产物输出后，在部署目录的 `dist/` 下会包含一个 `config.js` 文件。
2. 现场实施人员只需用文本编辑器修改该文件内的全局对象即可立即生效：
   ```javascript
   window.__HMI_CONFIG__ = {
     WS_URL: "ws://192.168.1.105:9090", // 对应车载主控 WebSocket 终点
     ROBOT_ID: "AGV-FORK-01",
   };
   ```

### 🔥 为什么这样修改？（修改背后的设计考量）

1. **突出项目壁垒和技术两点**：将你的 **Web Worker 处理高频点云**、**Three.js 避障渲染**、以及 **Zustand + Monorepo 资产管理** 放在 README 的开头，有助于任何阅读代码的人（包括技术主管、架构师）迅速get到项目含金量。
2. **明确规范开发命令**：提供了清晰的 `pnpm dev` 和 `--filter` 命令，避免新人由于不熟悉 Monorepo 架构导致起错服务。
3. **将运维部署、多语言脚本写进文档**：对于你的项目，`script-locale/`（多语言Excel转换）和现场环境配置是非常亮眼且实用的工程化设计，写进 README 能大幅提升项目的工业级规范感。
