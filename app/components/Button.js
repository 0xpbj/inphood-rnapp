import React from 'react'

import { Text, TouchableHighlight } from 'react-native'
import CommonStyles from './styles/common-styles'

export default ({label, onPress, color}) => (
  <TouchableHighlight
    style={[{backgroundColor: color},
            CommonStyles.singleSegmentView,
            CommonStyles.universalButtonContentAlignment,
            CommonStyles.universalBorder,
            CommonStyles.universalBorderRadius,
            CommonStyles.universalMargin]}
    underlayColor={color}
    onPress={onPress}>

    <Text
      style={CommonStyles.universalButtonTextStyling}>
      {label}
    </Text>

  </TouchableHighlight>
)
