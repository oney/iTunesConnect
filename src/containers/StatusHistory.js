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
} from 'react-native'

import Color from '../utils/Color'
import EnterArrow from '../components/EnterArrow'
import StateIcon from '../components/StateIcon'
import autobind from 'autobind-decorator'
import Loading from '../containers/Loading'
import t from '../utils/Translation'
import moment from 'moment'

import Spaceship, {
  Tunes,
  Errors,
} from '../spaceship'

import {
  colorForState,
  platformName,
} from '../utils/helpers'

@autobind
class StatusHistory extends Component {
  constructor(props) {
    super(props)
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      status: 'loading',
    }
  }
  componentDidMount() {
    this._fetchData()
  }
  async _fetchData() {
    const stateHistory = await Tunes.client.stateHistoryWithVersion(this.props.app.adamId, this.props.version)
    this.setState({stateHistory, status: 'ideal'})
  }
  _renderRow(data, sectionID, rowID) {
    return (
      <View style={styles.row}>
        <View style={styles.leftSection}>
          <StateIcon color={colorForState(data.stateKey)}/>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{t[data.stateKey] || t.unknown}</Text>
            <Text style={styles.time}>{moment(new Date(data.date)).format('MMM Do YYYY')}</Text>
          </View>
        </View>
        <View style={styles.flex}/>
        <View style={styles.rightSection}>
          <Text style={styles.actor}>{data.userName}</Text>
        </View>
      </View>
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
    return this.ds.cloneWithRows(this.state.stateHistory.items)
  }
  _renderLoading() {
    return <Loading/>
  }
  render() {
    if (this.state.status === 'loading') {
      return this._renderLoading()
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
  },
  separator: {
    height: 0.5,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginLeft: 15,
  },
  row: {
    height: 40,
    paddingLeft: 10,
    flexDirection: 'row',
  },
  flex: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  leftSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  titleContainer: {
    marginLeft: 10,
  },
  title: {
    fontSize: 13,
    color: 'black',
  },
  time: {
    fontSize: 8,
    color: Color.TitleGray,
  },
  rightSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  arrowSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  actor: {
    fontSize: 10,
    color: Color.TitleGray,
  },
  arrow: {
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default StatusHistory
