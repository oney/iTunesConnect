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
import LocaleCodeModal from '../containers/LocaleCodeModal'
import DisplayCell from '../components/DisplayCell'
import AccountList from '../containers/AccountList'
import EventEmitterInstance from '../utils/EventEmitterInstance'
import KeyboardSpacer from 'react-native-keyboard-spacer'
import Button from 'react-native-button'

import Spaceship, {
  Tunes,
  Errors,
} from '../spaceship'

@autobind
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      touchID: true,
    }
  }
  componentDidMount() {
    console.log('sTunes', Tunes.client);
  }
  async _signOut() {
    this.setState({showProgressHUD: true})
    let r = await Tunes.client.logout()
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
  _onSwitchValueChange(name, value) {
    this.setState({[name]: value})
    if (name === 'touchID') {

    } else if (name === 'canTrack') {

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
            value={value} />
        </View>
      </View>
    )
  }
  render() {
    const {app, form} = this.state

    return (
      <View style={styles.container}>
        <ScrollView
          automaticallyAdjustContentInsets={false}
          style={styles.scrollView}>
          { Tunes.client.user && [
            this._textRow(t.appleID, Tunes.client.user, 'appleID'),
            (<Separator key='appleIDSeparator' padding={20} height={1} />)
          ]}
          {this._switchRow('touchID', t.useTouchID, this.state.touchID)}
          <Separator padding={20} height={1} />
          {this._switchRow('canTrack', t.canTrack, this.state.canTrack)}
          <Separator padding={20} height={1} />

          { Tunes.client.user &&
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
})

export default App
