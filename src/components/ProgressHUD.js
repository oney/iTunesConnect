'use strict';
import React, {
  Component,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import Color from '../utils/Color'
import Progress from 'react-native-progress'

class ProgressHUD extends Component {
  static defaultProps = {
    show: false,
  };
  render() {
    if (!this.props.show) {
      return null
    }
    return (
      <View style={styles.container}>
        <Progress.CircleSnail
          size={50}
          indeterminate={true}
          style={styles.progress}
          />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  progress: {
    width: 50,
    height: 50,
  },
})

export default ProgressHUD
