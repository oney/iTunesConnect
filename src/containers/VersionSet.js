'use strict';
import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Navigator,
  InteractionManager,
  Alert,
} from 'react-native'

import moment from 'moment'
import {
  diff,
} from 'deep-diff'
import autobind from 'autobind-decorator'

import Coordinator from '../utils/Coordinator'
import AppTitle from '../components/AppTitle'
import CellSection from '../components/CellSection'
import Separator from '../components/Separator'
import LanguageSelect from '../components/LanguageSelect'
import BarButton from '../components/BarButton'
import TextField from '../components/TextField'
import t from '../utils/Translation'
import localeCodes from '../utils/localeCodes'
import Color from '../utils/Color'
import LocaleCodeModal from '../containers/LocaleCodeModal'
import DisplayCell from '../components/DisplayCell'
import Version from '../containers/Version'
import VersionSegmented from '../components/VersionSegmented'
import KeyboardSpacer from 'react-native-keyboard-spacer'

import Spaceship, {
  Tunes,
} from '../spaceship'

function usableVersion(versionSet) {
  return (versionSet.deliverableVersion || versionSet.inFlightVersion)['version']
}
function allVersion(versionSet) {
  let array = []
  if (versionSet.deliverableVersion) {
    array.push(versionSet.deliverableVersion.version)
  }
  if (versionSet.inFlightVersion) {
    array.push(versionSet.inFlightVersion.version)
  }
  return array
}

@autobind
class VersionSet extends Component {
  constructor(props) {
    super(props)
    const {app, versionSet} = this.props
    this.state = {
      app,
      versionSet,
      currentVersion: usableVersion(versionSet),
    }
  }
  componentDidMount() {
  }
  _allVersion() {
    return allVersion(this.state.versionSet)
  }
  _versionChange(value) {
    const formHasChange = this.refs.version._formHasChange()
    if (formHasChange) {
      // Fix SegmentedControlIOS bug
      this.setState({fakeCurrentVersion: value})
      this.setState({fakeCurrentVersion: null})
      Alert.alert(t.doSaveChanges, t.changesWillBeLost, [
        {text: t.dontSave, onPress: () => this._doVersionChange(value)},
        {text: t.cancel, onPress: () => {}},
      ])
      return
    }
    this._doVersionChange(value)
  }
  _doVersionChange(value) {
    this.setState({currentVersion: value})
  }
  inputFocused (refName) {
    setTimeout(() => {
      let scrollResponder = this.refs.scrollView.getScrollResponder();
      scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
        React.findNodeHandle(this.refs[refName]),
        110,
        true
      );
    }, 50);
  }
  render() {
    const {app} = this.state
    let allVersion = this._allVersion()
    let currentVersionIndex = this.state.fakeCurrentVersion ? allVersion.indexOf(this.state.fakeCurrentVersion) : allVersion.indexOf(this.state.currentVersion)

    return (
      <View style={styles.container}>
        <ScrollView
          ref='scrollView'
          automaticallyAdjustContentInsets={false}
          style={styles.scrollView}>
          <AppTitle app={app}/>
          <VersionSegmented
            values={allVersion}
            selectedIndex={currentVersionIndex}
            onValueChange={this._versionChange}
            />
          <Separator />
          <Version
            ref='version'
            container={this}
            navigator={this.props.navigator}
            key={this.state.currentVersion}
            app={app}
            version={this.state.currentVersion}
            currentLocale={this.props.currentLocale}
            localeCodes={this.props.localeCodes}
            />
          <KeyboardSpacer />
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    paddingTop: 64,
  },
})

export default VersionSet
