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

import moment from 'moment'
import Color from '../utils/Color'
import StateIcon from '../components/StateIcon'

import {
  colorForState,
  platformName,
} from '../utils/helpers'
import autobind from 'autobind-decorator'

@autobind
class AppListItem extends Component {
  _appVersions(data) {
    return (
      <View style={styles.appVersions}>
        {data.versionSets.map((versionSet, i) => {
          if (versionSet.inFlightVersion) {
            return (
              <View key={i} style={styles.appVersion}>
                <StateIcon color={colorForState(versionSet.inFlightVersion.state)}/>
                <Text style={styles.appVersionName}>{`${versionSet.inFlightVersion.version} ${platformName(versionSet.platformString)}`}</Text>
              </View>
            )
          } else {
            return (
              <View key={i} style={styles.appVersion}>
                <StateIcon color={colorForState(versionSet.deliverableVersion.state)}/>
                <Text style={styles.appVersionName}>{`${versionSet.deliverableVersion.version} ${platformName(versionSet.platformString)}`}</Text>
              </View>
            )
          }
        })}
      </View>
    )
  }
  render() {
    const {data, sectionID, rowID} = this.props
    return (
      <TouchableHighlight
        underlayColor='rgba(0, 0, 0, 0.2)'
        key={rowID}
        onPress={() => this.props.pressRow(sectionID, rowID)}>
        <View
          style={styles.row}
          >
          <Image style={styles.appIcon} source={{uri: data.iconUrl}} />
          <View style={styles.cellRight}>
            <Text style={styles.appName}>{data.name}</Text>
            <Text style={styles.lastModified}>{moment(new Date(data.lastModifiedDate)).fromNow()}</Text>
            {this._appVersions(data)}
          </View>
        </View>
      </TouchableHighlight>
    )
  }
}

const styles = StyleSheet.create({
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
  appVersions: {
    flexDirection: 'row',
  },
  appVersion: {
    flexDirection: 'row',
    marginRight: 20,
    alignItems: 'center',
    height: 20,
  },
  stateIcon: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  appVersionName: {
    marginLeft: 5,
    fontSize: 10,
    color: '#C1C1C1',
  },
})

export default AppListItem
