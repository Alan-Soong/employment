# Personal Homepage

这是一个基于纯 `HTML / CSS / JS` 的个人主页仓库，无需构建工具，可直接部署到 GitHub Pages。

当前版本在信息结构和学术主页版式上参考了仓库：

- [RayeRen/acad-homepage.github.io](https://github.com/RayeRen/acad-homepage.github.io)

本仓库并未直接迁移其 Jekyll 工程结构，而是在保留当前静态站点轻量部署方式的前提下，参考其“左侧作者信息栏 + 右侧正文内容”的组织形式进行了重构，同时尽量保留了原站点的背景氛围与视觉风格。

## 本地预览

直接双击 `index.html` 用浏览器打开，或使用 VS Code 插件 `Live Server` 进行热重载预览。

## 部署到 GitHub Pages

当前仓库为 `employment`，部署后地址为：

- `https://alan-soong.github.io/employment/`

常规推送流程：

```bash
git add .
git commit -m "feat: update homepage"
git push
```

若第一次关联远程：

```bash
git remote add origin https://github.com/Alan-Soong/employment.git
git push -u origin main
```

## 文件结构

```text
├── index.html          # 中文主页
├── en.html             # 英文主页
├── css/
│   ├── style.css       # 全站样式
│   ├── background.png  # 深色背景
│   ├── background2.png # 浅色背景
│   └── photo.png       # 头像
├── js/
│   └── main.js         # 主题切换、滚动高亮、动画等交互
├── tex/
│   └── main.tex        # LaTeX 简历源文件
└── README.md
```

## 功能特性

- 中英文双页面切换
- 亮色 / 暗色主题切换
- 响应式布局，适配桌面端与移动端
- 滚动进度条与章节导航高亮
- 保留原有背景图与装饰动效
- 纯静态站点，适合直接部署到 GitHub Pages
