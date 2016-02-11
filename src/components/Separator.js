'use strict';
import React, {
  Component,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import Color from '../utils/Color'

class Separator extends Component {
  static defaultProps = {
    height: 0.5,
    padding: 0,
  };
  render() {
    return (
      <View style={[styles.container, {
        height: this.props.height,
        marginLeft: this.props.padding,
      }]} />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.SeparatorGray,
  },
})

export default Separator
