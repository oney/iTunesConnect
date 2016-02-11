'use strict';
import React, {
  Component,
  StyleSheet,
  Text,
  View,
  TextInput,
} from 'react-native'

import Icon from 'react-native-vector-icons/EvilIcons'
import Color from '../utils/Color'
import autobind from 'autobind-decorator'

@autobind
class TextField extends Component {
  static defaultProps = {
    keyboardType: 'default',
    autoCorrect: true,
    autoCapitalize: 'sentences',
    placeholder: '',
    value: '',
    fontSize: 14,
  };
  _onChangeText(text) {
    this.props.onChange(this.props.name, text)
  }
  _onFocus() {
    // http://stackoverflow.com/a/32593814/1518075
    setTimeout(() => {
      let scrollResponder = this.props.scrollViewContainer.refs.scrollView.getScrollResponder();
      scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
        React.findNodeHandle(this.refs.textInput),
        110,
        true
      );
    }, 200);
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{this.props.title}</Text>
        <TextInput
          ref='textInput'
          style={[styles.textInput, {
            fontSize: this.props.fontSize,
          }]}
          keyboardType={this.props.keyboardType}
          autoCapitalize={this.props.autoCapitalize}
          autoCorrect={this.props.autoCorrect}
          onFocus={this._onFocus}
          multiline={false}
          placeholder={this.props.placeholder}
          onChangeText={this._onChangeText}
          value={this.props.value}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 5,
    paddingLeft: 10,
  },
  title: {
    fontSize: 9,
    color: Color.TitleGray,
  },
  textInput: {
    height: 30,
  },
})

export default TextField
