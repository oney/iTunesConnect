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
import StateIcon from '../components/StateIcon'
import EnterArrow from '../components/EnterArrow'
import t from '../utils/Translation'

import {
  colorForState,
  platformName,
} from '../utils/helpers'

import autobind from 'autobind-decorator'

@autobind
class StatusRow extends Component {
  render() {
    const {status} = this.props
    return (
      <TouchableHighlight underlayColor='transparent' onPress={this.props.onPress}>
        <View style={styles.container}>
          <View style={styles.leftSection}>
            <Text style={styles.title}>{t.status}</Text>
          </View>
          <View style={styles.flex}/>
          <View style={styles.rightSection}>
            <StateIcon color={colorForState(status)}/>
            <Text style={styles.status}>{t[status]}</Text>
          </View>
          <EnterArrow/>
        </View>
      </TouchableHighlight>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    paddingLeft: 10,
    flexDirection: 'row',
  },
  flex: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  leftSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    color: 'black',
  },
  rightSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  status: {
    marginLeft: 5,
    fontSize: 12,
    color: Color.TitleGray,
  },
})

export default StatusRow
