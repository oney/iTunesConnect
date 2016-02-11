'use strict';
import React, {
  Component,
  StyleSheet,
  Text,
  View,
  Switch,
} from 'react-native'

import Icon from 'react-native-vector-icons/EvilIcons'
import Color from '../utils/Color'
import autobind from 'autobind-decorator'

@autobind
class SwitchCell extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{this.props.title}</Text>
        <Switch
          onValueChange={this.props.onValueChange}
          value={this.props.value} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 10,
  },
  title: {
    fontSize: 12,
    color: Color.TitleGray,
    marginRight: 10,
  },
})

export default SwitchCell
