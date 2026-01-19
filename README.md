# 德令哈智慧地图可视化平台 (dlh-map-project)

本项目是一个基于 **Vue 3** 和 **ECharts** 构建的高级地图可视化仪表盘系统，专为德令哈市的城市运营及综合管理设计。系统集成了地图交互、实时数据可视化和多维度的业务分析模块。

## 🌟 核心功能模块

-   **🏙️ 城市管理 (Urban)**: 展示城市基础设施、运行状态及宏观管理指标。
-   **🛡️ 公共安全 (Safe)**: 实时监控城市安全隐患，集成应急调度及安全指标可视化。
-   **🚩 党建服务 (Party)**: 数字化党建成果展示，包括基层组织分布及党建动态。
-   **❤️ 民生服务 (Livelihood)**: 聚焦社会保障、医疗教育等与居民生活息息相关的实时数据。
-   **🗺️ 智能地图交互**:
    -   深度集成地图引擎，支持图层精准控制。
    -   统一的 `mapStore` (Pinia) 状态管理，支持跨组件地图指令调度。
    -   内置拾取精度算法，支持地图要素的精确点击响应。

## 🛠️ 技术栈

-   **框架**: [Vue 3](https://vuejs.org/) (Composition API)
-   **构建工具**: [Vite](https://vitejs.dev/)
-   **状态管理**: [Pinia](https://pinia.vuejs.org/)
-   **可视化**: [ECharts 6](https://echarts.apache.org/)
-   **路由**: [Vue Router](https://router.vuejs.org/)
-   **通信**: 基于 `postMessage` 的地图引擎指令交互系统

## 📂 项目结构

```text
src/
├── components/     # 通用 UI 组件（标题栏、地图容器等）
├── views/          # 业务视图页面（城市、党建、安全、民生）
├── stores/         # Pinia 状态库（地图指令及全局状态）
├── utils/          # 工具类（图标库、通用计算函数）
├── router/         # 路由配置
└── assets/         # 静态资源
```

## 🚀 快速开始

### 1. 安装依赖
使用 npm 安装项目所需依赖：
```bash
npm install
```

### 2. 启动开发服务器
```bash
npm run dev
```

### 3. 项目打包
生成用于生产环境的静态文件：
```bash
npm run build
```

## 📝 开发规范
-   **地图指令**: 建议通过 `useMapStore().sendAction(action, config)` 统一发送。
-   **图层维护**: 利用 `mapStore` 的图层注册表进行生命周期管理，确保在离开视图时及时清除图层。

---
*本项目由 Antigravity 协助开发与维护。*
