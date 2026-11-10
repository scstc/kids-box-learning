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
- Starter的44个音标示范单独使用真人教学录音选段，来源为[Pronunciation Studio English IPA Chart](https://pronunciationstudio.com/English-IPA-chart/)，与A–Z字母名和词内拼读块分开存放在`public/ipa-audio`。`scripts/ipa-recordings.json`记录原图表按钮、对应例词、源MP3哈希和切分时间；`scripts/render-ipa-audio.py`只提取开头的单音，不带入后面的例词，也不重新生成已确认的整词和字母音频。图表采用传统44音符号，真人录音中的现代英式元音存在正常变体。
- 词语英式发音、慢速听读、拼读提示、听音选择、字母拼写、错词背包和设备内进度。
- 26.4.13 起支持本机多用户：输入姓名或选择已保存的用户，分别保存已学词汇、错词、课本活动、108道语法/游戏挑战和阅读页码；My progress显示当前用户汇总。首次创建用户接收原有进度，后续用户从零开始。不需要账号或联网，用户数据不跨设备同步。
- 全屏 Talking book 顶部新增 Write，使用手写笔、手指或鼠标书写；Pen/Eraser/Undo 支持书写、按笔画擦除和撤销。笔迹按用户＋书页保存至本机 IndexedDB，换页、重开和缩放后恢复；退出 Write 后笔迹仍显示并恢复点读。保存中/失败状态可见，失败时可 Retry；卸载应用、清除应用/浏览器数据会移除本地记录。
- 26.4.14 起，Write → Ink 可选紫/蓝/红/绿/黑/白六种颜色，以及 Fine/Medium/Bold 三档粗细；按用户记住选择，仅影响之后的新笔画，已有笔迹保留原样。橡皮擦显示跟随笔尖的图标与擦除范围圆圈，手指松开、取消操作或退出书写时隐藏，不会保存到课本笔迹中。
- 26.4.15 起可用 Record 录制屏幕和孩子的麦克风声音，不直接录入课本英语音轨；课本仍正常播放，戴耳机可减少扬声器声音被麦克风收进去。录制期间隐藏点击火花、触摸高亮和课本点击圆点。课程页与全屏课本均可开始/停止，For parents → Screen recording 按用户列出视频并支持打开/分享；换用户会先停止保存，清空学习记录保留视频。
- 26.4.16 起录制时显示小手指示点击位置，拖动时跟随手指/手写笔，松开后约0.75秒消失；仅在录制中显示。全屏课本和弹窗均支持，指示器不拦截点击或书写，不写入手写笔迹；边缘触摸自动翻转小手保持可见。网页录制时应选择 Kids Box 所在标签页或屏幕，才能把指示器一起录入视频。
- 26.4.17 起，For parents → Screen recording 中每段视频均有 Delete；确认后删除当前用户选中的视频文件及列表记录，Keep video 取消。网页删除本机 IndexedDB/待保存视频，安卓删除本应用创建的图库或应用内 MP4，并清理已丢失文件的残留条目。失败会提示并允许重试；其他用户、学习记录、手写笔迹及已经下载/分享的副本保持不变。
- 26.4.17 的账户选择页可选 Spider-Man、Iron Man 等六个本地超级英雄头像；旧用户保留进度并使用默认头像。头像来自 GitHub icons_plus 收录的 Icons8 Characters，账户页保留来源链接，具体文件与授权见 `public/learner-avatars/ATTRIBUTION.md`。全屏课本右上角显示当前用户头像和名字，窄屏控件分两行。
- 账户卡片可确认删除用户，依次清理该用户的本地视频、整册手写笔迹、进度和笔/点读偏好，最后移除账户。失败保留账户以便重试，但已完成的清理不会恢复；其他用户及共享课本资源保持不变。删除全部账户后，新用户不会重新继承旧版备份。
- 普通及全屏课本提供 Tap to read 开关，按用户记住。关闭时停止当前单词与 CD 播放，词语、图片、场景问答及 CD 区域均静音；翻页和手写仍可用，其他练习不受影响。清空学习进度保留开关，删除账户时才一起清理；存储失败会显示提示。
- 26.4.18 将全屏选页改为屏幕中央的模态弹框，保留滑动选页；关闭后焦点返回页码按钮。Write 在平板保留112px宽度、手机88px宽度并显示文字；Tap to read 简化成48px的喇叭按钮，开启显示普通喇叭，关闭显示带斜线的喇叭。按原书字形重新定位 P50 Grammar 的词组与身体部位，同时修正已确认的 P49、P56 页脚错位。
- 安卓录制使用系统 MediaProjection 与 MediaRecorder，每次开始需确认屏幕共享，并允许麦克风；退到后台、锁屏或撤销系统共享时自动结束。Android 10+ 保存 MP4 至 Movies/Kids Box，图库导出失败时保留应用内文件供打开/分享；Android 7–9 保存到应用文件夹。网页在支持 getDisplayMedia 的安全桌面浏览器中录制，视频保存于本机 IndexedDB，可下载 WebM/MP4；手机网页的屏幕共享支持取决于浏览器。录制不会上传视频，麦克风仅在手动开始后使用。
- 首页书本使用PDF原封面并保持原比例，12个单元卡片、单元标题和足迹使用对应原书场景。190个词语练习项使用原版闪卡或PDF裁图，词语大图、小卡片、听音选择、拼写提示和错词背包共用原图。单复数使用不同数量的原书物体图；听音题避免同一题重复图片。其余14项使用图标和简短英文语境提示，不直接显示拼写答案。图片来源、书页与裁图坐标记录在 `src/data/originalArt.ts`，补充图可通过`node scripts/expand-vocabulary-art.mjs`重建。
- 词语页接入React Bits官方TechText：0.85秒正确字母逐个入场，点击有轮廓和轻微弹跳并播放整词；原版图片支持SpotlightCard触控聚光，当前发音的拼读块同步高亮，学习确认/下一题按钮使用StarBorder。提供「再看一次」和可记忆的动态开关，尊重系统「减少动态效果」。动画不随机替换字母、不自动拖动字母，不影响音标与读音。
- 「听音找朋友」「字母拼拼乐」答对后出现星星彩纸和「答对啦」，下一题清除特效；答错时保持重试提示。特效不拦截点击、不添加声音，关闭动态或系统减少动态时保留静态正确反馈。
- 全部词卡显示英式IPA音标。拼读块可逐块点击；静音e只提示不发音，不读成字母名。181段整词与26个字母名使用与句子相同的Sonia英式自然女声；其余174段分块/音标使用eSpeak NG英式女声音素示范，音色与整词略有不同。381段练习音频均随应用离线打包，不依赖设备TTS或在线服务。
- 分块后有「连起来读」按钮，依次播放有声分块，再播放完整单词。可随时停止；切换词语或点击其他声音会取消连读。
- 字母拼拼乐提供「字母提示」开关：开启时使用字母按钮，关闭后隐藏字母库和长度格子，使用完整A–Z应用内键盘自行拼写，不唤起系统输入法或显示联想候选词；也支持实体键盘。设置保存在本设备；忽略大小写、空格和连字符，保留拼错重试与错词复习。
- 每个单元增加 Ask & answer：12个单元各3道固定句型问答选择题，共36题。姓名、年龄、颜色、位置、have got、can、进行时和喜好等句型均有覆盖，每题A/B/C只有一个合适回答。题目和三个选项各有独立语音按钮，试听不判题；答错可重试，答对有解释与庆祝，显示本轮结果。81条独立语音全部内置，复用62条已有资源、补齐19条Sonia英式例句语音。答对题目按用户保存，重做显示 Practised before；本轮首次答对统计保持独立。
- Check & play 集中提供三种新检查：Listen & place 听指令移动原书图片，检查物品和 on/under/next to 位置；Build a sentence 点击或触摸拖放词卡拼出完整回答，可撤销、移除和重试；Look & fix 先判断原书图片描述，错误描述必须进一步选出正确表达才过关。12单元每种各2题，共72个挑战，222条独立语音均有本地文件。拖放也可用点选与键盘完成；取消拖动或放到区域外不计错，试听不提交答案，显示本轮首次答对数量。单元菜单使用自适应网格，手机、平板及桌面均显示完整入口。
- 家长入口 For parents → Learning records → Clear learning records，以及 My progress 页，可打开清空确认。确认后仅清除当前用户的已学词汇、错词袋、课本活动、语法和游戏完成标记、旧动物小站进度及上次阅读页码，回到初始地图。手写笔迹、其他用户记录、拼写提示、动态效果、CD速度设置和自行添加的图片/音频保留；取消不清空，存储失败明确提示并允许重试。
- 12个单元主要词语页的全部标签已配置点读，另包含数字、颜色、形容词、身体部位、栖息地和复习等页面的词语区域。第34页宠物、第48页野生动物以及第7页颜色还支持点图片，播放配套英式词语/短语音频。
- 单独的「课本活动」入口，保留 Listen and point、Listen and repeat、Sing the song、Say the chant、Monty’s phonics、故事等活动类型。
- **12个单元、144项课本活动的标题、顺序和页码已按用户提供的93页电子书核对。**另外包含6个跨学科、6个价值观、3个阶段复习和语法参考入口，覆盖书上第4–95页。
- 原书第4–95页共92张图页已内置，各活动自动显示对应页；支持翻页、放大和点指。不需要家长再次导入PDF。原始扫描本的PDF第2页对应书上第4页，图页已按书上页码命名。
- 全屏课本的页码按钮展开触控滑条：拖动时预览页数，松手再跳转，不唤起数字键盘；也可点击滑条选页。保留两侧翻页、单元选择和阅读位置记忆。
- 点读目标根据相邻文字、图片和CD区域限制触摸面积的扩展，空白足够时扩大到44px，区域密集时优先保证原书上的每个目标不被旁边按钮遮挡。P34宠物头部/尾巴及P48红蛇、上方鳄鱼、猴子身体、老虎尾巴已核对补齐。
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

练习音频生成：先按`scripts/phonics-requirements.txt`安装Python构建依赖，并按`scripts/render-phonics-audio.mjs`顶部命令安装构建专用eSpeak NG，再运行`node scripts/render-phonics-audio.mjs`。整词/字母由纯英文文本生成，音素使用显式音素记号；不再用Kokoro直接合成短音标。生成时需要联网获取自然语音，运行应用时不需要。全部文件先在`artifacts/practice-audio/staged`生成并核对完整性，再写入public；来源、输入与哈希记录在`public/word-audio/manifest.json`。自动测试验证来源、覆盖和文件完整性，不能代替人工听辨发音。

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
- src/data/grammarQuestions.ts、src/components/GrammarPractice.tsx：各单元的固定句型问答选择题；问题与所有选项也由上述音频准备脚本收集，测试检查实际播放路径完整。
- src/data/checkActivities.ts、src/components/CheckPractice.tsx、ListenPlace.tsx、BuildSentence.tsx、FixPicture.tsx：三类检查的数据、共享进度反馈、触摸拖放和两阶段纠错；原书图片事实已实际核对。新增指令、词卡和纠正选项也由上述音频准备脚本收集。
- src/data/learningRecords.ts、src/hooks/useCourseProgress.ts：按确切的四类记录处理完整清空，保留明确的空主进度记录，避免旧动物进度再次迁入；不清理整个localStorage或资源IndexedDB。
- src/components/AppUpdate.tsx、android/.../AppUpdaterPlugin.java：安卓原生版本检查、后台下载、完整性与签名校验及系统安装。
- src/data/bookSubtitles.ts、public/subtitles/、src/components/MediaSubtitles.tsx：离线英文字幕索引、时间轴与播放器同步。重新识别：用项目uv环境安装 `scripts/speech-requirements.txt`，运行 `node scripts/prepare-book-speech.mjs`，再运行 `.venv/Scripts/python.exe scripts/transcribe-book-audio.py`（默认使用本机NVIDIA GPU；CPU可加 `--device cpu`）。
- src/components/LearningWord.tsx、CorrectCelebration.tsx：单词互动、触控聚光与答对庆祝；useLearningMotion.ts管理设备内动态设置。
- src/components/FullscreenBook.tsx、src/components/BookMedia.tsx：全屏课本和单元原版资源。
- scripts/download-course-audio.mjs：保留旧词典英式录音；少数 WAV 响应通过 ffmpeg 转为 MP3。实际单词播放优先使用上面核对的剑桥录音，再使用已有备用资源。
- scripts/render-sentence-audio.py：使用 edge-tts 的 en-GB-SoniaNeural 生成原创例句音频。
- src/data/pronunciations.ts：已核对的英式IPA和逐块发音；双写字母只发一次音，静音字母不生成声音。
- src/data/cambridgePronunciation.ts、public/cambridge-audio/：169个非人名词条使用剑桥逐音录音，其中149个有精确对应的英式整词录音；其余20个保留现有Sonia整词配音，界面标注Practice voice。47种逐音录音包含 /i/、/əl/、/ən/ 等辅助音，并不表示英语有47个基本音素。人名12项保留原音频和分块，原版CD及课本长句不重新合成。运行 `.venv/Scripts/python.exe -B scripts/download-cambridge-audio.py` 按已核对清单下载，解码检查全部通过后写入public；原始音频不裁切、不拼接、不转码，manifest记录来源URL、时长和SHA-256。
- src/data/practiceAudio.ts、public/word-audio/、public/phonics-audio/：保留Sonia英式整词备用录音和26个字母名；旧eSpeak分块文件仅供未改动的人名及旧资源兼容，普通词汇不再播放。备用生成清单独立于实际播放路径，避免生成工具覆盖剑桥原始录音。慢速播放使用同一文件并保留音高。
- src/components/Starter.tsx、public/ipa-audio/：44个音标使用已试听认可的Pronunciation Studio真人教学示范，例词按上面的词汇来源播放；字母名保持不变。`scripts/ipa-recordings.json`和本地manifest记录来源、教学音区间与哈希，`scripts/render-ipa-audio.py`可重建独立教学音示范。
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
- 新词汇整词及逐音录音：[Cambridge Dictionary](https://dictionary.cambridge.org/pronunciation/english/giraffe)（© Cambridge University Press）；44个独立音标教学示范：[Pronunciation Studio](https://pronunciationstudio.com/English-IPA-chart/)。已记录出处，未确认开放再分发许可，不将这些录音视为开源资源。
- 单词及字母名：[edge-tts](https://github.com/rany2/edge-tts)（LGPL-3.0），使用en-GB-SoniaNeural。拼读音素示范：[eSpeak NG](https://github.com/espeak-ng/espeak-ng)与[Emscripten构建](https://github.com/echogarden-project/espeak-ng-emscripten)（GPL-3.0），使用en+f3。工具仅在制作离线MP3时运行，不随网页或APK分发。
- 旧动物小站与整册新增练习均优先使用相同的英式整词音频。

原始PDF和OCR中间文件留在本机。根据用户提供的电子书处理后的正文图页放在public/book-pages，随网页与APK打包。官方样张与音频链接保留为补充资源入口。
