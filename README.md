# 小小英语 · Kid’s Box 第1册配套练习

React + TypeScript + React Bits 制作的平板友好学习应用，包含 Web 版和 Capacitor 安卓版。

- 网页：https://scstc.github.io/kids-box-learning/
- 仓库：https://github.com/scstc/kids-box-learning

## 当前内容范围

这是配合《剑桥国际少儿英语 Kid’s Box》第二版第1册使用的学习工具，使用用户提供的电子书生成对应的原书图页，直接随应用加载。

- 12 个主题单元入口；119 个词语练习项、36 组原创情景句。
- 词语英式发音、慢速听读、拼读提示、听音选择、字母拼写、错词背包和设备内进度。
- 全部词卡显示英式IPA音标。拼读块可逐块点击，播放词内实际声音；静音e只提示不发音，不读成字母名。130种分块合成示范音频随应用打包，不依赖设备TTS或在线服务。
- 分块后有「连起来读」按钮，依次播放有声分块，再播放完整单词。可随时停止；切换词语或点击其他声音会取消连读。
- 字母拼拼乐提供「字母提示」开关：开启时使用字母按钮，关闭后隐藏字母库和长度格子，使用完整A–Z应用内键盘自行拼写，不唤起系统输入法或显示联想候选词；也支持实体键盘。设置保存在本设备；忽略大小写、空格和连字符，保留拼错重试与错词复习。
- 12个单元主要词语页的全部标签已配置点读，另包含数字、颜色、形容词、身体部位、栖息地和复习等页面的词语区域。第34页宠物、第48页野生动物以及第7页颜色还支持点图片。播放配套英式词语/短语音频；故事和歌曲原版整段录音仍待补充。没有配置点读的页面会显示说明。
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
- src/data/pronunciations.ts：与词典英式录音口音对应的IPA和逐块发音；双写字母只发一次音，静音字母不生成声音。
- scripts/render-phonics-audio.mjs：通过eSpeak NG英式音素输入生成分块合成示范，再转为本地MP3。仅为离线资源制作工具，不随应用运行。工具依赖安装方式见脚本开头。
- src/data/bookHotspots.ts：按原图坐标核对的点读区域，随图片缩放；原书活动播放器与单词/分块播放器互斥，防止声音叠加。

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
