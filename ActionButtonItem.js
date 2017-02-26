import React, { Component, PropTypes } from 'react';
import { StyleSheet, Text, View, Animated, TouchableOpacity } from 'react-native';
import { SHADOW_SIZE, shadowStyle, alignItemsMap, positionMap } from './shared';

export default class ActionButtonItem extends Component {
  static get defaultProps() {
    return {
      active: true,
      spaceBetween: 15
    };
  }

  static get propTypes() {
    return {
      active: PropTypes.bool,
    }
  }

  render() {
    const {
      active, parentSize, size, anim, position, verticalOrientation,
      activeOpacity, onPress, hideShadow, style, buttonColor, btnColor,
      actionButtons, idx, spacing, children
    } = this.props;

    if (!active) return null;

    const animatedViewStyle = {
      backgroundColor: 'transparent',
      height: size,
      margin: SHADOW_SIZE,
      opacity: anim,
      transform: [
        {
          translateY: anim.interpolate({
            inputRange: [0, 1],
            outputRange: [verticalOrientation === 'down' ? -40 : 40, 0]
          }),
        }
      ],
    };

    if (verticalOrientation === 'up')
      animatedViewStyle.top = SHADOW_SIZE + (SHADOW_SIZE*2 - spacing) * (actionButtons-idx);
    
    if (verticalOrientation === 'down')
      animatedViewStyle.top = -SHADOW_SIZE - (SHADOW_SIZE*2 - spacing) * (idx+1);
    
    if (position !== 'center')
      animatedViewStyle[position] = -SHADOW_SIZE + (parentSize-size)/2;

    return (
      <Animated.View pointerEvents="box-none" style={animatedViewStyle}>
        <TouchableOpacity
          style={{ width: size, height: size, borderRadius: size/2 }}
          activeOpacity={activeOpacity || 0.85}
          onPress={onPress}>
          <View
            style={[!hideShadow && shadowStyle, style, {
              justifyContent: 'center',
              alignItems: 'center',
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: buttonColor || btnColor,
            }]}
          >
            {children}
          </View>
        </TouchableOpacity>
        {this._renderTitle()}
      </Animated.View>
    );
  }

  _renderTitle() {
    const { title, textContainerStyle, hideShadow, activeOpacity, onPress, textStyle } = this.props;

    if (!title) return null;

    return (
      <TouchableOpacity style={this.getTextStyles()} activeOpacity={activeOpacity || 0.85} onPress={onPress}>
        <Text style={[styles.text, textStyle]}>{title}</Text>
      </TouchableOpacity>
    );
  }

  getTextStyles() {
    const { size, position, spaceBetween, textContainerStyle, hideShadow } = this.props;
    const offsetTop = Math.max((size / 2) - (TEXT_HEIGHT/2), 0);
    const textMap = {
      left: 'left',
      center: 'right',
      right: 'right'
    };

    const positionStyles = { top: offsetTop };
    positionStyles[textMap[position]] = size + spaceBetween;

    return [styles.textContainer, positionStyles, textContainerStyle, !hideShadow && shadowStyle];
  }
}

const TEXT_HEIGHT = 26;

const styles = StyleSheet.create({
  textContainer: {
    position: 'absolute',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#eee',
    backgroundColor: 'white',
    height: TEXT_HEIGHT
  },
  text: {
    flex: 1,
    fontSize: 14,
    color: '#444',
  }
});
