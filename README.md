# 小小英语 · Kid’s Box 第1册配套练习

React + TypeScript + React Bits 制作的平板友好学习应用，包含 Web 版和 Capacitor 安卓版。

- 网页：https://scstc.github.io/kids-box-learning/
- 仓库：https://github.com/scstc/kids-box-learning

## 当前内容范围

这是配合《剑桥国际少儿英语 Kid’s Box》第二版第1册使用的学习工具，使用用户提供的电子书生成对应的原书图页，直接随应用加载。

- 12 个主题单元入口；119 个词语练习项、36 组原创情景句。
- 词语英式发音、慢速听读、拼读提示、听音选择、字母拼写、错词背包和设备内进度。
- 首页书本使用PDF原封面，12个单元卡片、单元标题和足迹使用对应原书场景。108个词语练习项使用原版闪卡或PDF裁图，词语大图、小卡片、听音选择、拼写提示、错词背包和旧动物小站共用原图。大小、长短使用原版物品对比并标出当前对象。其余11个补充词暂用中文释义，不用不相关图画或英文答案代替。图片来源、书页与裁图坐标记录在 `src/data/originalArt.ts`。
- 词语页接入React Bits官方TechText：0.85秒正确字母逐个入场，点击有轮廓和轻微弹跳并播放整词；原版图片支持SpotlightCard触控聚光，当前发音的拼读块同步高亮，学习确认/下一题按钮使用StarBorder。提供「再看一次」和可记忆的动态开关，尊重系统「减少动态效果」。动画不随机替换字母、不自动拖动字母，不影响音标与读音。
- 「听音找朋友」「字母拼拼乐」答对后出现星星彩纸和「答对啦」，下一题清除特效；答错时保持重试提示。特效不拦截点击、不添加声音，关闭动态或系统减少动态时保留静态正确反馈。
- 全部词卡显示英式IPA音标。拼读块可逐块点击，播放词内实际声音；静音e只提示不发音，不读成字母名。130种分块合成示范音频随应用打包，不依赖设备TTS或在线服务。
- 分块后有「连起来读」按钮，依次播放有声分块，再播放完整单词。可随时停止；切换词语或点击其他声音会取消连读。
- 字母拼拼乐提供「字母提示」开关：开启时使用字母按钮，关闭后隐藏字母库和长度格子，使用完整A–Z应用内键盘自行拼写，不唤起系统输入法或显示联想候选词；也支持实体键盘。设置保存在本设备；忽略大小写、空格和连字符，保留拼错重试与错词复习。
- 12个单元主要词语页的全部标签已配置点读，另包含数字、颜色、形容词、身体部位、栖息地和复习等页面的词语区域。第34页宠物、第48页野生动物以及第7页颜色还支持点图片，播放配套英式词语/短语音频。
- 单独的「课本活动」入口，保留 Listen and point、Listen and repeat、Sing the song、Say the chant、Monty’s phonics、故事等活动类型。
- **12个单元、144项课本活动的标题、顺序和页码已按用户提供的93页电子书核对。**另外包含6个跨学科、6个价值观、3个阶段复习和语法参考入口，覆盖书上第4–95页。
- 原书第4–95页共92张图页已内置，各活动自动显示对应页；支持翻页、放大和点指。不需要家长再次导入PDF。原始扫描本的PDF第2页对应书上第4页，图页已按书上页码命名。
- 全屏「课本点读」只显示原书正文、两侧翻页按钮和一个小退出按钮，自动按屏幕完整显示书页。书页 CD 图标、词语仍可点读，播放时不显示额外播放器，并记住阅读位置。普通课本活动页保留页码、缩放和录音控制；视频和闪卡从单元的「视频与闪卡」进入。
- 按原书人工核对全部144处CD1–4标记，其中138处已匹配用户提供的原版录音（优先按学生用书页码/活动号匹配，再按CD音轨匹配）。歌曲、歌谣、故事及CLIL、Values、Review使用相应原版录音，明确标示未提供的6处音轨。
- 244段原始音频完整内置在 `public/音频/`。练习册、教师配套及额外CD音轨保留在「视频与闪卡 → 配套音频」中，可按单元查看或切换全册音频列表。
- 47个原版视频和95张原版闪卡已按单元接入。视频包含12组歌曲、伴奏、故事和11个拓展活动，使用H.264/AAC、保留720×480和原显示比例，约410MB；项目目录为 `public/视频/`，NAS源目录 `视频(1)` 保持原样。闪卡位于 `public/闪卡/`，点击可听配套词典英式发音。
- 家长仍可在折叠工具内补充音频或替换照片，这些新增文件保存在本设备IndexedDB。网页和APK的存储互相独立；清除浏览器或应用数据会删除本机添加的资源。原书录音、视频与单词发音播放互斥，翻页、切换资源或退出课本时停止播放。
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

安卓包中包含所有原书正文图页、原版音频/视频/闪卡、原创配套练习、字体、插画和词语/句子音频，可离线使用。家长手动添加的音频也保存在设备内。官方资源链接需要联网；Web版尚未提供完整离线缓存。更新安装使用 `adb -s <设备序列号> install -r downloads/kids-box-learning-debug.apk`，保留设备内学习进度。

### 已知资源缺口

用户提供的下载目录已经全部完成，以下文件未包含在该批资源中；对应点读位置会显示缺少音轨，未用其他录音替代：

| 书页 / 活动 | 音轨 |
| --- | --- |
| 25 / 3（Unit 4） | CD2 / 5 |
| 50 / 5（Unit 7） | CD3 / 7 |
| 85 / 3（Unit 12） | CD4 / 38 |
| 17 / 4（Values） | CD1 / 35 |
| 76 / 1（CLIL） | CD4 / 18 |
| 91 / 4（Values） | CD4 / 52 |

闪卡编号073未包含在提供的文件中，其余95张全部收录。原始PDF、原始视频及处理/核验中间文件留在本机 `artifacts/`，不提交。

## 内容与资源

- src/data/course.ts：主题配套词汇与原创句子，音节/拼读块与规则提示。
- src/data/bookActivities.ts：有来源记录的课本活动目录；新单元必须核对后添加。
- src/components/BookActivities.tsx：原书活动、陪练提示与本机音频添加。
- src/components/BookPageReader.tsx、public/book-pages/：按书上页码加载已内置的原书图页。
- src/components/BookLibrary.tsx：跨学科、价值观、阶段复习和语法参考。
- src/data/bookAudio.ts、src/data/bookMedia.ts：原版音轨与页面点击区域、全部音频/视频/闪卡索引。
- src/data/originalArt.ts、public/book-art/：原书封面、单元场景与词语裁图及来源。95张闪卡插图与4张大小/长短对比图采用透明PNG，保留眼白、白衣服和白色物体，并处理椅背、车轮和卷尾的镂空；完整课本场景保留原背景。图片随APK离线打包，运行 `npm run art:transparent` 可从原始闪卡重新生成透明图。
- src/components/LearningWord.tsx、CorrectCelebration.tsx：单词互动、触控聚光与答对庆祝；useLearningMotion.ts管理设备内动态设置。
- src/components/FullscreenBook.tsx、src/components/BookMedia.tsx：全屏课本和单元原版资源。
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
- React Bits 官方：[TechText](https://reactbits.dev/text-animations/tech-text)、[SpotlightCard](https://reactbits.dev/components/spotlight-card)、[StarBorder](https://reactbits.dev/animations/star-border)、[AnimatedContent](https://reactbits.dev/animations/animated-content)、[ClickSpark](https://reactbits.dev/animations/click-spark)。新组件从官方TS/CSS registry获取，不增加动画依赖；许可证保存在 `src/components/reactbits/LICENSE.md`（MIT + Commons Clause）。另调研TrueFocus和CountUp，当前采用与读音同步的字块聚焦，保持其他字块清晰。
- Lucide 图标：https://lucide.dev/ （ISC）
- Nunito、DM Sans：Fontsource 本地字体（OFL）
- 词语录音：有道词典英式发音接口。对外商业发布前需确认音频授权或替换为已授权录音。
- 旧动物小站保留原美式音频，整册新增练习使用英式音频。

原始PDF和OCR中间文件留在本机。根据用户提供的电子书处理后的正文图页放在public/book-pages，随网页与APK打包。官方样张与音频链接保留为补充资源入口。
