'use strict';
import React, {
  Component,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Image,
} from 'react-native'

import Color from '../utils/Color'
import Icon from 'react-native-vector-icons/EvilIcons'
import t from '../utils/Translation'

class LanguageSelect extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{t.localizableInformation}</Text>
        <View style={styles.flex}/>
        <TouchableHighlight
          style={styles.languageContainer}
          underlayColor='transparent'
          onPress={this.props.onPress}
          >
          <View style={styles.language}>
            <Text style={styles.description}>{this.props.language}</Text>
            <Icon name="chevron-down" size={30} color={Color.LightBlue} />
          </View>
        </TouchableHighlight>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 5,
    backgroundColor: Color.BgGray,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flex: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  languageContainer: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  language: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 10,
    color: Color.TitleGray,
  },
  description: {
    fontSize: 14,
    color: Color.LightBlue,
  },
})

export default LanguageSelect
