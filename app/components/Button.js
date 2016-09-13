import React from 'react'

import { Text, TouchableHighlight } from 'react-native'
import commonStyles from './styles/common-styles'

export default ({label, onPress, color}) => (
  <TouchableHighlight
    style={[{backgroundColor: color},
            commonStyles.singleSegmentView,
            commonStyles.universalButtonContentAlignment,
            commonStyles.universalBorder,
            commonStyles.universalBorderRadius,
            commonStyles.universalMargin]}
    underlayColor={color}
    onPress={onPress}>

    <Text
      style={commonStyles.universalButtonTextStyling}>
      {label}
    </Text>

  </TouchableHighlight>
)
