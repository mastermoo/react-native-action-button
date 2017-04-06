import React, { Component, PropTypes } from 'react';
import { StyleSheet, Text, View, Animated, 
  TouchableNativeFeedback, TouchableWithoutFeedback, Dimensions, Platform } from 'react-native';
import { shadowStyle, alignItemsMap, getTouchableComponent, isAndroid, touchableBackground, DEFAULT_ACTIVE_OPACITY } from './shared';

const { width: WIDTH } = Dimensions.get('window');
const SHADOW_SPACE = 10;
const TEXT_HEIGHT = 22;

const TextTouchable = isAndroid ? TouchableNativeFeedback : TouchableWithoutFeedback;

export default class ActionButtonItem extends Component {
  static get defaultProps() {
    return {
      active: true,
      spaceBetween: 15,
      useNativeFeedback: true,
      activeOpacity: DEFAULT_ACTIVE_OPACITY,
    };
  }

  static get propTypes() {
    return {
      active: PropTypes.bool,
      useNativeFeedback: PropTypes.bool,
      activeOpacity: PropTypes.number,
    }
  }

  render() {
    const { size, position, verticalOrientation, hideShadow, spacing } = this.props;

    if (!this.props.active) return null;

    const animatedViewStyle = {
      height: size + SHADOW_SPACE + spacing,
      marginBottom: -SHADOW_SPACE,
      paddingHorizontal: this.props.offsetX,
      alignItems: alignItemsMap[position],

      // backgroundColor: this.props.buttonColor,
      opacity: this.props.anim,
      transform: [
        {
          translateY: this.props.anim.interpolate({
            inputRange: [0, 1],
            outputRange: [verticalOrientation === 'down' ? -40 : 40, 0]
          }),
        }
      ],
    };

    const buttonStyle = {
      justifyContent: 'center',
      alignItems: 'center',
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: this.props.buttonColor || this.props.btnColor,
    };

    if (position !== 'center') buttonStyle[position] = (this.props.parentSize-size)/2;

    const Touchable = getTouchableComponent(this.props.useNativeFeedback);

    return (
      <Animated.View pointerEvents="box-none" style={animatedViewStyle}>
        <Touchable
          background={touchableBackground}
          activeOpacity={this.props.activeOpacity || DEFAULT_ACTIVE_OPACITY}
          onPress={this.props.onPress}>
          <View
            style={[buttonStyle, !hideShadow && shadowStyle, this.props.style]}
          >
            {this.props.children}
          </View>
        </Touchable>
        {this._renderTitle()}
      </Animated.View>
    );
  }

  _renderTitle() {
    if (!this.props.title) return null;

    const { textContainerStyle, hideShadow, offsetX, parentSize, size, position, spaceBetween } = this.props;
    const offsetTop = Math.max((size / 2) - (TEXT_HEIGHT/2), 0);
    const positionStyles = { top: offsetTop };

    if (position !== 'center') {
      positionStyles[position] = offsetX + (parentSize-size)/2 + size + spaceBetween;
    } else {
      positionStyles.right = WIDTH/2 + size/2 + spaceBetween;
    }

    const textStyles = [styles.textContainer, positionStyles, textContainerStyle, !hideShadow && shadowStyle];

    return (
      <TextTouchable
        background={touchableBackground}
        activeOpacity={this.props.activeOpacity || DEFAULT_ACTIVE_OPACITY}
        onPress={this.props.onPress}>
        <View style={textStyles}>
          <Text style={[styles.text, this.props.textStyle]}>{this.props.title}</Text>
        </View>
      </TextTouchable>
    );
  }
}


const styles = StyleSheet.create({
  textContainer: {
    position: 'absolute',
    paddingVertical: (isAndroid ? 2 : 3),
    paddingHorizontal: 8,
    borderRadius: 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#eee',
    backgroundColor: 'white',
    height: TEXT_HEIGHT
  },
  text: {
    flex: 1,
    fontSize: 12,
    color: '#444',
  }
});
