'use strict';
import React, {
  Component,
  StyleSheet,
  View,
} from 'react-native'

import Icon from 'react-native-vector-icons/EvilIcons'

class EnterArrow extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Icon name="chevron-right" size={30} color="#808080" />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default EnterArrow
