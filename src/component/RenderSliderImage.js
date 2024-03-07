import React, { PureComponent } from 'react'
import {SliderBox} from 'react-native-image-slider-box'

export default class RenderSliderImage extends PureComponent {
  render() {
    return (
        <SliderBox
        dotColor="black"
        inactiveDotColor="white"
        dotStyle={{ height: 20, width: 20, borderRadius: 50 }}
        imageLoadingColor="white"
        autoplay={true}
        autoplayInterval={7000}
        circleLoop={true}
        images={this.props.images}
        borderRadius={20}
      />
    )
  }
}
