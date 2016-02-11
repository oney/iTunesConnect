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
import TextArea from '../components/TextArea'
import t from '../utils/Translation'
import localeCodes from '../utils/localeCodes'
import Color from '../utils/Color'
import LocaleCodeModal from '../containers/LocaleCodeModal'
import DisplayCell from '../components/DisplayCell'
import Loading from '../containers/Loading'
import ScreenshotPreview from '../components/ScreenshotPreview'
import ScreenshotDeviceList from '../components/ScreenshotDeviceList'
import BuildSelect from '../components/BuildSelect'
import TitleCell from '../components/TitleCell'
import BuildModal from '../containers/BuildModal'
import EventEmitterInstance from '../utils/EventEmitterInstance'

import Spaceship, {
  Tunes,
  Errors,
} from '../spaceship'

function generateForm(appVersion) {
  let details = {}
  appVersion.details.value.forEach(function(d) {
    details[d.language] = {
      description: d.description.value,
      keywords: d.keywords.value,
      marketingURL: d.marketingURL.value,
      supportURL: d.supportURL.value,
      releaseNotes: d.releaseNotes.value,
      releaseNotesIsEditable: d.releaseNotes.isEditable,
      screenshots: d.screenshots.value,
    }
  })
  return {
    details,
    preReleaseBuild: {
      iconUrl: appVersion.preReleaseBuildIconUrl,
      trainVersion: appVersion.preReleaseBuildTrainVersionString,
      uploadDate: appVersion.preReleaseBuildUploadDate,
      version: appVersion.preReleaseBuildVersionString.value,
    },
  }
}

function generateBuildsForm(builds) {
  return builds.map(build => ({
    iconUrl: build.iconUrl,
    uploadDate: build.uploadDate,
    trainVersion: build.trainVersion,
    version: build.version,
    processing: build.processing,
  }))
}
function applyChange(appVersion, form) {
  appVersion.details.value.forEach(function(d) {
    const formDetails = form.details[d.language]
    d.description.value = formDetails.description
    d.keywords.value = formDetails.keywords
    d.marketingURL.value = formDetails.marketingURL
    d.supportURL.value = formDetails.supportURL
    d.releaseNotes.value = formDetails.releaseNotes
    // d.screenshots.value = formDetails.screenshots // NOTE: not support yet
  })
  appVersion.preReleaseBuildIconUrl = form.preReleaseBuild.iconUrl
  appVersion.preReleaseBuildTrainVersionString = form.preReleaseBuild.trainVersion
  appVersion.preReleaseBuildUploadDate = form.preReleaseBuild.uploadDate
  appVersion.preReleaseBuildVersionString.value = form.preReleaseBuild.version
  return appVersion
}

const allDevices = ['iphone6', 'iphone6Plus', 'iphone4', 'iphone35', 'ipad', 'ipadPro', 'watch']

function usableScreenshotDevices(screenshots) {
  return allDevices.filter(device => !!screenshots[device])
}

@autobind
class Version extends Component {
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
  async _fetchData() {
    try {
      this.appVersion = await Tunes.client.appVersion(this.props.app.adamId, null, this.props.version)
      let form = generateForm(this.appVersion)

      const currenDetail = form.details[this.props.currentLocale]
      const currentScreenshotDevice = usableScreenshotDevices(currenDetail.screenshots)[0]

      setTimeout(() => {
        this.setState({form, currentLocale: this.props.currentLocale, currentScreenshotDevice})
      }, 300)
      this._fetchCandidateBuilds()
    } catch (e) {
      if (e instanceof Errors.UnauthorizedError) {
        Alert.alert(t.unauthorizedAccess, t.haveToSignIn)
      } else {
        Alert.alert(t.somethingWrong, e.message)
      }
    }
  }
  async _fetchCandidateBuilds() {
    try {
      this.candidateBuilds = await Tunes.client.candidateBuilds(this.props.app.adamId, this.appVersion.versionId)
    } catch (e) {
      if (e instanceof Errors.UnauthorizedError) {
        Alert.alert(t.unauthorizedAccess, t.haveToSignIn)
      } else {
        Alert.alert(t.somethingWrong, e.message)
      }
    }
  }
  _onBarButtonPress() {
    this.addListenerOn(EventEmitterInstance, 'VersionSetRightButtonPress', () => {
      this._onSave()
    })
    this.addListenerOn(EventEmitterInstance, 'VersionSetLeftButtonPress', () => {
      this._back()
    })
  }
  _onSave() {
    if (!this.appVersion) {
      return
    }
    const formHasChange = this._formHasChange()
    if (!formHasChange) {
      Alert.alert(t.everythingAreUpToDate)
      return
    }
    this._update()
  }
  async _update() {
    this.setState({showProgressHUD: true})
    const appVersion = applyChange(this.appVersion, this.state.form)
    try {
      const result = await Tunes.client.updateAppVersion(this.props.app.adamId, this.appVersion.versionId, appVersion)
      this.setState({showProgressHUD: false})
      Alert.alert(t.updateSuccessful)
    } catch (e) {
      this.setState({showProgressHUD: false})
      Alert.alert(t.updateFailed, e.message)
    }
  }
  _back() {
    if (!this.appVersion) {
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
  _renderFetching() {
    return <Loading/>
  }
  _formHasChange() {
    const previousForm = generateForm(this.appVersion)
    return !!diff(this.state.form, previousForm)
  }
  _textChange(name, value) {
    let currenDetail = this._currenDetail()
    currenDetail[name] = value
    this.setState({form: this.state.form})
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
        localeCodes: this.props.localeCodes,
      },
    })
  }
  _selectBuild(build) {
    const {form} = this.state
    form.preReleaseBuild = build
    this.setState({form: this.state.form})
  }
  _changeBuild() {
    this.props.navigator.push({
      component: BuildModal,
      title: t.selectBuild,
      passProps: {
        selectBuild: this._selectBuild,
        currentBuild: this.state.form.preReleaseBuild,
        builds: generateBuildsForm(this.candidateBuilds),
      },
    })
  }
  _changeDevice(value) {
    this.setState({currentScreenshotDevice: value})
  }
  _currenDetail() {
    return this.state.form.details[this.state.currentLocale]
  }
  render() {
    const {app, form} = this.state
    if (!form) {
      return this._renderFetching()
    }
    const currenDetail = this._currenDetail()

    return (
      <View
        style={styles.container}>
        <CellSection title={t.versionInformation} />
        <Separator />
        <LanguageSelect onPress={this._changeLanguage} language={localeCodes[this.state.currentLocale]}/>
        <Separator />
        {
          currenDetail.releaseNotesIsEditable && [
            (<TextArea
              scrollViewContainer={this.props.container}
              key='releaseNotes'
              title={t.releaseNotes}
              name='releaseNotes'
              height={80}
              fontSize={14}
              value={currenDetail.releaseNotes}
              onChange={this._textChange}
              />),
            (<Separator key='releaseNotesSeparator' />)
          ]
        }
        <CellSection title={t.videoPreviewScreenshots} />
        <Separator />
        <ScreenshotDeviceList
          devices={usableScreenshotDevices(currenDetail.screenshots)}
          selectedDevice={this.state.currentScreenshotDevice}
          onValueChange={this._changeDevice}
          />
        <ScreenshotPreview
          screenshots={currenDetail.screenshots[this.state.currentScreenshotDevice]}
          />
        <Separator />
        <TextArea
          scrollViewContainer={this.props.container}
          title={t.description}
          name='description'
          height={120}
          fontSize={14}
          value={currenDetail.description}
          onChange={this._textChange}
          />
        <Separator height={1} padding={10} />
        <TextField
          scrollViewContainer={this.props.container}
          title={t.keywords}
          name='keywords'
          fontSize={14}
          value={currenDetail.keywords}
          onChange={this._textChange}
          />
        <Separator height={1} padding={10} />
        <TextField
          scrollViewContainer={this.props.container}
          title={t.supportURL}
          name='supportURL'
          fontSize={14}
          placeholder='http://example.com'
          value={currenDetail.supportURL}
          onChange={this._textChange}
          />
        <Separator height={1} padding={10} />
        <TextField
          scrollViewContainer={this.props.container}
          title={t.marketingURL}
          name='marketingURL'
          fontSize={14}
          placeholder={t.optionalUrlPlaceholder}
          value={currenDetail.marketingURL}
          onChange={this._textChange}
          />
        <Separator />
        <TitleCell
          title={t.build}
          backgroundColor='white'
          height={15}
          fontSize={10}
          />
        <BuildSelect
          build={form.preReleaseBuild}
          onPress={this._changeBuild}
          />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default Version
