import React from 'react'
import { View } from 'react-native'
import {SliderBox} from 'react-native-image-slider-box'

export default RenderSliderImage = props => {
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
      />
      </View>
    )
}
