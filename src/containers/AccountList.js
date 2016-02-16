'use strict';
import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  ListView,
} from 'react-native'

import Login from './Login'
import TouchID from 'react-native-touch-id'
import AccountManager from '../utils/AccountManager'
import Icon from 'react-native-vector-icons/EvilIcons'
import Color from '../utils/Color'
import EnterArrow from '../components/EnterArrow'
import autobind from 'autobind-decorator'
import t from '../utils/Translation'
import EventEmitterInstance from '../utils/EventEmitterInstance'

@autobind
class AccountList extends Component {
  constructor(props) {
    super(props)
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      accounts: [],
    }
  }
  componentDidMount() {
    this._fetchAccounts()
    this._onBarButtonPress()
    // TouchID.authenticate('to demo this react-native component').then(success => {
    // }).catch(error => {
    // })
  }
  async _fetchAccounts() {
    const accounts = await AccountManager.allAccounts()
    this.setState({accounts})
  }
  _onBarButtonPress() {
    this.addListenerOn(EventEmitterInstance, 'AccountListLeftButtonPress', () => {
    })
    this.addListenerOn(EventEmitterInstance, 'AccountListRightButtonPress', () => {
      this._addAccount()
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
    this.props.navigator.push({
      component: Login,
      title: t.signIn,
      passProps: {account: this.state.accounts[rowID]},
    })
  }
  _renderRow(data, sectionID, rowID) {
    return (
      <TouchableHighlight
        underlayColor='rgba(0, 0, 0, 0.2)'
        key={rowID}
        onPress={() => this._pressRow(sectionID, rowID)}>
        <View style={styles.row}>
          <View style={styles.leftSection}>
            <Text style={styles.rowText}>{data}</Text>
          </View>
          <View style={styles.flex}/>
          <View style={styles.rightSection}>
            <EnterArrow/>
          </View>
        </View>
      </TouchableHighlight>
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
    return this.ds.cloneWithRows(this.state.accounts)
  }
  _addAccount() {
    this.props.navigator.push({
      component: Login,
      title: t.signIn,
    })
  }
  _renderEmpty() {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.noAccounts}>{t.noAccounts}</Text>
        <TouchableHighlight
          underlayColor='transparent'
          onPress={this._addAccount}>
          <Text style={styles.addAccount}>{t.addAccount}</Text>
        </TouchableHighlight>
      </View>
    )
  }
  render() {
    if (this.state.accounts.length === 0) {
      return this._renderEmpty()
    }
    return (
      <View style={styles.container}>
        <ListView
          initialListSize={10}
          pageSize={10}
          scrollRenderAheadDistance={500}
          dataSource={this._dataSource()}
          renderRow={this._renderRow}
          renderSeparator={this._renderSeparator}
          />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginLeft: 15,
  },
  row: {
    height: 44,
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 10,
  },
  rowText: {
    fontSize: 16,
  },
  flex: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  leftSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  rightSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noAccounts: {
    fontSize: 30,
    color: Color.TitleGray,
  },
  addAccount: {
    marginTop: 10,
    fontSize: 16,
    color: Color.LightBlue,
  },
})

export default AccountList
