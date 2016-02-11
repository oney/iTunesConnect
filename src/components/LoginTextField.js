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
class LoginTextField extends Component {
  static defaultProps = {
    keyboardType: 'default',
    autoCorrect: false,
    autoCapitalize: 'none',
    placeholder: '',
    value: '',
    fontSize: 16,
    secureTextEntry: false,
    clearButtonMode: 'while-editing',
  };
  _onChangeText(text) {
    this.props.onChange(this.props.name, text)
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.leftSection}>
          <Text style={styles.title}>{this.props.title}</Text>
        </View>
        <TextInput
          style={styles.textInput}
          keyboardType={this.props.keyboardType}
          autoCapitalize={this.props.autoCapitalize}
          autoCorrect={this.props.autoCorrect}
          multiline={false}
          secureTextEntry={this.props.secureTextEntry}
          placeholder={this.props.placeholder}
          clearButtonMode={this.props.clearButtonMode}
          onChangeText={this._onChangeText}
          value={this.props.value}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 40,
  },
  leftSection: {
    width: 80,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 12,
    color: Color.TitleGray,
    fontWeight: 'bold',
  },
  textInput: {
    marginTop: 5,
    flex: 1,
    height: 30,
    fontSize: 12,
  },
})

export default LoginTextField
