import React from 'react'
import { View, Linking } from 'react-native'
import {SliderBox} from 'react-native-image-slider-box'

export default RenderSliderImage = props => {
  const onCurrentImagePressed = index => {
    const link = props.links[index];
    if (!link) {
      console.error(`No URL found for index ${index}`);
      return;
    }
    Linking.openURL(link);
  }

  return (
    <View style={{width:200}}>
      <SliderBox
        dotColor="transparent"
        inactiveDotColor="transparent"
        imageLoadingColor="white"
        autoplay={true}
        autoplayInterval={7000}
        circleLoop={true}
        images={props.images}
        borderRadius={20}
        parentWidth={300}
        sliderBoxHeight={170}
        onCurrentImagePressed={index => onCurrentImagePressed(index)}
      />
    </View>
  )
}
