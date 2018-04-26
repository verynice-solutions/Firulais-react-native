import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

//Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 667;

const scale = size => width / guidelineBaseWidth * size;
const scaleVertical = size => height / guidelineBaseHeight * size;
const scaleModerate = (size, factor = 0.5) => size + ( scale(size) - size ) * factor;

export {scale, scaleVertical, scaleModerate};
