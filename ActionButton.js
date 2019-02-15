import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  findNodeHandle,
  UIManager,
  Platform,
  AccessibilityInfo,
} from "react-native";
import ActionButtonItem from "./ActionButtonItem";
import {
  shadowStyle,
  alignItemsMap,
  getTouchableComponent,
  isAndroid,
  touchableBackground,
  DEFAULT_ACTIVE_OPACITY,
} from "./shared";

//////////////////////
// HELPER FUNCTIONS
//////////////////////

const focusOnView = (ref) => {
  if (!ref) {
    console.warn('ref is null');
    return;
  }
  const reactTag = findNodeHandle(ref);

  Platform.OS === 'android' ? UIManager.sendAccessibilityEvent(
      reactTag,
      8
  ) : AccessibilityInfo.setAccessibilityFocus(reactTag)
};

const filterActionButtons = (children) => {
  const actionButtons = !Array.isArray(children) ? [children] : children;
  return actionButtons.filter(actionButton => (typeof actionButton === 'object'));
};

export default class ActionButton extends Component {
  constructor(props) {
    super(props);

    const {
      children,
    } = props;

    this.state = {
      resetToken: props.resetToken,
      active: props.active,
    };

    const actionButtons = filterActionButtons(children);

    this.refIndexes = [];
    actionButtons.forEach((button, idx) => {
      this[`actionButton${idx}Ref`] = React.createRef();
      this.refIndexes.push(idx);
    });

    this.anim = new Animated.Value(props.active ? 1 : 0);
    this.timeout = null;
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillReceiveProps(nextProps) {
    const {
      resetToken,
      active,
    } = this.state;

    const {
      onReset,
    } = this.props;

    if (nextProps.resetToken !== resetToken) {
      if (nextProps.active === false && active === true) {
        if (onReset) {
          onReset();
        }
        Animated.spring(this.anim, { toValue: 0 }).start();
        setTimeout(() => {
          this.setState({
            active: false,
            resetToken: nextProps.resetToken,
          });
        }, 250);
        return;
      }

      if (nextProps.active === true && active === false) {
        Animated.spring(this.anim, { toValue: 1 }).start();
        this.setState({ active: true, resetToken: nextProps.resetToken });
        return;
      }

      this.setState({
        resetToken: nextProps.resetToken,
        active: nextProps.active,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      active,
    } = this.state;

    if (prevState.active !== active && active) {
      setTimeout(() => {
        this.focusOnTopActionButton();
      }, 500);
  
      setTimeout(() => {
        this.announceActionButtons();
      }, 3000);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
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
      // paddingHorizontal: this.props.offsetX,
      paddingVertical: this.props.offsetY
    };
  }

  getOverlayStyles() {
    return [
      styles.overlay,
      {
        elevation: this.props.elevation,
        zIndex: this.props.zIndex,
        justifyContent: this.props.verticalOrientation === "up"
          ? "flex-end"
          : "flex-start"
      }
    ];
  }

  //////////////////////
  // ACCESSIBILITY METHODS
  //////////////////////

  announceActionButtons() {
    const {
      children,
      announceActionsLabel,
    } = this.props;

    const actionButtons = filterActionButtons(children);

    const actionButtonsAccessibilityAnnouncement = actionButtons.reduce((acc, actionButton) => {
      return `${acc} ${actionButton.props.accessibilityLabel}, `;
    }, announceActionsLabel);

    if (actionButtons.length && Platform.OS === 'ios') {
      AccessibilityInfo.announceForAccessibility(actionButtonsAccessibilityAnnouncement);
    }
  }

  focusOnTopActionButton() {
    const {
      active,
    } = this.state;

    const actionButtonRefs = this.refIndexes.reduce((acc, refIdx) => {
      const buttonRef = this[`actionButton${refIdx}Ref`].current;
      if (!!buttonRef) {
        acc = [...acc, buttonRef];
      }
      return acc;
    }, []);
  
    if (active && actionButtonRefs.length) {
      focusOnView(actionButtonRefs[0]);
    }
  }

  //////////////////////
  // RENDER METHODS
  //////////////////////

  render() {
    return (
      <View
        pointerEvents="box-none"
        style={[this.getOverlayStyles(), this.props.style]}
      >
        <Animated.View
          pointerEvents="none"
          style={[
            this.getOverlayStyles(),
            {
              backgroundColor: this.props.bgColor,
              opacity: this.anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, this.props.bgOpacity]
              })
            }
          ]}
        >
          {this.props.backdrop}
        </Animated.View>
        <View
          pointerEvents="box-none"
          style={[
            this.getOverlayStyles(),
            this.getOrientation(),
            this.getOffsetXY()
          ]}
        >
          {this.state.active &&
            !this.props.backgroundTappable &&
            this._renderTappableBackground()}

          {this.props.verticalOrientation === "up" &&
            this.props.children &&
            this._renderActions()}
          {this._renderMainButton()}
          {this.props.verticalOrientation === "down" &&
            this.props.children &&
            this._renderActions()}
        </View>
      </View>
    );
  }


  _renderMainButton() {
    const animatedViewStyle = {
      transform: [
        {
          scale: this.anim.interpolate({
            inputRange: [0, 1],
            outputRange: [1, this.props.outRangeScale]
          })
        },
        {
          rotate: this.anim.interpolate({
            inputRange: [0, 1],
            outputRange: ["0deg", this.props.degrees + "deg"]
          })
        }
      ]
    };

    const wrapperStyle = {
      backgroundColor: this.anim.interpolate({
        inputRange: [0, 1],
        outputRange: [
          this.props.buttonColor,
          this.props.btnOutRange || this.props.buttonColor
        ]
      }),
      width: this.props.size,
      height: this.props.size,
      borderRadius: this.props.size / 2
    };

    const buttonStyle = {
      width: this.props.size,
      height: this.props.size,
      borderRadius: this.props.size / 2,
      alignItems: "center",
      justifyContent: "center"
    };

    const Touchable = getTouchableComponent(this.props.useNativeFeedback);
    const parentStyle = isAndroid &&
      this.props.fixNativeFeedbackRadius
      ? {
          right: this.props.offsetX,
          zIndex: this.props.zIndex,
          borderRadius: this.props.size / 2,
          width: this.props.size
        }
      : { marginHorizontal: this.props.offsetX, zIndex: this.props.zIndex };

    return (
      <View style={[
        parentStyle,
        !this.props.hideShadow && shadowStyle,
        !this.props.hideShadow && this.props.shadowStyle
      ]}
      >
        <Touchable
          testID={this.props.testID}
          accessible={this.props.accessible}
          accessibilityLabel={this.props.accessibilityLabel}
          background={touchableBackground(
            this.props.nativeFeedbackRippleColor,
            this.props.fixNativeFeedbackRadius
          )}
          activeOpacity={this.props.activeOpacity}
          onLongPress={this.props.onLongPress}
          onPress={() => {
            this.props.onPress();
            if (this.props.children) this.animateButton();
          }}
          onPressIn={this.props.onPressIn}
          onPressOut={this.props.onPressOut}
        >
          <Animated.View
            style={wrapperStyle}
          >
            <Animated.View style={[buttonStyle, animatedViewStyle]}>
              {this._renderButtonIcon()}
            </Animated.View>
          </Animated.View>
        </Touchable>
      </View>
    );
  }

  _renderButtonIcon() {
    const { icon, renderIcon, btnOutRangeTxt, buttonTextStyle, buttonText } = this.props;
    if (renderIcon) return renderIcon(this.state.active);
    if (icon) {
      console.warn('react-native-action-button: The `icon` prop is deprecated! Use `renderIcon` instead.');
      return icon;
    }

    const textColor = buttonTextStyle.color || "rgba(255,255,255,1)";

    return (
      <Animated.Text
        style={[
          styles.btnText,
          buttonTextStyle,
          {
            color: this.anim.interpolate({
              inputRange: [0, 1],
              outputRange: [textColor, btnOutRangeTxt || textColor]
            })
          }
        ]}
      >
        {buttonText}
      </Animated.Text>
    );
  }

  _renderActions() {
    const { children, verticalOrientation } = this.props;

    if (!this.state.active) return null;

    const actionButtons = filterActionButtons(children);

    const actionStyle = {
      flex: 1,
      alignSelf: "stretch",
      // backgroundColor: 'purple',
      justifyContent: verticalOrientation === "up" ? "flex-end" : "flex-start",
      paddingTop: this.props.verticalOrientation === "down"
        ? this.props.spacing
        : 0,
      zIndex: this.props.zIndex
    };

    return (
      <View style={actionStyle} pointerEvents={"box-none"}>
        {actionButtons.map((ActionButton, idx) => (
          <ActionButtonItem
            key={idx}
            anim={this.anim}
            {...this.props}
            {...ActionButton.props}
            buttonRef={this[`actionButton${idx}Ref`]}
            parentSize={this.props.size}
            btnColor={this.props.btnOutRange}
            onPress={() => {
              if (this.props.autoInactive) {
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

  animateButton(animate = true) {
    if (this.state.active) return this.reset();

    if (animate) {
      Animated.spring(this.anim, { toValue: 1 }).start();
    } else {
      this.anim.setValue(1);
    }

    this.setState({ active: true, resetToken: this.state.resetToken });
  }

  reset(animate = true) {
    if (this.props.onReset) this.props.onReset();

    if (animate) {
      Animated.spring(this.anim, { toValue: 0 }).start();
    } else {
      this.anim.setValue(0);
    }

    setTimeout(() => {
      if (this.mounted) {
        this.setState({ active: false, resetToken: this.state.resetToken });  
      }
    }, 250);
  }
}

ActionButton.Item = ActionButtonItem;

ActionButton.propTypes = {
  resetToken: PropTypes.any,
  active: PropTypes.bool,

  position: PropTypes.string,
  elevation: PropTypes.number,
  zIndex: PropTypes.number,

  hideShadow: PropTypes.bool,
  shadowStyle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.number
  ]),

  renderIcon: PropTypes.func,

  bgColor: PropTypes.string,
  bgOpacity: PropTypes.number,
  buttonColor: PropTypes.string,
  buttonTextStyle: Text.propTypes.style,
  buttonText: PropTypes.string,

  offsetX: PropTypes.number,
  offsetY: PropTypes.number,
  spacing: PropTypes.number,
  size: PropTypes.number,
  autoInactive: PropTypes.bool,
  onPress: PropTypes.func,
  onPressIn: PropTypes.func,
  onPressOut: PropTypes.func,
  backdrop: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  degrees: PropTypes.number,
  verticalOrientation: PropTypes.oneOf(["up", "down"]),
  backgroundTappable: PropTypes.bool,
  activeOpacity: PropTypes.number,

  useNativeFeedback: PropTypes.bool,
  fixNativeFeedbackRadius: PropTypes.bool,
  nativeFeedbackRippleColor: PropTypes.string,

  testID: PropTypes.string,
  accessibilityLabel: PropTypes.string,
  announceActionsLabel: PropTypes.string,
  accessible: PropTypes.bool
};

ActionButton.defaultProps = {
  resetToken: null,
  active: false,
  bgColor: "transparent",
  bgOpacity: 1,
  buttonColor: "rgba(0,0,0,1)",
  buttonTextStyle: {},
  buttonText: "+",
  spacing: 20,
  outRangeScale: 1,
  autoInactive: true,
  onPress: () => {},
  onPressIn: () => {},
  onPressOn: () => {},
  backdrop: false,
  degrees: 45,
  position: "right",
  offsetX: 30,
  offsetY: 30,
  size: 56,
  verticalOrientation: "up",
  backgroundTappable: false,
  useNativeFeedback: true,
  activeOpacity: DEFAULT_ACTIVE_OPACITY,
  fixNativeFeedbackRadius: false,
  nativeFeedbackRippleColor: "rgba(255,255,255,0.75)",
  testID: undefined,
  accessibilityLabel: undefined,
  announceActionsLabel: 'Available actions from top to bottom: ',
  accessible: undefined
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: "transparent"
  },
  btnText: {
    marginTop: -4,
    fontSize: 24,
    backgroundColor: "transparent"
  }
});