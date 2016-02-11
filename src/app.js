'use strict';
import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  Alert,
  NavigatorIOS,
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

@autobind
class iTunesConnect extends Component {
  async componentDidMount() {
    setTimeout(() => {
      this._determineAccount()
    }, 300)
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
            leftButtonTitle: t.logout,
            onLeftButtonPress: () => {
              EventEmitterInstance.emit('AppListLeftButtonPress')
            },
          })
        } catch (e) {
          Alert.alert(t.signInFailed, e.message)
          this._replaceAccount()
          this.refs.nav.push({
            component: Login,
            title: t.signIn,
            passProps: {account: mainAccount, password},
          })
        }
      } else {
        this._replaceAccount()
        this.refs.nav.push({
          component: Login,
          title: t.signIn,
          passProps: {account: mainAccount},
        })
      }
    } else {
      this._replaceAccount()
      let accounts = await AccountManager.allAccounts()
      if (accounts.length === 0) {
        this.refs.nav.push({
          component: Login,
          title: t.signIn,
        })
      }
    }
  }
  _replaceAccount() {
    this.refs.nav.replace({
      component: AccountList,
      title: t.accounts,
      rightButtonTitle: t.add,
      onRightButtonPress: () => {
        EventEmitterInstance.emit('AccountRightButtonPress')
      },
    })
  }
  componentWillMount() {
    PrivacySnapshot.enabled(true)
  }
  componentWillUnmount() {
    PrivacySnapshot.enabled(false)
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
