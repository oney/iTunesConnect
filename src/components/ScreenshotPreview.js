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
import Color from '../utils/Color'
import autobind from 'autobind-decorator'

const ImageHost = 'https://is1-ssl.mzstatic.com/image/thumb/'

@autobind
class ScreenshotPreview extends Component {
  constructor(props) {
    super(props)
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      apps: [],
      widths: {},
    }
  }
  _widthForImage(assetToken) {
    return this.state.widths[assetToken] ? { width: this.state.widths[assetToken]} : {}
  }
  _renderRow(data, sectionID, rowID) {
    let assetToken = data.value.assetToken
    return (
      <View style={styles.row}>
        <Image
          key={assetToken}
          style={[styles.image, this._widthForImage(assetToken)]}
          source={{uri: `${ImageHost}${assetToken}/500x500bb.png`}}
          resizeMode='contain'
          onLoad={e => {
            // Use this to get image size
            // https://github.com/facebook/react-native/compare/0.17-stable...olofd:Image-Dimensions-0.17.0-rc?diff=unified&expand=1&name=Image-Dimensions-0.17.0-rc
            if (!(e.nativeEvent && e.nativeEvent.size)) {
              return
            }
            if (this.state.widths[assetToken]) {
              return
            }
            this.state.widths[assetToken] = 300 / e.nativeEvent.size.height * e.nativeEvent.size.width
            this.setState({widths: this.state.widths})
          }}
          />
      </View>
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
    return this.ds.cloneWithRows(this.props.screenshots.value)
  }
  render() {
    if (this.props.screenshots.value.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No images</Text>
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <ListView
          horizontal={true}
          style={styles.listView}
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
    height: 320,
  },
  listView: {
    backgroundColor: Color.BgGray,
    padding: 10,
  },
  separator: {
    width: 10,
    backgroundColor: 'transparent',
  },
  image: {
    width: 168,
    height: 300,
    borderWidth: 0.5,
    borderColor: Color.SeparatorGray,
  },
  emptyContainer: {
    flex: 1,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.BgGray,
  },
  emptyText: {
    fontSize: 20,
    color: Color.TitleGray,
  },
})

export default ScreenshotPreview
