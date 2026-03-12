# Personal Homepage

Apple × GitHub 风格个人主页，基于纯 HTML / CSS / JS，无需构建工具。

## 本地预览

直接双击 `index.html` 用浏览器打开，或使用 VS Code 插件 **Live Server** 热重载预览。

## 替换头像

照片文件已在 `tex/照片白.jpg`。在 `index.html` 中找到以下注释块，取消注释即可：

```html
<!-- <img src="tex/照片白.jpg" alt="宋卓伦" class="avatar-photo" /> -->
```

同时删除紧跟的 `<div class="avatar-initials">SZL</div>` 行。

---

## 部署到 GitHub Pages

> 使用当前仓库 **`employment`**，部署后线上地址：
> **https://alan-soong.github.io/employment/**

### 推送步骤

```bash
# 若本地尚未关联远程（第一次）
git remote add origin https://github.com/Alan-Soong/employment.git

# 推送
git add .
git commit -m "feat: personal homepage"
git push -u origin main
```

> 若提示远程有未同步内容：先执行 `git pull origin main --allow-unrelated-histories` 再 push。

### GitHub Pages 设置（只需配置一次）

1. 进入仓库 **Settings → Pages**
2. Source 选择 `Deploy from a branch`
3. Branch 选 `main`，文件夹选 `/ (root)`
4. 保存，约 1 分钟后访问 `https://alan-soong.github.io/employment/` 即可

### 日常更新

```bash
git add .
git commit -m "update: ..."
git push
```

推送后 GitHub Pages 自动重新部署，通常 30~60 秒刷新。

---

## 文件结构

```
├── index.html          # 主页面
├── css/
│   └── style.css       # 全部样式（亮色/暗色双主题）
├── js/
│   └── main.js         # 交互逻辑（主题切换 / 滚动动画等）
├── tex/
│   ├── main.tex        # LaTeX 简历源文件
│   └── 照片白.jpg       # 证件照（可替换到页面头像）
└── README.md
```

## 功能特性

- **Apple × GitHub 双风格**：亮色/暗色主题一键切换
- **响应式布局**：PC / 平板 / 手机全适配
- **滚动动画**：IntersectionObserver 驱动的入场动效
- **导航高亮**：滚动时自动高亮当前章节
- **纯静态**：零依赖构建，CDN 引入 Font Awesome + Inter 字体

