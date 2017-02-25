import React, { Component, PropTypes } from 'react';
import { StyleSheet, Text, View, Animated, TouchableOpacity } from 'react-native';
import ActionButtonItem from './ActionButtonItem';
import { SHADOW_SIZE, shadowStyle, alignItemsMap, positionMap } from './shared';


export default class ActionButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: props.active,
    }

    this.anim = new Animated.Value(props.active ? 1 : 0);
    this.timeout = null;
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }


  //////////////////////
  // STYLESHEET GETTERS
  //////////////////////

  getOrientation() {
    return { alignItems: alignItemsMap[this.props.position] };
  }

  getOffsetXY() {
    return {
      paddingHorizontal: this.props.offsetX,
      paddingVertical: this.props.offsetY
    };
  }

  getOverlayStyles() {
    return [
      styles.overlay,
      {
        justifyContent: this.props.verticalOrientation === 'up' ? 'flex-end' : 'flex-start'
      }
    ]
  }


  //////////////////////
  // RENDER METHODS
  //////////////////////

  render() {
    return (
      <View pointerEvents="box-none" style={this.getOverlayStyles()}>
        <Animated.View pointerEvents="none" style={[this.getOverlayStyles(), {
          backgroundColor: this.props.bgColor,
          opacity: this.anim
        }]}>
          {this.props.backdrop}
        </Animated.View>
        <View pointerEvents="box-none" style={[this.getOverlayStyles(), this.getOrientation(), this.getOffsetXY()]}>
          {(this.state.active && !this.props.backgroundTappable) && this._renderTappableBackground()}

          {this.props.verticalOrientation === 'up' &&
            this.props.children && this._renderActions()}
          {this._renderMainButton()}
          {this.props.verticalOrientation === 'down' &&
            this.props.children && this._renderActions()}
        </View>
      </View>
    );
  }

  _renderMainButton() {
    const animatedViewStyle = {
      backgroundColor: this.anim.interpolate({
        inputRange: [0, 1],
        outputRange: [this.props.buttonColor, (this.props.btnOutRange || this.props.buttonColor)]
      }),
      transform: [{
        scale: this.anim.interpolate({
          inputRange: [0, 1],
          outputRange: [1, this.props.outRangeScale]
        }),
      }, {
        rotate: this.anim.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', this.props.degrees + 'deg']
        })
      }],
    };

    const touchableStyle = {
      width: this.props.size,
      height: this.props.size,
      margin: SHADOW_SIZE,
      borderRadius: this.props.size / 2,
      ...positionMap(this.props.position, this.props.verticalOrientation)
    }

    const buttonStyle = {
      width: this.props.size,
      height: this.props.size,
      borderRadius: this.props.size / 2,
      alignItems: 'center',
      justifyContent: 'center',
    }

    return (
      <TouchableOpacity
        style={[touchableStyle, !this.props.hideShadow && shadowStyle]}
        activeOpacity={0.85}
        onLongPress={this.props.onLongPress}
        onPress={() => {
          this.props.onPress()
          if (this.props.children) this.animateButton()
        }}>
        <Animated.View style={[buttonStyle, animatedViewStyle]}>
          {this._renderButtonIcon()}
        </Animated.View>
      </TouchableOpacity>
    );
  }

  _renderButtonIcon() {
    const { icon, btnOutRangeTxt, buttonTextColor } = this.props;
    if (icon) return icon;

    return (
      <Animated.Text style={[styles.btnText, {
        color: this.anim.interpolate({
          inputRange: [0, 1],
          outputRange: [buttonTextColor, (btnOutRangeTxt || buttonTextColor)]
        })
      }]}>
        +
      </Animated.Text>
    )
  }

  _renderActions() {
    const { children, verticalOrientation } = this.props;

    if (!this.state.active) return null;

    const actionButtons = !Array.isArray(children) ? [children] : children;

    const actionStyle = {
      flex: 1,
      justifyContent: verticalOrientation === 'up' ? 'flex-end' : 'flex-start',
    };

    return (
      <View style={[this.getOrientation(), actionStyle]} pointerEvents={'box-none'}>
        {actionButtons.map((ActionButton, idx) => (
          <ActionButtonItem
            key={idx}
            idx={idx}
            anim={this.anim}
            {...this.props}
            {...ActionButton.props}
            actionButtons={actionButtons.length}
            parentSize={this.props.size}
            btnColor={this.props.btnOutRange}
            onPress={() => {
              if (this.props.autoInactive){
                this.timeout = setTimeout(this.reset.bind(this), 200);
              }
              ActionButton.props.onPress();
            }}
          />
        ))}
      </View>
    );
  }

  _renderTappableBackground() {
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={this.getOverlayStyles()}
        onPress={this.reset.bind(this)}
      />
    );
  }


  //////////////////////
  // Animation Methods
  //////////////////////

  animateButton(animate=true) {
    if (this.state.active) return this.reset();

    if (animate) {
      Animated.spring(this.anim, { toValue: 1 }).start();
    } else {
      this.anim.setValue(1);
    }

    this.setState({ active: true });
  }

  reset(animate=true) {
    if (this.props.onReset) this.props.onReset();

    if (animate) {
      Animated.spring(this.anim, { toValue: 0 }).start();
    } else {
      this.anim.setValue(0);
    }

    setTimeout(() => this.setState({ active: false }), 250);
  }
}

ActionButton.Item = ActionButtonItem;

ActionButton.propTypes = {
  active: PropTypes.bool,

  position: PropTypes.string,

  hideShadow: PropTypes.bool,

  bgColor: PropTypes.string,
  buttonColor: PropTypes.string,
  buttonTextColor: PropTypes.string,

  offsetX: PropTypes.number,
  offsetY: PropTypes.number,
  spacing: PropTypes.number,
  size: PropTypes.number,
  autoInactive: PropTypes.bool,
  onPress: PropTypes.func,
  backdrop: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object
  ]),
  degrees: PropTypes.number,
  verticalOrientation: PropTypes.oneOf(['up', 'down']),
  backgroundTappable: PropTypes.bool,
};

ActionButton.defaultProps = {
  active: false,
  bgColor: 'transparent',
  buttonColor: 'rgba(0,0,0,1)',
  buttonTextColor: 'rgba(255,255,255,1)',
  spacing: 20,
  outRangeScale: 1,
  autoInactive: true,
  onPress: () => {},
  backdrop: false,
  degrees: 135,
  position: 'right',
  offsetX: 30,
  offsetY: 30,
  size: 56,
  verticalOrientation: 'up',
  backgroundTappable: false,
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: 'transparent',
  },
  btnText: {
    marginTop: -4,
    fontSize: 24,
    backgroundColor: 'transparent',
    position: 'relative',
  },
});
