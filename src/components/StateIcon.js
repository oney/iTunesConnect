'use strict';
import React, {
  Component,
  StyleSheet,
  Text,
  View,
} from 'react-native'

class StateIcon extends Component {
  render() {
    return (
      <View style={[styles.stateIcon, {backgroundColor: this.props.color}]}/>
    )
  }
}

const styles = StyleSheet.create({
  stateIcon: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
})

export default StateIcon
