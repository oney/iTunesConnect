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

class TitleCell extends Component {
  static defaultProps = {
    backgroundColor: Color.BgGray,
    fontSize: 12,
    titleColor: Color.TitleGray,
    height: 15,
    paddingLeft: 10,
  };
  render() {
    const {app} = this.props
    return (
      <View style={[styles.container, {
        backgroundColor: this.props.backgroundColor,
        height: this.props.height,
        paddingLeft: this.props.paddingLeft,
      }]}>
        <Text style={[styles.title, {
          fontSize: this.props.fontSize,
          color: this.props.titleColor,
        }]}>{this.props.title}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  title: {
  },
})

export default TitleCell
