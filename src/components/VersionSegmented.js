'use strict';
import React, {
  Component,
  StyleSheet,
  Text,
  View,
  SegmentedControlIOS,
} from 'react-native'

import Color from '../utils/Color'

class VersionSegmented extends Component {
  render() {
    return (
      <View style={styles.container}>
        <SegmentedControlIOS
          tintColor='gray'
          style={{width: this.props.values.length * 50}}
          values={this.props.values}
          selectedIndex={this.props.selectedIndex}
          onValueChange={this.props.onValueChange} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 5,
  },
})

export default VersionSegmented
