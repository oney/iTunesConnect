'use strict';
import React, {
  Component,
  StyleSheet,
  Text,
  View,
  SegmentedControlIOS,
  ScrollView,
} from 'react-native'

import Color from '../utils/Color'

import {
  deviceCodeToName,
  deviceNameToCode,
} from '../utils/helpers'

function deviceNames(devices) {
  return devices.map(d => deviceCodeToName(d))
}
import autobind from 'autobind-decorator'

@autobind
class ScreenshotDeviceList extends Component {
  _onValueChange(value) {
    this.props.onValueChange(deviceNameToCode(value))
  }
  render() {
    let selectedIndex = this.props.devices.indexOf(this.props.selectedDevice)
    return (
      <ScrollView
        style={styles.container}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        >
        <SegmentedControlIOS
          tintColor='gray'
          style={{width: this.props.devices.length * 80}}
          values={deviceNames(this.props.devices)}
          selectedIndex={selectedIndex}
          onValueChange={this._onValueChange} />
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
  },
})

export default ScreenshotDeviceList
