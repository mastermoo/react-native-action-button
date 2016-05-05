import React, { Component } from 'react';
import { PropTypes, StyleSheet, Text, View, Animated, Easing, TouchableOpacity, PixelRatio } from 'react-native';
import ActionButtonItem from './ActionButtonItem';

const alignItemsMap = {
  "center" : "center",
  "left"  : "flex-start",
  "right" : "flex-end"
}

export default class ActionButton extends Component {

  constructor(props) {
    super(props);

    this.state = {
      active: props.active,
      type: props.type,
      bgColor: props.bgColor,
      buttonColor: props.buttonColor,
      buttonTextColor: props.buttonTextColor,
      spacing: props.spacing,
      btnOutRange: props.btnOutRange || props.buttonColor || 'rgba(0,0,0,1)',
      btnOutRangeTxt: props.btnOutRangeTxt || props.buttonTextColor || 'rgba(255,255,255,1)',
      outRangeScale: props.outRangeScale,
      anim: new Animated.Value(this.props.active ? 1 : 0),
      backdrop: props.backdrop
    }

    this.timeout = null;
    this.setPositionAndSizeByType();
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  setPositionAndSizeByType() {
    let position, offsetX, offsetY, size;

    if (this.state.type == 'tab') {
      position = 'center',
      offsetX  = 10,
      offsetY  = 4,
      size     = 42;
    } else {
      position = 'right',
      offsetX  = 30,
      offsetY  = 30,
      size     = 56;
    }

    this.state.position = this.props.position || position;
    this.state.offsetX  = this.props.offsetX  || offsetX ;
    this.state.offsetY  = this.props.offsetY  || offsetY;
    this.state.size     = this.props.size     || size;
  }


  //////////////////////
  // STYLESHEET GETTERS
  //////////////////////

  getContainerStyles() {
    return [styles.overlay, this.getOrientation(), this.getOffsetXY()];
  }

  getActionButtonStyles() {
    return [styles.actionBarItem, this.getButtonSize()];
  }

  getOrientation() {
    return { alignItems: alignItemsMap[this.state.position] };
  }

  getButtonSize() {
    return {
      width: this.state.size,
      height: this.state.size,
    }
  }

  getOffsetXY() {
    return {
      paddingHorizontal: this.state.offsetX,
      paddingBottom: this.state.offsetY
    };
  }

  getActionsStyle() {
    return [ styles.actionsVertical, this.getOrientation() ];
  }


  //////////////////////
  // RENDER METHODS
  //////////////////////

  render() {
    return (
      <View pointerEvents="box-none" style={styles.overlay}>
        <Animated.View pointerEvents="none" style={[styles.overlay, {
          backgroundColor: this.state.bgColor,
          opacity: this.state.anim
        }]}>
          {this.props.backdrop}
        </Animated.View>
        <View pointerEvents="box-none" style={this.getContainerStyles()}>
          {this.props.children && this._renderActions()}
          {this._renderButton()}
        </View>
      </View>
    );
  }

  _renderButton() {
    return (
      <View style={this.getActionButtonStyles()}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => {
            this.props.onPress()
            if (this.props.children) this.animateButton()
          }}>
          <Animated.View
            style={[styles.btn, {
              width: this.state.size,
              height: this.state.size,
              borderRadius: this.state.size / 2,
              backgroundColor: this.state.anim.interpolate({
                inputRange: [0, 1],
                outputRange: [this.state.buttonColor, this.state.btnOutRange]
              }),
              transform: [{
                  scale: this.state.anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, this.state.outRangeScale]
                  }),
                }, {
                  rotate: this.state.anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', this.props.icon ? '0deg' : '135deg']
                  })
                }],
            }]}>
            {this._renderButtonIcon()}
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  }

  _renderButtonIcon() {
    if (this.props.icon) return this.props.icon

    return (
      <Animated.Text style={[styles.btnText, {
        color: this.state.anim.interpolate({
          inputRange: [0, 1],
          outputRange: [this.state.buttonTextColor, this.state.btnOutRangeTxt]
        })
      }]}>
        +
      </Animated.Text>
    )
  }

  _renderActions() {
    if (!this.state.active) return null;

    let actionButtons = this.props.children

    if (!Array.isArray(this.props.children)) {
      actionButtons = [this.props.children]
    }

    return (
        <TouchableOpacity
          style={this.getActionsStyle()}
          activeOpacity={1}
          onPress={() => { this.reset() }}>
          {actionButtons.map((ActionButton, index) => {
            return (
              <ActionButtonItem
                key={index}
                position={this.state.position}
                spacing={this.state.spacing}
                anim={this.state.anim}
                size={this.state.size}
                btnColor={this.state.btnOutRange}
                {...ActionButton.props}
                onPress={() => {
                  if (this.props.autoInactive){
                    this.timeout = setTimeout(() => {
                      this.reset();
                    }, 200);
                  }
                  ActionButton.props.onPress();
                }}
              />
            )
          })}
        </TouchableOpacity>
    );
  }


  //////////////////////
  // Animation Methods
  //////////////////////

  animateButton() {
    if (this.state.active) return this.reset();

    Animated.spring(this.state.anim, {
       toValue: 1,
       duration: 250,
    }).start();

    this.setState({ active: true });
  }

  reset() {
    Animated.spring(this.state.anim, {
      toValue: 0,
      duration: 250,
    }).start();

    setTimeout(() => {
      this.setState({ active: false });
    }, 250);
  }
}

ActionButton.Item = ActionButtonItem;

ActionButton.propTypes = {
  active: PropTypes.bool,

  type: PropTypes.oneOf(['float', 'tab']),
  position: PropTypes.string,

  bgColor: PropTypes.string,
  buttonColor: PropTypes.string,
  buttonTextColor: PropTypes.string,

  offsetX : PropTypes.number,
  offsetY: PropTypes.number,
  spacing: PropTypes.number,
  size: PropTypes.number,
  autoInactive: PropTypes.bool,
  onPress: PropTypes.func,
  backdrop: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object
  ])
};

ActionButton.defaultProps = {
  active: false,
  type: 'float',
  bgColor: 'transparent',
  buttonColor: 'rgba(0,0,0,1)',
  buttonTextColor: 'rgba(255,255,255,1)',
  spacing: 20,
  outRangeScale: 1,
  autoInactive: true,
  onPress: () => {},
  backdrop: false
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  actionBarItem: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0, height: 1,
    },
    shadowColor: '#444',
    shadowRadius: 1,
  },
  btnText: {
    marginTop: -4,
    fontSize: 24,
    backgroundColor: 'transparent',
    position: 'relative',
  },
  actionsVertical: {
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'column',
  },
});
