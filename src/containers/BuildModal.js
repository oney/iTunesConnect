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
import localeCodes from '../utils/localeCodes'
import autobind from 'autobind-decorator'
import moment from 'moment'
import t from '../utils/Translation'

function buildDisplay(build) {
  return `${build.trainVersion} (${build.version})${build.processing ? ' ' + t.processing : ''}`
}

@autobind
class BuildModal extends Component {
  constructor(props) {
    super(props)
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    let builds
    if (props.currentBuild.trainVersion === null) {
      builds = props.builds
    } else {
      builds = [{
        iconUrl: null,
        uploadDate: 0,
        trainVersion: null,
        version: null,
      }].concat(props.builds)
    }
    this.state = {
      builds,
    }
  }
  componentDidMount() {
  }
  _pressRow(sectionID, rowID) {
    let build = this.state.builds[rowID]
    if (build.processing) {
      return
    }
    this.props.selectBuild(build)
    this.props.navigator.pop()
  }
  _renderRow(build, sectionID, rowID) {
    if (build.trainVersion === null) {
      return (
        <TouchableHighlight
          underlayColor='transparent'
          onPress={() => this._pressRow(sectionID, rowID)}
          >
          <View style={styles.row}>
            <View style={styles.leftSection}>
              <Text style={[styles.version, {
                color: Color.LightBlue
              }]}>
                {t.removeSelectedBuild}
              </Text>
            </View>
            <View style={styles.flex}/>
            <View style={styles.rightSection}>
              <EnterArrow/>
            </View>
          </View>
        </TouchableHighlight>
      )
    } else {
      return (
        <TouchableHighlight
          underlayColor='transparent'
          onPress={() => this._pressRow(sectionID, rowID)}
          >
          <View style={styles.row}>
            <View style={styles.leftSection}>
              <Image
                style={styles.icon}
                source={{uri: build.iconUrl}}
                />
              <Text style={[styles.version, {
                color: (build.processing ? 'gray' : Color.LightBlue)
              }]}>
                {buildDisplay(build)}
              </Text>
            </View>
            <View style={styles.flex}/>
            <View style={styles.rightSection}>
              <Text style={styles.time}>
                {moment(new Date(build.uploadDate)).format('MMM Do, h:mm A')}
              </Text>
              {!build.processing && <EnterArrow/>}
            </View>
          </View>
        </TouchableHighlight>
      )
    }
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
    return this.ds.cloneWithRows(this.state.builds)
  }
  render() {
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
    height: 1,
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
  icon: {
    width: 30,
    height: 30,
    borderRadius: 30 * 80 / 512,
    marginRight: 5,
  },
  version: {
    fontSize: 14,
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
  time: {
    fontSize: 14,
    color: 'black',
    paddingRight: 5,
  },
})

export default BuildModal
