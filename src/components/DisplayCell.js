'use strict';
import React, {
  Component,
  StyleSheet,
  Text,
  View,
  TextInput,
} from 'react-native'

import Icon from 'react-native-vector-icons/EvilIcons'
import Color from '../utils/Color'

class DisplayCell extends Component {
  static defaultProps = {
    keyboardType: 'default',
    autoCorrect: true,
    autoCapitalize: 'sentences',
    placeholder: '',
    value: '',
  };
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{this.props.title}</Text>
        <Text style={styles.description}>{this.props.description}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 5,
    paddingLeft: 10,
    flexDirection: 'row',
  },
  title: {
    flex: 1,
    fontSize: 10,
    color: Color.TitleGray,
    marginRight: 15,
    textAlign: 'right',
  },
  description: {
    flex: 2,
    fontSize: 10,
    color: 'black',
  },
})

export default DisplayCell
