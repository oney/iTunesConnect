'use strict';
import React, {
  Component,
  StyleSheet,
  View,
  WebView,
  Text,
  Alert,
  Switch,
  TouchableHighlight,
  ActivityIndicatorIOS,
} from 'react-native'
import autobind from 'autobind-decorator'

import moment from 'moment'
import Color from '../utils/Color'
import Icon from 'react-native-vector-icons/EvilIcons'
import WebButton from '../components/WebButton'


const ITUNES_CONNECT_URL = 'https://itunesconnect.apple.com'

@autobind
class MobileWeb extends Component {
  constructor(props) {
    super(props)
    this.state = {
      url: ITUNES_CONNECT_URL,
      status: 'Loading',
      canGoBack: false,
      canGoForward: false,
      loading: true,
      scalesPageToFit: true,
    }
  }
  _goBack() {
    this.refs.webView.goBack();
  }
  _goForward() {
    this.refs.webView.goForward();
  }
  _reload() {
    this.refs.webView.reload();
  }
  _onLoad() {
  }
  onShouldStartLoadWithRequest(event) {
    return true;
  }
  onNavigationStateChange(navState) {
    this.setState({
      canGoBack: navState.canGoBack,
      canGoForward: navState.canGoForward,
      status: navState.title,
      loading: navState.loading,
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <WebView
          ref='webView'
          automaticallyAdjustContentInsets={false}
          style={styles.webView}
          url={this.state.url}
          injectedJavaScript={js}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          decelerationRate="normal"
          onNavigationStateChange={this.onNavigationStateChange}
          onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
          startInLoadingState={true}
          onLoad={this._onLoad}
          scalesPageToFit={false}
        />
        <View style={styles.statusBar}>
          <WebButton icon='chevron-left' enabled={true} onPress={this._goBack}/>
          <WebButton icon='redo' onPress={this._reload}/>
          <WebButton icon='chevron-right' enabled={true} onPress={this._goForward}/>
          <View style={styles.flex}/>
          {this.state.loading &&
            <ActivityIndicatorIOS
              style={styles.activityIndicator}
              size="small"
              />
          }
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webView: {
    marginTop: 64,
    flex: 1,
  },
  flex: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 5,
    paddingRight: 10,
    height: 44,
  },
  statusBarText: {
    color: 'black',
    fontSize: 13,
  },
  activityIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
})

let css = `
#header {
    /* display: none !important;*/
}
#pageWrapper {
    min-width: initial !important;
    height: initial !important;
}
#header {
    min-width: initial !important;
}
#alerts, #news, #news-placeholder, #warnings, .homepageWrapper #main-nav, .homepageWrapper {
    min-width: initial !important;
}
.homepageWrapper ul#main-nav li {
    width: initial !important;
    padding-left: 40px;
}
#manage-your-apps-search #searchTextResults li.app {
    width: 50%;
}
.pane-layout {
    display: block !important;
}
.customselect, .customselect select {
    width: initial !important;
}
.halfcolumn {
    width: initial !important;
    float: none !important;
    padding-right: 0px !important;
}
.halfcolumn + .halfcolumn {
    padding-left: 0px !important;
}
.modal-dialog {
    width: initial !important;
}
.modal-dialog .modal-dialog-content {
    padding: 30px 10px 15px 10px !important;
}
.is-not-homepage .pane-layout-content-footer.footer {
    padding-right: 0px !important;
}
.pane-layout-content-header {
    display: block !important;
}
.pane-layout-content-header-buttons {
    justify-content: initial !important;
    padding-top: 10px !important;
}
.pane-layout-content-header-buttons button {
    margin-left: 0px !important;
    margin-right: 10px !important;
}
.pane-layout-content-wrapper {
    overflow-y: initial !important;
}
.section {
    padding: 0px !important;
}
.messageList {
    height: initial !important;
}
.thirdcolumn {
    width: initial !important;
    float: none !important;
}
.messageDetail {
    height: initial !important;
    overflow-y: initial !important;
}
.twothirdscolumn {
    width: initial !important;
    float: none !important;
    padding-left: 0 !important;
}
.messageDetail .messageDetailList.leaveRoomForResponse {
    height: initial !important;

}
.messageDetail .messageDetailList {
/*    overflow-y: auto;*/
    position: relative !important;
    left: initial !important;
    padding-right: 20px;
}
.flexcol {
    display: block !important;
}
.messageDetail .messageResponse {
    position: relative !important;
    padding-right: 20px !important;
}
.its-top-nav .site-nav #main-nav {
    width: 310px !important;
    height: 400px;
    overflow-y: auto;
}
#idms-auth-container {
  width: initial !important;
}
.controlBar .right-side {
  float: left;
  margin-top: 5px;
}
.controlBar {
  height: 80px;
}
#appMainNav li.selected a {
  color: #08f;
  border-bottom: none;
}
`
css = css.replace(/(\r\n|\n|\r)/gm, '')
const js = `
var styleNode = document.createElement('style');
styleNode.type = "text/css";
var styleText = document.createTextNode('${css}');
styleNode.appendChild(styleText);
document.getElementsByTagName('head')[0].appendChild(styleNode);
`
export default MobileWeb
