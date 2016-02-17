'use strict';
import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Navigator,
  InteractionManager,
  Alert,
  Switch,
  TouchableHighlight,
  AsyncStorage,
} from 'react-native'

import moment from 'moment'
import {
  diff,
} from 'deep-diff'
import autobind from 'autobind-decorator'

import Coordinator from '../utils/Coordinator'
import AppTitle from '../components/AppTitle'
import CellSection from '../components/CellSection'
import Separator from '../components/Separator'
import VersionSetItem from '../components/VersionSetItem'
import LanguageSelect from '../components/LanguageSelect'
import ProgressHUD from '../components/ProgressHUD'
import BarButton from '../components/BarButton'
import TextField from '../components/TextField'
import t from '../utils/Translation'
import localeCodes from '../utils/localeCodes'
import Color from '../utils/Color'
import MobileWeb from '../containers/MobileWeb'
import EnterArrow from '../components/EnterArrow'
import AccountList from '../containers/AccountList'
import EventEmitterInstance from '../utils/EventEmitterInstance'
import Button from 'react-native-button'

import Spaceship, {
  Tunes,
  Errors,
} from '../spaceship'

import {
  AsyncStorageGetBooleanWithDefault,
} from '../utils/helpers'

const ENABLE_TOUCH_ID = 'ENABLE_TOUCH_ID'
const ENABLE_TRACKING = 'ENABLE_TRACKING'

@autobind
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      status: 'loading',
    }
  }
  async componentDidMount() {
    try {
      let [touchID, canTrack] = await Promise.all([
        AsyncStorageGetBooleanWithDefault(ENABLE_TOUCH_ID, true),
        AsyncStorageGetBooleanWithDefault(ENABLE_TRACKING, true),
      ])
      this.setState({status: 'ideal', touchID, canTrack})
    } catch (error) {
      Alert.alert(error.message)
    }
  }
  async _signOut() {
    this.setState({showProgressHUD: true})
    try {
      let r = await Tunes.client.logout()
    } catch (e) {

    } finally {
      this.setState({showProgressHUD: false})
      this.props.navigator.resetTo({
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
  }
  async _onSwitchValueChange(name, value) {
    let oldValue = this.state[name]
    this.setState({[name]: value})
    let key = {touchID: ENABLE_TOUCH_ID, canTrack: ENABLE_TRACKING}[name]
    try {
      await AsyncStorage.setItem(key, value ? 'true' : 'false')
    } catch (error) {
      this.setState({[name]: oldValue})
    }
  }
  _textRow(title, value, key) {
    return (
      <View style={styles.row} key={key}>
        <View style={styles.leftSection}>
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.flex}/>
        <View style={styles.rightSection}>
          <Text style={styles.description}>{value}</Text>
        </View>
      </View>
    )
  }
  _switchRow(name, title, value) {
    return (
      <View style={styles.row}>
        <View style={styles.leftSection}>
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.flex}/>
        <View style={styles.rightSection}>
          <Switch
            onValueChange={value => this._onSwitchValueChange(name, value)}
            value={!!value} />
        </View>
      </View>
    )
  }
  _useMobileWeb() {
    this.props.navigator.push({
      component: MobileWeb,
    })
  }
  _renderUseMobileWeb() {
    return (
      <TouchableHighlight
        underlayColor='transparent'
        onPress={this._useMobileWeb}
        >
        <View style={[styles.row, {
          paddingRight: 0,
        }]}>
          <View style={styles.leftSection}>
            <Text style={styles.useMobileWeb}>{t.useMobileWeb}</Text>
          </View>
          <View style={styles.flex}/>
          <EnterArrow/>
        </View>
      </TouchableHighlight>
    )
  }
  _tunesIsLogin() {
    return Tunes.client && Tunes.client.user
  }
  render() {
    if (this.state.status === 'loading') {
      return <View style={styles.container} />
    }

    return (
      <View style={styles.container}>
        <ScrollView
          automaticallyAdjustContentInsets={false}
          style={styles.scrollView}>
          { this._tunesIsLogin() && [
            this._textRow(t.appleID, Tunes.client.user, 'appleID'),
            (<Separator key='appleIDSeparator' padding={20} height={1} />)
          ]}
          {this._switchRow('touchID', t.useTouchID, this.state.touchID)}
          <Separator padding={20} height={1} />
          {this._switchRow('canTrack', t.canTrack, this.state.canTrack)}
          <Separator padding={20} height={1} />
          {this._renderUseMobileWeb()}
          <Separator padding={20} height={1} />
          { this._tunesIsLogin() &&
            <Button style={styles.signOut} onPress={this._signOut}>
              {t.signOut}
            </Button>
          }
        </ScrollView>
        <ProgressHUD show={this.state.showProgressHUD} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    paddingTop: 64,
    paddingBottom: 5,
  },
  row: {
    height: 44,
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: 'row',
  },
  flex: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  leftSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    color: 'black',
  },
  rightSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    fontSize: 14,
    color: Color.TitleGray,
  },
  signOut: {
    fontSize: 17,
    color: Color.LightBlue,
    marginTop: 15,
  },
  useMobileWeb: {
    fontSize: 14,
    color: Color.LightBlue,
  },
})

export default App
