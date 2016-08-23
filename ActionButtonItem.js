import React, { Component } from 'react';
import { StyleSheet, Text, View, Animated, TouchableOpacity, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

const alignItemsMap = {
  center: "center",
  left: "flex-start",
  right: "flex-end"
}

export default class ActionButtonItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      spaceBetween: 15,
      alignItems: alignItemsMap[this.props.position]
    };

    if (!props.children || Array.isArray(props.children)) {
      throw new Error("ActionButtonItem must have a Child component.");
    }
  }

  render() {
    const translateXMap = {
      center: 0,
      left: (this.props.parentSize - this.props.size) / 2,
      right: -(this.props.parentSize - this.props.size) / 2,
    }

    const translateX = translateXMap[this.props.position];

    return (
      <Animated.View
        pointerEvents="box-none"
        style={[styles.actionButtonWrap, {
          alignItems: this.state.alignItems,
          marginBottom: (this.props.spacing < 12) ? 0 : (this.props.spacing - 12),
          opacity: this.props.anim,
          transform: [
            { translateX },
            {
              translateY: this.props.anim.interpolate({
                inputRange: [0, 1],
                outputRange: [40, 0]
              }),
            }
           ],
          }
        ]}
      >
        <TouchableOpacity
          style={{ flex:1 }}
          activeOpacity={this.props.activeOpacity || 0.85}
          onPress={this.props.onPress}
        >
          <View
            style={[styles.actionButton, this.props.style, {
              width: this.props.size,
              height: this.props.size,
              borderRadius: this.props.size / 2,
              backgroundColor: this.props.buttonColor || this.props.btnColor
            }]}
          >
            {this.props.children}
          </View>
        </TouchableOpacity>
        {this.props.title && (
          <TouchableOpacity
            style={this.getTextStyles()}
            activeOpacity={this.props.activeOpacity || 0.85}
            onPress={this.props.onPress}
          >
            <Text style={[styles.actionText, { color: this.props.titleColor || '#444' }]}>
              {this.props.title}
            </Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    );
  }

  getTextStyles() {
    // to align the center of the label with the center of the button,
    // offset = (half the size of the btn) - (half the size of the label)
    let offsetTop = this.props.size >= 28 ? (this.props.size / 2) - 14 : 0;

    let positionStyles = {
      right: this.props.size + this.state.spaceBetween,
      top: offsetTop
    }

    let bgStyle = { backgroundColor : 'white' };

    if (this.props.titleBgColor) bgStyle = {
      backgroundColor:this.props.titleBgColor
    }

    if (this.props.position == 'left') positionStyles = {
      left: this.props.size + this.state.spaceBetween,
      top: offsetTop
    }

    if (this.props.position == 'center') positionStyles = {
      right: this.props.size/2 + width/2 + this.state.spaceBetween,
      top: offsetTop
    }

    return [styles.actionTextView, positionStyles, bgStyle];
  }
}

const styles = StyleSheet.create({
  actionButtonWrap: {
    width
  },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 2,
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0, height: 1,
    },
    shadowColor: '#444',
    shadowRadius: 1,
    elevation: 6,
    marginBottom: 12,
  },
  actionTextView: {
    position: 'absolute',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 3,
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0, height: 1,
    },
    shadowColor: '#444',
    shadowRadius: 1,
  },
  actionText: {
    flex: 1,
    fontSize: 14,
  }
});
