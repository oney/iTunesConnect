### 比較好用的iTunes Connect App

[![Youtube demo](http://i.imgur.com/RFN0RQ3.jpg)](https://www.youtube.com/watch?v=1p3MoeznsAc "Youtube demo")

## 為什麼要開發一個新的App
![iTunes Connect from App Store](http://i.imgur.com/J488ghM.jpg)

[官方的iTunes Connect App](https://itunes.apple.com/tw/app/itunes-connect/id376771144?mt=8) 缺少了滿多功能，例如不能編輯資料和二進位檔、提交送審、查詢被拒的原因。

而在手機上使用iTunes Connect更難用，有時候甚至不能用。比方說，不可能看到問題中心的訊息。

![iTunes Connect on mobile](http://i.imgur.com/ySWWQRO.jpg)

所以，我試著解決這個問題。

這個App使用[Spaceship](https://github.com/fastlane/spaceship)提供的iTunes Connect API。雖然這個App現在依然缺乏許多功能，但這只是個開始。

## 如何安裝

下載或git clone這個專案，在Xcode打開 `iTunesConnect/ios/iTunesConnect.xcodeproj`，執行`Run`來安裝到你的裝置.

## 功能

- [x] 編輯App與版本資料，設定建置版本。
- [x] 查看螢幕截圖和狀態歷史。
- [ ] 編輯分類、分級、價格。
- [ ] 拒絕、提交、發布App。
- [ ] 管理Testflight。

## Technical info
這個App使用[React Native](https://github.com/facebook/react-native)來開發。

對於React Native的開發者，為了讓非React Native的開發者更容易安裝，這個專案包含了Objective-C程式碼，而不包含`node_modules`內的Javascript程式碼。因此，如果你想要開發的話，刪除`node_modules`資料夾，再執行`npm install`安裝套件。

## Contributing

歡迎提交PR或issue。如果你喜歡的話，請Star，支持我繼續開發這個App。
