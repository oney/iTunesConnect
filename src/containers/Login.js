'use strict';
import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Alert,
} from 'react-native'

import moment from 'moment'
import autobind from 'autobind-decorator'
import t from '../utils/Translation'
import LoginTextField from '../components/LoginTextField'
import Color from '../utils/Color'
import Separator from '../components/Separator'
import Button from 'react-native-button'
import SwitchCell from '../components/SwitchCell'
import AccountManager from '../utils/AccountManager'
import AppList from '../containers/AppList'
import ProgressHUD from '../components/ProgressHUD'
import Progress from 'react-native-progress'
import EventEmitterInstance from '../utils/EventEmitterInstance'

import Spaceship, {
  Tunes,
} from '../spaceship'

@autobind
class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      account: this.props.account,
      password: this.props.password,
      rememberPW: true,
      logining: false,
    }
  }
  async componentDidMount() {
    if (!this.state.password) {
      let password = await AccountManager.passwordFor(this.state.account)
      if (password) {
        this.setState({password})
      }
    }
  }
  _textChange(name, value) {
    this.state[name] = value
    this.setState(this.state)
  }
  _switchRememberPW(value) {
    this.setState({rememberPW: value})
  }
  _signInPress() {
    try {
      AccountManager.store(this.state.account, this.state.rememberPW ? this.state.password : null)
      AccountManager.setMainAccount(this.state.account)
      this._signIn()
    } catch (e) {
      Alert.alert(e.message)
    }
  }
  async _signIn() {
    this.setState({logining: true})
    try {
      await Tunes.login(this.state.account, this.state.password)
      // TODO: should be able to abort
      this.setState({logining: false})
      this.props.navigator.resetTo({
        component: AppList,
        title: t.apps,
        passProps: {navState: 'resetTo'},
        leftButtonTitle: t.setting,
        onLeftButtonPress: () => {
          EventEmitterInstance.emit('AppListLeftButtonPress')
        },
      })
    } catch (e) {
      this.setState({logining: false})
      Alert.alert(t.signInFailed, e.message)
    }
  }
  render() {
    const signInDisabled = !(this.state.account && this.state.password) || this.state.logining
    return (
      <View style={styles.container}>
        <View style={styles.form}>
          <LoginTextField
            title={t.appleID}
            name='account'
            value={this.state.account}
            keyboardType='email-address'
            placeholder='example@icloud.com'
            onChange={this._textChange}
            />
          <Separator height={1} />
          <LoginTextField
            title={t.password}
            name='password'
            placeholder={t.required}
            value={this.state.password}
            secureTextEntry={true}
            onChange={this._textChange}
            />
        </View>
        <SwitchCell
          title={t.rememberPassword}
          onValueChange={this._switchRememberPW}
          value={this.state.rememberPW}
          />
        <View style={styles.signInContainer}>
          <Button
            style={styles.signIn}
            styleDisabled={styles.signInDisabled}
            disabled={signInDisabled}
            onPress={this._signInPress}
            >
            {t.signIn}
          </Button>
          {this.state.logining && (
            <Progress.CircleSnail
              size={20}
              indeterminate={true}
              color={Color.SeparatorGray}
              style={styles.progress}
              />
          )}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Color.SeparatorGray,
    width: 280,
  },
  loginWrapper: {
    marginTop: 20,
    alignItems: 'center',
    height: 40,
  },
  signIn: {
    fontSize: 20,
    color: Color.LightBlue,
    marginTop: 15,
  },
  signInDisabled: {
    color: Color.SeparatorGray,
  },
  signInContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  progress: {
    marginTop: 15,
    marginLeft: 10,
    width: 20,
    height: 20,
  },
})

export default Login
