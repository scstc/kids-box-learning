# 小小英语 · Kid’s Box 第1册配套练习

React + TypeScript + React Bits 制作的平板友好学习应用，包含 Web 版和 Capacitor 安卓版。

- 网页：https://scstc.github.io/kids-box-learning/
- 仓库：https://github.com/scstc/kids-box-learning

## 当前内容范围

这是配合《剑桥国际少儿英语 Kid’s Box》第二版第1册使用的学习工具，使用用户提供的电子书生成对应的原书图页，直接随应用加载。

- 12 个主题单元入口；119 个词语练习项、36 组原创情景句。
- 词语英式发音、慢速听读、拼读提示、听音选择、字母拼写、错词背包和设备内进度。
- 单独的「课本活动」入口，保留 Listen and point、Listen and repeat、Sing the song、Say the chant、Monty’s phonics、故事等活动类型。
- **12个单元、144项课本活动的标题、顺序和页码已按用户提供的93页电子书核对。**另外包含6个跨学科、6个价值观、3个阶段复习和语法参考入口，覆盖书上第4–95页。
- 原书第4–95页共92张图页已内置，各活动自动显示对应页；支持翻页、放大和点指。不需要家长再次导入PDF。原始扫描本的PDF第2页对应书上第4页，图页已按书上页码命名。
- Unit 1录音编号经过官方样张核对；其他单元的CD/音轨编号需查看原书图标，没有凭OCR推测。
- 电子书不含原版录音，歌曲、故事和歌谣音频仍需补充，不用合成语音冒充。家长可在折叠工具内添加音频或替换照片，这些新增文件保存在本设备IndexedDB。网页和APK的存储互相独立；清除浏览器或应用数据会删除本机添加的资源。
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

安卓包中包含所有原书图页、原创配套练习、字体、插画和本地词语/句子音频，可离线使用。家长手动添加的音频也保存在设备内；本次电子书不含原版录音。官方资源链接需要联网；Web版尚未提供完整离线缓存。APK已构建，尚未在实体平板安装验证。

## 内容与资源

- src/data/course.ts：主题配套词汇与原创句子，音节/拼读块与规则提示。
- src/data/bookActivities.ts：有来源记录的课本活动目录；新单元必须核对后添加。
- src/components/BookActivities.tsx：原书活动、陪练提示与本机音频添加。
- src/components/BookPageReader.tsx、public/book-pages/：按书上页码加载已内置的原书图页。
- src/components/BookLibrary.tsx：跨学科、价值观、阶段复习和语法参考。
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

原始PDF和OCR中间文件留在本机。根据用户提供的电子书处理后的正文图页放在public/book-pages，随网页与APK打包。官方样张与音频链接保留为补充资源入口。
