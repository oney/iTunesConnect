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
import Icon from 'react-native-vector-icons/EvilIcons'

import autobind from 'autobind-decorator'

@autobind
class WebButton extends Component {
  static defaultProps = {
    enabled: true,
  };
  render() {
    return (
      <TouchableHighlight underlayColor='transparent' onPress={this.props.onPress}>
        <View style={styles.container}>
          <Icon name={this.props.icon} size={40} color={this.props.enabled ? Color.LightBlue : 'gray'} />
        </View>
      </TouchableHighlight>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default WebButton
