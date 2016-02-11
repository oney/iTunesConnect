'use strict';
import React, {
  Component,
  StyleSheet,
  View,
  ActivityIndicatorIOS,
} from 'react-native'

class Loading extends Component {
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicatorIOS
          style={styles.activityIndicator}
          size="large"
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
  },
})

export default Loading
