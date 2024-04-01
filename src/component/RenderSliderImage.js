import React from 'react'
import {SliderBox} from 'react-native-image-slider-box'

export default RenderSliderImage = props => {
    return (
        <SliderBox
        dotColor="black"
        inactiveDotColor="white"
        dotStyle={{ height: 20, width: 20, borderRadius: 50 }}
        imageLoadingColor="white"
        autoplay={true}
        autoplayInterval={7000}
        circleLoop={true}
        images={props.images}
        borderRadius={20}
      />
    )
}
