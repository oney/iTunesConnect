'use strict';
import React, {
  Component,
  StyleSheet,
  View,
} from 'react-native'

import Icon from 'react-native-vector-icons/EvilIcons'
import Button from 'react-native-button'
import Color from '../utils/Color'

class BarButton extends Component {
  static defaultProps = {
    disabled: false,
  };
  render() {
    return (
      <Button
        style={styles.normal}
        containerStyle={styles.container}
        styleDisabled={styles.disabled}
        disabled={this.props.disabled}
        onPress={this.props.onPress}
        >
        {this.props.children}
      </Button>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 10,
    paddingLeft: 10,
  },
  normal: {
    fontSize: 17,
    color: Color.LightBlue,
  },
  disabled: {
    color: 'gray',
  }
})

export default BarButton
