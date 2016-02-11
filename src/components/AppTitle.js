'use strict';
import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  ListView,
  Image,
} from 'react-native'

import moment from 'moment'

class AppTitle extends Component {
  render() {
    const {app} = this.props
    return (
      <View
        style={styles.row}
        >
        <Image style={styles.appIcon} source={{uri: app.iconUrl}} />
        <View style={styles.rightSection}>
          <Text style={styles.appName}>{app.name}</Text>
          <Text style={styles.lastModified}>{moment(new Date(app.lastModifiedDate)).fromNow()}</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  row: {
    height: 80,
    flexDirection: 'row',
    paddingLeft: 10,
  },
  appIcon: {
    backgroundColor: '#E8E8E8',
    borderRadius: 15,
    width: 70,
    height: 70,
    marginTop: 5,
  },
  appName: {
    fontSize: 14,
  },
  rightSection: {
    marginLeft: 10,
    paddingTop: 10,
  },
  lastModified: {
    fontSize: 10,
    color: 'gray',
  },
})

export default AppTitle
