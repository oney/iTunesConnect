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

class CellSection extends Component {
  render() {
    const {app} = this.props
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{this.props.title}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    paddingLeft: 10,
    paddingBottom: 5,
    backgroundColor: Color.BgGray,
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: 12,
    color: Color.TitleGray,
  },
})

export default CellSection
