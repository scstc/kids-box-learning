# Kids Box · Kid’s Box 第1册配套练习

React + TypeScript + React Bits 制作的全英文、平板友好学习应用，包含 Web 版和 Capacitor 安卓版。应用显示名称统一为 **Kids Box**。

- 网页：https://scstc.github.io/kids-box-learning/
- 仓库：https://github.com/scstc/kids-box-learning

## 当前内容范围

这是配合《剑桥国际少儿英语 Kid’s Box》第二版第1册使用的学习工具，使用用户提供的电子书生成对应的原书图页，直接随应用加载。

- 26.4.3起采用Ocean方向的暖白/蓝色主题，杏橙色奖励点缀。全站界面、家长指南、拼读提示、错误与更新提示均为英文；学习界面移除中文释义及翻译开关。
- 首页书库包含Book 1–6：Book 1可进入现有课程，Book 2–6明确显示Coming soon且不可进入空课程。
- 新增React Bits官方CountUp进度数字、GlareHover书册光泽（触控点击及键盘焦点可触发）、ShinyText正确反馈，遵守动态开关及系统减少动态设置。

- 12 个主题单元入口；204 个词语/词组练习项、36 组原创情景句。词表对齐原书单词标签、闪卡、自然拼读目标和活动词汇栏，来源页码见`src/data/unitVocabulary.ts`；保留原119项的ID和学习足迹。
- 独立Starter栏目，副标题Alphabet & Sounds：A–Z大小写、英式字母名，以及传统英式44音的短元音、长元音、双元音和辅音。字母名、单音和例词均支持离线点击发音。
- 词语英式发音、慢速听读、拼读提示、听音选择、字母拼写、错词背包和设备内进度。
- 首页书本使用PDF原封面并保持原比例，12个单元卡片、单元标题和足迹使用对应原书场景。190个词语练习项使用原版闪卡或PDF裁图，词语大图、小卡片、听音选择、拼写提示和错词背包共用原图。单复数使用不同数量的原书物体图；听音题避免同一题重复图片。其余14项使用图标和简短英文语境提示，不直接显示拼写答案。图片来源、书页与裁图坐标记录在 `src/data/originalArt.ts`，补充图可通过`node scripts/expand-vocabulary-art.mjs`重建。
- 词语页接入React Bits官方TechText：0.85秒正确字母逐个入场，点击有轮廓和轻微弹跳并播放整词；原版图片支持SpotlightCard触控聚光，当前发音的拼读块同步高亮，学习确认/下一题按钮使用StarBorder。提供「再看一次」和可记忆的动态开关，尊重系统「减少动态效果」。动画不随机替换字母、不自动拖动字母，不影响音标与读音。
- 「听音找朋友」「字母拼拼乐」答对后出现星星彩纸和「答对啦」，下一题清除特效；答错时保持重试提示。特效不拦截点击、不添加声音，关闭动态或系统减少动态时保留静态正确反馈。
- 全部词卡显示英式IPA音标。拼读块可逐块点击，播放词内实际声音；静音e只提示不发音，不读成字母名。分块、字母名与音标合成示范音频随应用打包，不依赖设备TTS或在线服务。
- 分块后有「连起来读」按钮，依次播放有声分块，再播放完整单词。可随时停止；切换词语或点击其他声音会取消连读。
- 字母拼拼乐提供「字母提示」开关：开启时使用字母按钮，关闭后隐藏字母库和长度格子，使用完整A–Z应用内键盘自行拼写，不唤起系统输入法或显示联想候选词；也支持实体键盘。设置保存在本设备；忽略大小写、空格和连字符，保留拼错重试与错词复习。
- 12个单元主要词语页的全部标签已配置点读，另包含数字、颜色、形容词、身体部位、栖息地和复习等页面的词语区域。第34页宠物、第48页野生动物以及第7页颜色还支持点图片，播放配套英式词语/短语音频。
- 单独的「课本活动」入口，保留 Listen and point、Listen and repeat、Sing the song、Say the chant、Monty’s phonics、故事等活动类型。
- **12个单元、144项课本活动的标题、顺序和页码已按用户提供的93页电子书核对。**另外包含6个跨学科、6个价值观、3个阶段复习和语法参考入口，覆盖书上第4–95页。
- 原书第4–95页共92张图页已内置，各活动自动显示对应页；支持翻页、放大和点指。不需要家长再次导入PDF。原始扫描本的PDF第2页对应书上第4页，图页已按书上页码命名。
- 全屏课本的页码按钮展开触控滑条：拖动时预览页数，松手再跳转，不唤起数字键盘；也可点击滑条选页。保留两侧翻页、单元选择和阅读位置记忆。
- 26.4.2起使用用户重新提供的无水印 `01.pdf`：替换全部92张正文图页、封面、12张单元场景和21张PDF词语裁图；保留1259×1600点读坐标系，并重新生成含PDF铅笔裁图的长短对比卡。`public/book-source.json`记录源文件SHA-256、页数和尺寸；原始PDF仅留在本机artifacts。
- 全屏「课本点读」使用统一的顶部工具栏，保留单元选择、页码跳转和退出，两侧可以翻页，自动按屏幕完整显示书页。CD录音可在顶部选择0.5×、0.75×、1×、1.25×、1.5×速度，启用保持音调；播放中变速不从头开始，暂停时变速保持暂停，换音轨、翻页和重新打开时保留选择。播放时显示一个小的暂停/继续按钮，重复点同一CD图标也可暂停或从原位置继续，不展开原生播放器。跳页、切换单元和退出会停止播放，并记住阅读位置。
- 92个书页共760个文字/图片点读区域，包括12个单元的Phonics单词和完整例句、整册35页Functions/Grammar/Vocabulary页脚、活动标题、问答气泡和语法参考。第12页Who's that?、That's Meera.、She's eight.，第13页How are you? / I'm fine, thank you.，第17页Great! / Come on! / Let's play. / OK.均可直接朗读。多词短语及跨行对白保持完整含义；所有点读内容有本地发音，补充发音不会冒充缺少的原版CD录音。
- 13页课本场景支持点问题、再点人物或图片听回答：P8姓名/年龄、P14人物、P22物品、P28纠正描述、P38猜动物、P44物品问答、P51动物动作、P52身体部位、P58猜衣着、P68能力、P74动作、P82猜动作、P88喜好。答案对应所选图片；猜错轻摇提示、猜对星星彩屑，动态开关和系统减少动态设置均生效。不会录音或判断孩子发音。
- 244段原版音频与47个视频已用Whisper large-v3-turbo在电脑上识别英文字幕。字幕采用手机26px、平板28–40px的加粗大字，支持换行。播放时每50毫秒采样进度并高亮当前词，句子提前120毫秒显示、短停顿保留300毫秒，暂停或翻页后隐藏；点击文字时直接显示对应英文。关闭了会误删短对话和歌声的VAD过滤，重新连续识别，保留有文本但缺少逐词时间的段落。字幕JSON随APK离线打包，识别模型不装到平板。自动字幕仍可能在歌曲、专名或自然拼读短音上误识别；纯伴奏视频不生成猜测的歌词字幕。家长自行导入的新音频暂没有自动字幕。
- 按原书人工核对全部144处CD1–4标记，其中139处已匹配用户提供的原版录音。结合MP3内嵌音轨标签、录音开头报读与书页匹配，不仅依据文件名；`U10_pb_p75_12.mp3`实际为CD4第18轨、P76活动1，P75活动12使用CD4第17轨。歌曲、歌谣、故事及CLIL、Values、Review使用相应原版录音，明确标示未提供的5处音轨。
- 244段原始音频完整内置在 `public/音频/`。练习册、教师配套及额外CD音轨保留在「视频与闪卡 → 配套音频」中，可按单元查看或切换全册音频列表。
- 47个原版视频和95张原版闪卡已按单元接入。视频包含12组歌曲、伴奏、故事和11个拓展活动，使用H.264/AAC、保留720×480和原显示比例，约410MB；项目目录为 `public/视频/`，NAS源目录 `视频(1)` 保持原样。闪卡位于 `public/闪卡/`，点击可听配套词典英式发音。
- 家长仍可在折叠工具内补充音频或替换照片，这些新增文件保存在本设备IndexedDB。网页和APK的存储互相独立；清除浏览器或应用数据会删除本机添加的资源。原书录音、视频与单词发音播放互斥，翻页、切换资源或退出课本时停止播放。
- 原动物拼读小站仍可从 Unit 7 进入，原进度保留。

## 本地开发

React Bits MCP已按[官网说明](https://reactbits.dev/get-started/mcp)配置：`components.json`声明`@react-bits`注册表，项目级`.codex/config.toml`启动shadcn MCP。项目需受信任；重新打开Codex会话后加载。已验证STDIO握手、工具列表及React Bits组件查询。此连接只用于开发，不随网页或APK运行，也不要求学习者登录。项目仍使用普通CSS，添加组件时选择TS-CSS版本。

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

安装文件生成在 downloads/kids-box-learning-debug.apk，供本机调试。正式版运行 `npm run android:release`，输出带版本的 APK、SHA-256校验文件和 `update.json`；GitHub Actions 使用相同的固定密钥构建正式版。

安卓包中包含所有原书正文图页、原版音频/视频/闪卡、原创配套练习、字体、插画和词语/句子音频，可离线使用。家长手动添加的音频也保存在设备内。官方资源链接需要联网；Web版尚未提供完整离线缓存。更新安装使用 `adb -s <设备序列号> install -r downloads/kids-box-learning-debug.apk`，保留设备内学习进度。

### 在线升级与发布

在安卓应用的「家长指南 → 应用更新」手动检查版本，下载完成后点击安装，在安卓系统页面确认更新。网络中断由系统下载器等待恢复，关闭应用后仍可下载，重开可继续查看进度。应用先校验大小、SHA-256、包名、版本和签名；覆盖安装保留进度。首次安装本功能前的旧版，需要先通过ADB或手动安装更新。网页版提供GitHub Releases下载入口。

版本唯一来源为 `app-version.json`，采用「年份后两位.季度.本季度第几次发布」，例如 `26.4.1`。按中国时区计算季度，同季递增，跨季从1开始；内部versionCode随发布单调增加。

```powershell
npm run version:release
# 核对 app-version.json、更新 releases/notes.md，提交并推送 main 后：
git tag v26.4.1
git push origin v26.4.1
```

标签必须与版本文件一致。Android工作流完成测试和签名构建后创建GitHub正式Release，上传APK、`.apk.sha256`和`update.json`后再设为latest。更新优先读取GitHub API，连接失败时读取Release中的同一份更新清单。Pages继续随main推送更新。

本机使用未跟踪的 `android/kids-box.keystore`，CI使用仓库Secret `ANDROID_SIGNING_KEYSTORE`（keystore的base64）。沿用原安装包密钥以支持覆盖更新；密钥不得提交，需自行备份。可用 `KIDSBOX_KEYSTORE`、`KIDSBOX_STORE_PASSWORD`、`KIDSBOX_KEY_ALIAS`、`KIDSBOX_KEY_PASSWORD`覆盖本机构建配置；签名缺失时CI失败，不生成另一把密钥。

### 已知资源缺口

用户提供的下载目录已经全部完成，以下文件未包含在该批资源中；对应点读位置会显示缺少音轨，未用其他录音替代：

| 书页 / 活动 | 音轨 |
| --- | --- |
| 25 / 3（Unit 4） | CD2 / 5 |
| 50 / 5（Unit 7） | CD3 / 7 |
| 85 / 3（Unit 12） | CD4 / 38 |
| 17 / 4（Values） | CD1 / 35 |
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
- src/data/bookReadingRegions.ts、bookFooterRegions.ts、bookPrintedText.ts：对照扫描本补充的对白与35页页脚点读位置；`scripts/build-book-reading.mjs` 从本机OCR资料生成活动标题，页脚以人工核对的词组边界为准。
- scripts/import-book-pdf.mjs：使用Poppler读取已核对的93页无水印扫描本，按现有坐标系重新生成正文图页和PDF配图。运行 `node scripts/import-book-pdf.mjs <01.pdf路径>` 后，再运行 `npm run art:transparent` 刷新含PDF裁图的对比卡；不同版式应先重新核对热点，脚本会拒绝页数或原图尺寸不一致的文件。
- src/data/bookScenes.ts、src/components/BookSceneActivity.tsx：13处场景的问答、图片目标和反馈；新增点读/问答后运行 `node scripts/prepare-reading-audio.mjs`，再用 `scripts/render-sentence-audio.py artifacts/reading-audio-missing.json`生成缺少的离线语音。
- src/components/AppUpdate.tsx、android/.../AppUpdaterPlugin.java：安卓原生版本检查、后台下载、完整性与签名校验及系统安装。
- src/data/bookSubtitles.ts、public/subtitles/、src/components/MediaSubtitles.tsx：离线英文字幕索引、时间轴与播放器同步。重新识别：用项目uv环境安装 `scripts/speech-requirements.txt`，运行 `node scripts/prepare-book-speech.mjs`，再运行 `.venv/Scripts/python.exe scripts/transcribe-book-audio.py`（默认使用本机NVIDIA GPU；CPU可加 `--device cpu`）。
- src/components/LearningWord.tsx、CorrectCelebration.tsx：单词互动、触控聚光与答对庆祝；useLearningMotion.ts管理设备内动态设置。
- src/components/FullscreenBook.tsx、src/components/BookMedia.tsx：全屏课本和单元原版资源。
- scripts/download-course-audio.mjs：保留课本点读的词典英式录音；少数 WAV 响应通过 ffmpeg 转为 MP3。单词练习优先播放下方同声线合成资源。
- scripts/render-sentence-audio.py：使用 edge-tts 的 en-GB-SoniaNeural 生成原创例句音频。
- src/data/pronunciations.ts：已核对的英式IPA和逐块发音；双写字母只发一次音，静音字母不生成声音。
- src/data/practiceAudio.ts、public/word-audio/、public/phonics-audio/：Word explorer、拼读、连读、慢速和Starter例词统一使用Kokoro英式女声bf_emma。两类音频都直接输入已核对IPA，分块读实际音素，整词保持词内重音；慢速播放使用同一文件并保留音高。课本长句及原版CD不重新合成。
- scripts/render-phonics-audio.mjs、render-practice-audio.py：同声线离线资源制作工具。用 `uv pip install --python .venv/Scripts/python.exe -r scripts/phonics-requirements.txt` 安装构建依赖，再执行 `node scripts/render-phonics-audio.mjs`。首次下载固定版本模型和voice到ignored artifacts并核对SHA-256；模型、Python及推理库不进入网页或APK。`public/word-audio/manifest.json`记录voice、IPA和每个MP3哈希；匹配才跳过，`--force`重建全部，旧eSpeak资源不会被误当作已生成的新音色。
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
- 单词与拼读合成示范：[Kokoro-82M](https://huggingface.co/hexgrad/Kokoro-82M)及[ONNX转换模型](https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX)（Apache-2.0），固定bf_emma英式女声，只在制作离线MP3时运行。
- 旧动物小站保留原美式音频，整册新增练习使用英式音频。

原始PDF和OCR中间文件留在本机。根据用户提供的电子书处理后的正文图页放在public/book-pages，随网页与APK打包。官方样张与音频链接保留为补充资源入口。
