'use strict';
import React, {
  Component,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
} from 'react-native'

import Icon from 'react-native-vector-icons/EvilIcons'
import Color from '../utils/Color'
import EnterArrow from '../components/EnterArrow'
import moment from 'moment'
import autobind from 'autobind-decorator'

@autobind
class BuildSelect extends Component {
  _renderEmptyBuild() {
    return (
      <View style={styles.container}>
        <View style={styles.leftSection}>
          <Text style={styles.version}>
            Select a build before you submit your app.
          </Text>
        </View>
        <View style={styles.flex}/>
        <View style={styles.rightSection}>
          <EnterArrow/>
        </View>
      </View>
    )
  }
  _renderBuild(build) {
    return (
      <View style={styles.container}>
        <View style={styles.leftSection}>
          <Image
            style={styles.icon}
            source={{uri: build.iconUrl}}
            />
          <Text style={styles.version}>
            {`${build.trainVersion} (${build.version})`}
          </Text>
        </View>
        <View style={styles.flex}/>
        <View style={styles.rightSection}>
          <Text style={styles.time}>
            {moment(new Date(build.uploadDate)).format('MMM Do YY, h:mm A')}
          </Text>
          <EnterArrow/>
        </View>
      </View>
    )
  }
  render() {
    const {build} = this.props
    return (
      <TouchableHighlight
        underlayColor='transparent'
        onPress={this.props.onPress}
        >
        {build.trainVersion ? this._renderBuild(build) : this._renderEmptyBuild()}
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
  icon: {
    width: 30,
    height: 30,
    borderRadius: 30 * 80 / 512,
    marginRight: 5,
  },
  version: {
    fontSize: 14,
    color: Color.LightBlue,
  },
  leftSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  rightSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  time: {
    fontSize: 14,
    color: 'black',
  },
})

export default BuildSelect
