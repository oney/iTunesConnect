'use strict';
import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  ListView,
  Image,
  Alert,
  NavigatorIOS,
} from 'react-native'

import Login from './Login'
import App from './App'
import AppListItem from '../components/AppListItem'

import TouchID from 'react-native-touch-id'
import AccountManager from '../utils/AccountManager'
import moment from 'moment'
import EventEmitterInstance from '../utils/EventEmitterInstance'
import AccountList from '../containers/AccountList'
import t from '../utils/Translation'
import Loading from '../containers/Loading'
import ProgressHUD from '../components/ProgressHUD'
import autobind from 'autobind-decorator'
import Setting from '../containers/Setting'

import Spaceship, {
  Tunes,
  Errors,
} from '../spaceship'

@autobind
class AppList extends Component {
  constructor(props) {
    super(props)
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      apps: [],
      dataLoaded: false,
    }
  }
  componentDidMount() {
    this._fetchApps()
    this._onBarButtonPress()
  }
  async _fetchApps() {
    try {
      let apps = await Tunes.Application.all()
      this.setState({apps, dataLoaded: true})
    } catch (e) {
      if (e instanceof Errors.UnauthorizedError) {
        Alert.alert(t.unauthorizedAccess, t.haveToSignIn)
      } else {
        Alert.alert(t.somethingWrong, e.message)
      }
    }
  }
  _onBarButtonPress() {
    this.addListenerOn(EventEmitterInstance, 'AppListLeftButtonPress', () => {
      this.props.navigator.push({
        component: Setting,
        title: t.setting,
      })
    })
  }
  componentWillMount() {
    this._subscribableSubscriptions = []
  }
  componentWillUnmount() {
    this._subscribableSubscriptions.forEach((subscription) => subscription.remove())
    this._subscribableSubscriptions = null
  }
  addListenerOn(eventEmitter, eventType, listener, context) {
    this._subscribableSubscriptions.push(eventEmitter.addListener(eventType, listener, context))
  }
  _pressRow(sectionID, rowID) {
    let app = this.state.apps[rowID]
    this.props.navigator.push({
      component: App,
      title: app.name,
      passProps: { app },
      rightButtonTitle: t.save,
      onRightButtonPress: () => {
        EventEmitterInstance.emit('AppRightButtonPress')
      },
      leftButtonIcon: NavigatorIOS.CustomBackIcon,
      onLeftButtonPress: () => {
        EventEmitterInstance.emit('AppLeftButtonPress')
      },
    })
  }
  _renderRow(data, sectionID, rowID) {
    return (
      <AppListItem
        data={data}
        sectionID={sectionID}
        rowID={rowID}
        pressRow={this._pressRow}
        />
    )
  }
  _renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    return (
      <View
        style={styles.separator}
        key={rowID}
      />
    )
  }
  _dataSource() {
    return this.ds.cloneWithRows(this.state.apps)
  }
  render() {
    if (!this.state.dataLoaded) {
      return <Loading/>
    }
    return (
      <View
        style={styles.container}
        >
        <ListView
          style={[styles.listView, {
            paddingTop: (this.props.navState == 'push' ? 64 : 64) // NOTE: Bug
          }]}
          initialListSize={10}
          pageSize={10}
          scrollRenderAheadDistance={500}
          dataSource={this._dataSource()}
          renderRow={this._renderRow}
          renderSeparator={this._renderSeparator}
        />
        <ProgressHUD show={this.state.showProgressHUD} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listView: {
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginLeft: 15,
  },
  row: {
    height: 80,
    flexDirection: 'row',
    paddingLeft: 10,
  },
  appIcon: {
    backgroundColor: '#E8E8E8',
    borderRadius: 15,
    width: 70,
    height: 70,
    marginTop: 5,
  },
  appName: {
    fontSize: 14,
  },
  cellRight: {
    marginLeft: 10,
    paddingTop: 10,
  },
  lastModified: {
    fontSize: 10,
    color: 'gray',
  },
})

export default AppList
