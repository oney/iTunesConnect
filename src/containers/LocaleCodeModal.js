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

import Color from '../utils/Color'
import EnterArrow from '../components/EnterArrow'
import localeCodes from '../utils/localeCodes'
import autobind from 'autobind-decorator'

@autobind
class LocaleCodeModal extends Component {
  constructor(props) {
    super(props)
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
  }
  componentDidMount() {
  }
  _pressRow(sectionID, rowID) {
    let localeCode = this.props.localeCodes[rowID]
    this.props.selectLocaleCode(localeCode)
    this.props.navigator.pop()
  }
  _renderRow(data, sectionID, rowID) {
    return (
      <TouchableHighlight
        underlayColor='transparent'
        onPress={() => this._pressRow(sectionID, rowID)}
        >
        <View style={styles.row}>
          <View style={styles.leftSection}>
            <Text style={styles.title}>{localeCodes[data]}</Text>
          </View>
          <View style={styles.flex}/>
          <EnterArrow/>
        </View>
      </TouchableHighlight>
    )
  }
  _renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    return (
      <View
        style={styles.separator}
        key={rowID}
        />
    )
  }
  _dataSource() {
    return this.ds.cloneWithRows(this.props.localeCodes)
  }
  render() {
    return (
      <View style={styles.container}>
        <ListView
          initialListSize={10}
          pageSize={10}
          scrollRenderAheadDistance={500}
          dataSource={this._dataSource()}
          renderRow={this._renderRow}
          renderSeparator={this._renderSeparator}
          />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginLeft: 15,
  },
  row: {
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
    fontSize: 17,
    color: 'black',
  },
  rightSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default LocaleCodeModal
