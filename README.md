# 小小英语 · Kid’s Box 第1册配套练习

React + TypeScript + React Bits 制作的平板友好学习应用，包含 Web 版和 Capacitor 安卓版。

- 网页：https://scstc.github.io/kids-box-learning/
- 仓库：https://github.com/scstc/kids-box-learning

## 当前内容范围

这是配合《剑桥国际少儿英语 Kid’s Box》第二版第1册使用的学习工具，**不是已完成的整册教材电子版**。

- 12 个主题单元入口；119 个词语练习项、36 组原创情景句。
- 词语英式发音、慢速听读、拼读提示、听音选择、字母拼写、错词背包和设备内进度。
- 单独的「课本活动」入口，保留 Listen and point、Listen and repeat、Sing the song、Say the chant、Monty’s phonics、故事等活动类型。
- **仅 Unit 1 的12项活动标题、页码、课次和录音编号经过外研社官方6页样张核对。**其余单元及 CLIL、Values 等板块尚未核对，没有编造活动顺序。
- 原书的歌曲、故事、页面插图未随应用公开分发，也不会用合成语音冒充。家长可在活动页添加自己有权使用的页面照片和对应音频；文件保存在本设备 IndexedDB，不上传服务器或公开仓库。
- 原动物拼读小站仍可从 Unit 7 进入，原进度保留。

## 本地开发

```powershell
npm install
npm run dev
```

手机、平板与电脑在同一局域网时，可使用终端显示的 Network 地址访问。

```powershell
npm test
npm run build
npm run preview
```

## GitHub Pages

推送到 main 后，Deploy to GitHub Pages 工作流执行测试、构建并发布。Pages 的来源为 GitHub Actions；工作流使用 Pages 返回的 base_path，因此仓库改名后无需硬编码静态资源路径。

检查子目录构建：

```powershell
npm run build -- --base /kids-box-learning/
npm run preview -- --base /kids-box-learning/
```

## 安卓平板 APK

支持 Android 7.0 及以上和现代 Android System WebView，横竖屏均可。没有锁定屏幕方向。

```powershell
npm run android:apk
```

需要 Android SDK 36、Build Tools 36.0.0、JDK 21。Windows 构建脚本优先使用已有的 Scoop temurin21-jdk；也可通过 ANDROID_JAVA_HOME 指定 Android 构建使用的 JDK，不更改全局 Java。SDK 路径使用未跟踪的 android/local.properties 或环境变量 ANDROID_HOME。

安装文件生成在 downloads/kids-box-learning-debug.apk，是便于本机安装测试的 debug 签名包。GitHub Actions 的 Build Android APK 工作流也会构建并保留 APK artifact；它不是应用商店发布包。

安卓包中包含所有原创配套练习、字体、插画和本地词语/句子音频，可离线使用。家长手动添加的教材资源也保存在设备内。官方资源链接需要联网；Web 版尚未提供完整离线缓存。

## 内容与资源

- src/data/course.ts：主题配套词汇与原创句子，音节/拼读块与规则提示。
- src/data/bookActivities.ts：有来源记录的课本活动目录；新单元必须核对后添加。
- src/components/BookActivities.tsx：原书活动阅读与本机资源导入。
- scripts/download-course-audio.mjs：获取词语英式发音；少数 WAV 响应通过 ffmpeg 转为 MP3。
- scripts/render-sentence-audio.py：使用 edge-tts 的 en-GB-SoniaNeural 生成原创例句音频。

### 来源

- 外研社官方资源：https://kb.unischool.cn/
- 第1册 Unit 1 官方样张：https://cdn-web.unischool.cn/kb/mfzy/yzyyp/KB2XS1_U1_yz.pdf
- 第1册 Unit 1 官方音频包：https://cdn-web.unischool.cn/kb/mfzy/yzyyp/KB2XS1_U1_yp.zip
- 第二版单元目录：https://www.blinklearning.com/coursePlayer/curso2.php?idcurso=164001 （海外版本，只用于核对主题顺序，不作为中文版页码来源）
- React Bits 官方 AnimatedContent 和 ClickSpark：https://reactbits.dev/ ，源码 https://github.com/DavidHDev/react-bits
- Lucide 图标：https://lucide.dev/ （ISC）
- Nunito、DM Sans：Fontsource 本地字体（OFL）
- 词语录音：有道词典英式发音接口。对外商业发布前需确认音频授权或替换为已授权录音。
- 旧动物小站保留原美式音频，整册新增练习使用英式音频。

原教材的样张与音频链接仅作为官方资源入口。下载供开发核对的样张留在被 Git 忽略的 artifacts 目录，未放入公开构建产物。
