# 个人素材放置区（仅本机使用，请勿分发）

把你自己下载或绘制的素材放在这个目录。主题插件在「鬼灭之刃」主题激活时会
自动探测并挂载到会话区右下角（静音循环视频优先，静态图片其次）：

## 支持的文件名（按优先级）

视频（MP4，静音循环播放）：
- `ambient-dark.mp4` — 深色主题（炭治郎·夜巡）
- `ambient-light.mp4` — 浅色主题（灶门·和纸）
- `ambient.mp4` — 两个主题通用

图片（PNG/JPG，静态水印）：
- `hero-dark.png` / `hero-dark.jpg` — 深色主题
- `hero-light.png` / `hero-light.jpg` — 浅色主题
- `hero.png` / `hero.jpg` — 通用

## 生效步骤

1. 文件放进本目录
2. 仓库根目录运行 `pnpm run build:web`（`public/` 会在 vite 构建时拷进 `dist/`）
3. 在 设置 → 通用 里切换一次主题（或刷新页面）即可看到

## 调整

- 水印大小/透明度/位置：`packages/client/ui-theme-kimetsu/src/client/media.ts`
  里的 `LAYER_STYLE`
- 静态图片也可以走纯 CSS 覆盖：见 `decorations.module.css` 底部注释

注意：请只放入你有权在本机个人使用的素材；此目录内容不应被分发。
