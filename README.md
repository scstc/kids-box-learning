# Little Safari · 声音里的动物园

面向孩子的动物英文学习网页，使用 React 19、TypeScript、Vite 和 React Bits。

## 启动

```powershell
npm install
npm run dev
```

打开终端显示的本地地址。手机与电脑在同一局域网时，可以通过终端显示的 Network 地址访问。

```powershell
npm test
npm run build
npm run preview
```

## 学习流程

- **听一听**：动物插画、完整美式发音和保持音高的慢速播放。
- **拆开读**：音节与拼写分块、音标、重音和拼读规则。点声音块查看提示，使用「慢速听整词」连起来读。
- **玩一玩**：7 道听音找动物题，答错可重试；完成后展示学习护照。
- **我的护照**：收集动物足迹，点击已认识的动物复习。

覆盖 giraffe、elephant、snake、hippo、crocodile、monkey、tiger。

这些单词并非全部属于初级规则拼读词。页面结合音节、常见拼读规律和整词听读，明确解释 giraffe、monkey 等例外。snake 展示的是声音块，本身只有一个音节。分块按钮显示发音提示，**不生成不准确的孤立音节语音**。

## 实现说明

- React Bits 官方 `AnimatedContent`（GSAP 进场）和 `ClickSpark`（星星点击反馈）位于 `src/components/reactbits/`，从官方 TS-CSS registry 获取；支持减少动态效果偏好。
- `src/data/animals.ts` 保存动物、声音分块和拼读提示。新增动物时同步更新 `AnimalArt.tsx` 插画与 `public/audio/` 发音。
- 学习进度保存在浏览器 localStorage，不使用账户、后端或麦克风；重置需要明确确认。
- 字体、插画和音频均随构建打包，不在运行时依赖第三方 CDN；没有 Service Worker，不支持离线首次访问或离线刷新。
- 适配桌面、平板和手机，支持键盘焦点和原生模态对话框。

## 素材来源

- React Bits：https://reactbits.dev/ ，源码：https://github.com/DavidHDev/react-bits
- 图标：Lucide React（ISC license）
- 字体：Nunito、DM Sans，使用 Fontsource 本地打包（SIL Open Font License）
- 整词发音：有道词典美式发音接口，`https://dict.youdao.com/dictvoice?audio=<word>&type=2`。当前用于原型学习演示；对外商业发布前需确认音频授权或替换为已授权录音。
- 动物与场景 SVG：为本项目编写的矢量插画。
