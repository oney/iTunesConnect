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
  NavigatorIOS,
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
import VersionSetItem from '../components/VersionSetItem'
import LanguageSelect from '../components/LanguageSelect'
import ProgressHUD from '../components/ProgressHUD'
import BarButton from '../components/BarButton'
import TextField from '../components/TextField'
import t from '../utils/Translation'
import localeCodes from '../utils/localeCodes'
import Color from '../utils/Color'
import LocaleCodeModal from '../containers/LocaleCodeModal'
import DisplayCell from '../components/DisplayCell'
import VersionSet from '../containers/VersionSet'
import EventEmitterInstance from '../utils/EventEmitterInstance'
import KeyboardSpacer from 'react-native-keyboard-spacer'

import Spaceship, {
  Tunes,
  Errors,
} from '../spaceship'

import {
  colorForState,
  platformName,
} from '../utils/helpers'

function generateForm(appDetail) {
  let localizedMetadata = {}
  appDetail.localizedMetadata.value.forEach(function(v) {
    localizedMetadata[v.localeCode] = {
      name: v.name.value,
      privacyPolicyUrl: v.privacyPolicyUrl.value,
    }
  })
  return {
    localizedMetadata,
    primaryLocaleCode: appDetail.primaryLocaleCode.value,
    availablePrimaryLocaleCodes: appDetail.availablePrimaryLocaleCodes,
    bundleId: appDetail.bundleId.value,
    adamId: appDetail.adamId,
    vendorId: appDetail.vendorId,
    rating: appDetail.rating,
  }
}

function applyChange(appDetail, form) {
  appDetail.localizedMetadata.value.forEach(function(v) {
    const formLocalizedMetadata = form.localizedMetadata[v.localeCode]
    v.name.value = formLocalizedMetadata.name
    v.privacyPolicyUrl.value = formLocalizedMetadata.privacyPolicyUrl
  })
  return appDetail
}

@autobind
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      app: this.props.app,
    }
  }
  componentDidMount() {
    this._fetchData()
    this._onBarButtonPress()
  }
  async _fetchData() {
    try {
      this.appDetail = await Tunes.client.appDetails(this.props.app.adamId)
      let form = generateForm(this.appDetail)
      InteractionManager.runAfterInteractions(() => {
        this.setState({form, currentLocale: form.primaryLocaleCode})
      })
    } catch (e) {
      if (e instanceof Errors.UnauthorizedError) {
        Alert.alert(t.unauthorizedAccess, t.haveToSignIn)
      } else {
        Alert.alert(t.somethingWrong, e.message)
      }
    }
  }
  _onBarButtonPress() {
    this.addListenerOn(EventEmitterInstance, 'AppRightButtonPress', () => {
      this._onSave()
    })
    this.addListenerOn(EventEmitterInstance, 'AppLeftButtonPress', () => {
      this._back()
    })
  }
  componentDidUpdate(prevProps, prevState) {
  }
  _onSave() {
    if (!this.appDetail) {
      return
    }
    const formHasChange = this._formHasChange()
    if (!formHasChange) {
      Alert.alert(t.everythingAreUpToDate)
      return
    }
    this._update()
  }
  componentWillMount() {
    this._subscribableSubscriptions = []
  }
  componentWillUnmount() {
    this._subscribableSubscriptions.forEach((subscription) => subscription.remove())
    this._subscribableSubscriptions = null
  }
  addListenerOn(eventEmitter, eventType, listener, context) {
    this._subscribableSubscriptions.push(eventEmitter.addListener(eventType, listener, context))
  }
  async _update() {
    this.setState({showProgressHUD: true})
    const appDetail = applyChange(this.appDetail, this.state.form)
    try {
      const result = await Tunes.client.updateAppDetails(this.props.app.adamId, appDetail)
      this.setState({showProgressHUD: false})
      Alert.alert(t.updateSuccessful)
    } catch (e) {
      this.setState({showProgressHUD: false})
      Alert.alert(t.updateFailed, e.message)
    }
  }
  _renderFetching() {
    return (
      <ScrollView
        ref='scrollView'
        automaticallyAdjustContentInsets={false}
        style={styles.scrollView}>
        <AppTitle app={this.state.app}/>
        <Separator />
      </ScrollView>
    )
  }
  _formHasChange() {
    const previousForm = generateForm(this.appDetail)
    return !!diff(this.state.form, previousForm)
  }
  _textFieldChange(name, value) {
    if (name === 'name') {
      let currentLocalizedMetadata = this._currentLocalizedMetadata()
      currentLocalizedMetadata.name = value
      this.setState({form: this.state.form})
    }
    else if (name === 'privacyPolicyUrl') {
      let currentLocalizedMetadata = this._currentLocalizedMetadata()
      currentLocalizedMetadata.privacyPolicyUrl = value
      this.setState({form: this.state.form})
    }
  }
  _selectLocaleCode(localeCode) {
    this.setState({currentLocale: localeCode})
  }
  _changeLanguage() {
    this.props.navigator.push({
      component: LocaleCodeModal,
      title: t.selectLanguage,
      passProps: {
        selectLocaleCode: this._selectLocaleCode,
        localeCodes: this.appDetail.availablePrimaryLocaleCodes,
      },
    })
  }
  _back() {
    if (!this.appDetail) {
      this.props.navigator.pop()
      return
    }
    const formHasChange = this._formHasChange()
    if (formHasChange) {
      Alert.alert(t.doSaveChanges, t.changesWillBeLost,
        [
          {text: t.dontSave, onPress: () => this.props.navigator.pop()},
          {text: t.cancel, onPress: () => {}},
      ])
      return
    }
    this.props.navigator.pop()
  }
  _pressVersionSet(versionSet) {
    if (versionSet.platformString === 'appletvos') {
      Alert.alert(t.notSupportTvos)
      return
    }
    this.props.navigator.push({
      component: VersionSet,
      title: platformName(versionSet.platformString),
      passProps: {
        app: this.props.app,
        versionSet,
        currentLocale: this.state.currentLocale,
        localeCodes: this.appDetail.availablePrimaryLocaleCodes,
      },
      rightButtonTitle: t.save,
      onRightButtonPress: () => {
        EventEmitterInstance.emit('VersionSetRightButtonPress')
      },
      leftButtonIcon: NavigatorIOS.CustomBackIcon,
      onLeftButtonPress: () => {
        EventEmitterInstance.emit('VersionSetLeftButtonPress')
      },
    })
  }
  _currentLocalizedMetadata() {
    return this.state.form.localizedMetadata[this.state.currentLocale]
  }
  render() {
    const {app, form} = this.state
    if (!form) {
      return this._renderFetching()
    }
    const currentLocalizedMetadata = this._currentLocalizedMetadata()

    return (
      <View style={styles.container}>
        <ScrollView
          ref='scrollView'
          automaticallyAdjustContentInsets={false}
          style={styles.scrollView}>
          <AppTitle app={app}/>
          <Separator />
          <CellSection title={t.appStore} />
          <Separator />
          {app.versionSets.map((versionSet, i) => {
            return [
              (<VersionSetItem
                key={`VersionSetItem${i}`}
                versionSet={versionSet}
                onPress={this._pressVersionSet}
                />),
              (<Separator key={`VersionSetItemSeparator${i}`} />)
            ]
          })}
          <CellSection title={t.appInformation} />
          <Separator />
          <LanguageSelect onPress={this._changeLanguage} language={localeCodes[this.state.currentLocale]}/>
          <Separator />
          <TextField
            scrollViewContainer={this}
            title={t.appName}
            name='name'
            value={currentLocalizedMetadata.name}
            onChange={this._textFieldChange}
            />
          <Separator height={1} padding={10} />
          <TextField
            scrollViewContainer={this}
            title={t.privacyPolicyUrl}
            name='privacyPolicyUrl'
            keyboardType='url'
            placeholder={t.optionalUrlPlaceholder}
            autoCorrect={false}
            autoCapitalize='none'
            value={currentLocalizedMetadata.privacyPolicyUrl}
            onChange={this._textFieldChange}
            />
          <Separator />
          <CellSection title={t.generalInformation} />
          <Separator />
          <DisplayCell title='Bundle ID' description={form.bundleId} />
          <DisplayCell title='SKU' description={form.vendorId} />
          <DisplayCell title='Apple ID' description={form.adamId} />
          <DisplayCell title={t.rating} description={form.rating} />
          <KeyboardSpacer/>
        </ScrollView>
        <ProgressHUD show={this.state.showProgressHUD} />
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
    paddingBottom: 5,
  },
})

export default App
