### 比较好用的iTunes Connect App

[![Youtube demo](http://i.imgur.com/RFN0RQ3.jpg)](http://v.youku.com/v_show/id_XMTQ3NDkzMDIwNA==.html "Youtube demo")

## 为什麽要开发一个新的App
![iTunes Connect from App Store](http://i.imgur.com/J488ghM.jpg)

[官方的iTunes Connect App](https://itunes.apple.com/tw/app/itunes-connect/id376771144?mt=8) 缺少了满多功能，例如不能编辑资料和二进位档、提交送审、查询被拒的原因。

而在手机上使用iTunes Connect更难用，有时候甚至不能用。比方说，不可能看到问题中心的讯息。

![iTunes Connect on mobile](http://i.imgur.com/ySWWQRO.jpg)

所以，我试着解决这个问题。

这个App使用[Spaceship](https://github.com/fastlane/spaceship)提供的iTunes Connect API。虽然这个App现在依然缺乏许多功能，但这只是个开始。

## 如何安装

下载或git clone这个专案，在Xcode打开 `iTunesConnect/ios/iTunesConnect.xcodeproj`，执行`Run`来安装到你的装置.

## 功能

- [x] 编辑App与版本资料，设定建置版本。
- [x] 查看萤幕截图和状态历史。
- [ ] 编辑分类、分级、价格。
- [ ] 拒绝、提交、发布App。
- [ ] 管理Testflight。

## Technical info
这个App使用[React Native](https://github.com/facebook/react-native)来开发。

对于React Native的开发者，为了让非React Native的开发者更容易安装，这个专案包含了Objective-C程式码，而不包含`node_modules`内的Javascript程式码。因此，如果你想要开发的话，删除`node_modules`资料夹，再执行`npm install`安装套件。

## Contributing

欢迎提交PR或issue。如果你喜欢的话，请Star，支持我继续开发这个App。
