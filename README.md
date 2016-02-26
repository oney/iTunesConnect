### iTunes Connect App that you actually want

[![Youtube demo](http://i.imgur.com/RFN0RQ3.jpg)](https://www.youtube.com/watch?v=1p3MoeznsAc "Video Title")

## Try it

Download [Exponent iOS App](https://itunes.com/apps/exponent), and enter `exp.host/@one/iTunesConnect` on the app.

![Exponent](http://i.imgur.com/MEtBVxH.jpg)

### [繁中](README-zh-Hant.md) | [簡中](README-zh-Hans.md)

## Why
![iTunes Connect from App Store](http://i.imgur.com/J488ghM.jpg)

[Official iTunes Connect App](https://itunes.apple.com/tw/app/itunes-connect/id376771144?mt=8) is lack of many features, e.g. edit app details and binaries, submit app and see rejected infos.

But how about iTunes Connect website on mobile? Hard to use, and sometimes we can't even use it. For example, there is no way to see issues of Resolution Center on it.

![iTunes Connect on mobile](http://i.imgur.com/ySWWQRO.jpg)

So, let us fix it.

This app leverages iTunes Connect API of [Spaceship](https://github.com/fastlane/spaceship) to get and update data for iTunes Connect. Although this app is also lack of features now, it is the beginning.

## How to run

Download or git clone this repository, open `iTunesConnect/ios/iTunesConnect.xcodeproj` project in Xcode, hit `Run` to install it on your device.

## Features

- [x] Edit apps and versions details, set builds.
- [x] See screenshots and status histories.
- [ ] Edit categories, ratings and prices.
- [ ] Reject, submit and release apps.
- [ ] Manage Testflight.

## Technical info

This app is built by [React Native](https://github.com/facebook/react-native).

For React Native developers, in order to make install app more easily for non-React-Native developers, the repository contains Objective-C codes of the Xcode project(not contains Javascript codes in `node_modules`). So, if you want to develop it, delete `node_modules` directory and run `npm install`.

## Contributing

Welcome to submit PRs and issues.
Please star this repository to support me keep developing it.
