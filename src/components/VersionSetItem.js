'use strict';
import React, {
  Component,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Image,
} from 'react-native'

import moment from 'moment'
import Color from '../utils/Color'
import StateIcon from '../components/StateIcon'
import EnterArrow from '../components/EnterArrow'

import {
  colorForState,
  platformName,
} from '../utils/helpers'

import autobind from 'autobind-decorator'

@autobind
class VersionSetItem extends Component {
  _renderVersion(version) {
    return (
      <View style={styles.appVersion}>
        <StateIcon color={colorForState(version.state)}/>
        <Text style={styles.appVersionName}>{version.version}</Text>
      </View>
    )
  }
  _inFlightVersion(versionSet) {
    return versionSet.inFlightVersion && this._renderVersion(versionSet.inFlightVersion)
  }
  _deliverableVersion(versionSet) {
    return versionSet.deliverableVersion && this._renderVersion(versionSet.deliverableVersion)
  }
  _onPress() {
    this.props.onPress(this.props.versionSet)
  }
  render() {
    const {versionSet} = this.props
    return (
      <TouchableHighlight underlayColor='transparent' onPress={this._onPress}>
        <View style={styles.container}>
          <View style={styles.leftSection}>
            <Text style={styles.title}>{platformName(versionSet.platformString)}</Text>
          </View>
          <View style={styles.flex}/>
          <View style={styles.rightSection}>
            {this._inFlightVersion(versionSet)}
            {this._deliverableVersion(versionSet)}
          </View>
          <EnterArrow/>
        </View>
      </TouchableHighlight>
    )
  }
}

const styles = StyleSheet.create({
  container: {
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
  },
  title: {
    fontSize: 17,
    color: 'black',
  },
  rightSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  appVersion: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 15,
  },
  appVersionName: {
    marginLeft: 5,
    fontSize: 10,
    color: '#C1C1C1',
  },
  arrowSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default VersionSetItem
