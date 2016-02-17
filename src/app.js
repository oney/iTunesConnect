'use strict';
import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  Alert,
  NavigatorIOS,
  AppState,
} from 'react-native'

import ExNavigator from '@exponent/react-native-navigator'

import Spaceship, {
  Tunes,
} from './spaceship'

import Login from './containers/Login'
import Loading from './containers/Loading'
import AccountList from './containers/AccountList'
import AppList from './containers/AppList'
import PrivacySnapshot from 'react-native-privacy-snapshot'
import Keychain from 'react-native-keychain'
import AccountManager from './utils/AccountManager'
import EventEmitterInstance from './utils/EventEmitterInstance'
import t from './utils/Translation'
import autobind from 'autobind-decorator'
import TouchID from 'react-native-touch-id'
import GAManager from './utils/GAManager'
import Icon from 'react-native-vector-icons/Ionicons'
import Color from './utils/Color'

import CodePush from 'react-native-code-push'

import {
  AsyncStorageGetBooleanWithDefault,
} from './utils/helpers'

import {
  ENABLE_TOUCH_ID,
  ENABLE_TRACKING,
  TOUCH_ID_SECONDS,
} from './utils/constants'

@autobind
class iTunesConnect extends Component {
  componentDidMount() {
    setTimeout(() => {
      this._determineAccount()
    }, 300)
    this._onAppState()
    this._setupGAManager()
    this._checkCodePush()
    this._loadBackIcon()
  }
  async _setupGAManager() {
    try {
      let enabled = await AsyncStorageGetBooleanWithDefault(ENABLE_TRACKING, true)
      if (enabled) {
        GAManager.sendScreenView('active')
      }
    } catch (e) {
    }
  }
  async _determineAccount() {
    let mainAccount = await AccountManager.mainAccount()
    if (mainAccount) {
      let password = await AccountManager.passwordFor(mainAccount)
      if (password) {
        try {
          await Tunes.login(mainAccount, password)
          this.refs.nav.push({
            component: AppList,
            title: t.apps,
            passProps: {navState: 'push'},
            leftButtonTitle: t.setting,
            onLeftButtonPress: () => {
              EventEmitterInstance.emit('AppListLeftButtonPress')
            },
          })
        } catch (e) {
          Alert.alert(t.signInFailed, e.message)
          this._toLogin(mainAccount)
        }
      } else {
        this._toLogin(mainAccount)
      }
    } else {
      let accounts = await AccountManager.allAccounts()
      if (accounts.length === 0) {
        this._toLogin()
      } else {
        this._toAccount()
      }
    }
  }
  _toAccount() {
    this.refs.nav.push({
      component: AccountList,
      title: t.accounts,
      leftButtonTitle: t.setting,
      onLeftButtonPress: () => {
        EventEmitterInstance.emit('AccountListLeftButtonPress')
      },
      rightButtonTitle: t.add,
      onRightButtonPress: () => {
        EventEmitterInstance.emit('AccountListRightButtonPress')
      },
    })
  }
  _toLogin(account, password) {
    this.refs.nav.resetTo({
      component: AccountList,
      title: t.accounts,
      leftButtonTitle: t.setting,
      onLeftButtonPress: () => {
        EventEmitterInstance.emit('AccountListLeftButtonPress')
      },
      rightButtonTitle: t.add,
      onRightButtonPress: () => {
        EventEmitterInstance.emit('AccountListRightButtonPress')
      },
    })
    this.refs.nav.push({
      component: Login,
      title: t.signIn,
      passProps: {account, password},
    })
  }
  _loadBackIcon() {
    Icon.getImageSource('chevron-left', 25, Color.LightBlue).then(source => {
      NavigatorIOS.CustomBackIcon = source
    })
  }
  componentWillMount() {
    PrivacySnapshot.enabled(true)
  }
  componentWillUnmount() {
    PrivacySnapshot.enabled(false)
  }
  _onAppState() {
    AppState.addEventListener('change', (appState) => {
      console.log('currentAppState', appState)
      switch (appState) {
        case 'active':
          this._onAppStateActive()
          break
        case 'background':
          this.eneterBackgroundAt = new Date()
          break
        default:
      }
    })
  }
  _onAppStateActive() {
    GAManager.sendScreenView('active')
    if (this.eneterBackgroundAt) {
      let duration = new Date() - this.eneterBackgroundAt
      if (duration > TOUCH_ID_SECONDS * 1000) {
        // this._useTouchID()
      }
    }
  }
  async _useTouchID() {
    try {
      let v = await AsyncStorageGetBooleanWithDefault(ENABLE_TOUCH_ID, true)
      if (v === false) {
        return
      }
    } catch (e) {
    }
    try {
      let isSupported = await TouchID.isSupported()
      if (isSupported) {
        try {
          await TouchID.authenticate('For using stored accounts')
        } catch (e) {
        }
      }
    } catch (e) {
    }
  }
  _checkCodePush() {
    const options = {
      updateDialog: {
        appendReleaseDescription: true,
        title: t.updateDialogTitle,
        descriptionPrefix: t.updateDialogDescriptionPrefix,
        mandatoryContinueButtonLabel: t.updateDialogMandatoryContinue,
        mandatoryUpdateMessage: t.updateDialogMandatoryUpdateMessage,
        optionalIgnoreButtonLabel: t.updateDialogOptionalIgnore,
        optionalInstallButtonLabel: t.updateDialogOptionalInstall,
        optionalUpdateMessage: t.updateDialogOptionalUpdateMessage,
      },
      installMode: CodePush.InstallMode.IMMEDIATE,
    }
    CodePush.sync(options, status => {
      switch (status) {
        case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
          this.refs.nav.push({
            component: Loading,
            title: ' ',
            navigationBarHidden: true,
            leftButtonTitle: '',
            onLeftButtonPress: () => {},
          })
          break
        case CodePush.SyncStatus.INSTALLING_UPDATE:
          break
        case CodePush.SyncStatus.AWAITING_USER_ACTION:
          break
      }
    })
  }
  render() {
    return (
      <NavigatorIOS
        ref='nav'
        initialRoute={{
          component: Loading,
          title: '',
        }}
        style={styles.nav}
      />
    )
  }
}

const styles = StyleSheet.create({
  nav: {
    flex: 1,
  },
})

AppRegistry.registerComponent('iTunesConnect', () => iTunesConnect)
