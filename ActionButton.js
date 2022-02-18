import React, { Component, useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity
} from "react-native";
import ActionButtonItem from "./ActionButtonItem";
import {
  shadowStyle,
  alignItemsMap,
  getTouchableComponent,
  isAndroid,
  touchableBackground,
  DEFAULT_ACTIVE_OPACITY
} from "./shared";

const ActionButton = props => {
  const [, setResetToken] = useState(props.resetToken);
  const [active, setActive] = useState(props.active);
  const anim = useRef(new Animated.Value(props.active ? 1 : 0));
  const timeout = useRef(null);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
      timeout.current && clearTimeout(timeout.current);
    };
  }, []);

  useEffect(() => {
    if (props.active) {
      Animated.spring(anim.current, { toValue: 1 }).start();
      setActive(true);
      setResetToken(props.resetToken);
    } else {
      props.onReset && props.onReset();

      Animated.spring(anim.current, { toValue: 0 }).start();
      timeout.current = setTimeout(() => {
        setActive(false);
        setResetToken(props.resetToken);
      }, 250);
    }
  }, [props.resetToken, props.active]);

  //////////////////////
  // STYLESHEET GETTERS
  //////////////////////

  const getOrientation = () => {
    return { alignItems: alignItemsMap[props.position] };
  };

  const getOffsetXY = () => {
    return {
      // paddingHorizontal: props.offsetX,
      paddingVertical: props.offsetY
    };
  };

  const getOverlayStyles = () => {
    return [
      styles.overlay,
      {
        elevation: props.elevation,
        zIndex: props.zIndex,
        justifyContent:
          props.verticalOrientation === "up" ? "flex-end" : "flex-start"
      }
    ];
  };

  const _renderMainButton = () => {
    const animatedViewStyle = {
      transform: [
        {
          scale: anim.current.interpolate({
            inputRange: [0, 1],
            outputRange: [1, props.outRangeScale]
          })
        },
        {
          rotate: anim.current.interpolate({
            inputRange: [0, 1],
            outputRange: ["0deg", props.degrees + "deg"]
          })
        }
      ]
    };

    const wrapperStyle = {
      backgroundColor: anim.current.interpolate({
        inputRange: [0, 1],
        outputRange: [props.buttonColor, props.btnOutRange || props.buttonColor]
      }),
      width: props.size,
      height: props.size,
      borderRadius: props.size / 2
    };

    const buttonStyle = {
      width: props.size,
      height: props.size,
      borderRadius: props.size / 2,
      alignItems: "center",
      justifyContent: "center"
    };

    const Touchable = getTouchableComponent(props.useNativeFeedback);
    const parentStyle =
      isAndroid && props.fixNativeFeedbackRadius
        ? {
            right: props.offsetX,
            zIndex: props.zIndex,
            borderRadius: props.size / 2,
            width: props.size
          }
        : { marginHorizontal: props.offsetX, zIndex: props.zIndex };

    return (
      <View
        style={[
          parentStyle,
          !props.hideShadow && shadowStyle,
          !props.hideShadow && props.shadowStyle
        ]}
      >
        <Touchable
          testID={props.testID}
          accessible={props.accessible}
          accessibilityLabel={props.accessibilityLabel}
          background={touchableBackground(
            props.nativeFeedbackRippleColor,
            props.fixNativeFeedbackRadius
          )}
          activeOpacity={props.activeOpacity}
          onLongPress={props.onLongPress}
          onPress={() => {
            props.onPress();
            if (props.children) animateButton();
          }}
          onPressIn={props.onPressIn}
          onPressOut={props.onPressOut}
        >
          <Animated.View style={wrapperStyle}>
            <Animated.View style={[buttonStyle, animatedViewStyle]}>
              {_renderButtonIcon()}
            </Animated.View>
          </Animated.View>
        </Touchable>
      </View>
    );
  };

  const _renderButtonIcon = () => {
    const {
      icon,
      renderIcon,
      btnOutRangeTxt,
      buttonTextStyle,
      buttonText
    } = props;
    if (renderIcon) return renderIcon(active);
    if (icon) {
      console.warn(
        "react-native-action-button: The `icon` prop is deprecated! Use `renderIcon` instead."
      );
      return icon;
    }

    const textColor = buttonTextStyle.color || "rgba(255,255,255,1)";

    return (
      <Animated.Text
        style={[
          styles.btnText,
          buttonTextStyle,
          {
            color: anim.current.interpolate({
              inputRange: [0, 1],
              outputRange: [textColor, btnOutRangeTxt || textColor]
            })
          }
        ]}
      >
        {buttonText}
      </Animated.Text>
    );
  };

  const _renderActions = () => {
    const { children, verticalOrientation } = props;

    if (!active) return null;

    let actionButtons = !Array.isArray(children) ? [children] : children;

    actionButtons = actionButtons.filter(
      actionButton => actionButton && typeof actionButton == "object"
    );

    const actionStyle = {
      flex: 1,
      alignSelf: "stretch",
      // backgroundColor: 'purple',
      justifyContent: verticalOrientation === "up" ? "flex-end" : "flex-start",
      paddingTop: props.verticalOrientation === "down" ? props.spacing : 0,
      zIndex: props.zIndex
    };

    return (
      <View style={actionStyle} pointerEvents={"box-none"}>
        {actionButtons.map((ActionButton, idx) => (
          <ActionButtonItem
            key={idx}
            anim={anim.current}
            {...props}
            {...ActionButton.props}
            parentSize={props.size}
            btnColor={props.btnOutRange}
            onPress={() => {
              if (props.autoInactive) {
                timeout.current = setTimeout(reset, 200);
              }
              ActionButton.props.onPress();
            }}
          />
        ))}
      </View>
    );
  };

  const _renderTappableBackground = () => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={getOverlayStyles()}
        onPress={reset}
      />
    );
  };

  //////////////////////
  // Animation Methods
  //////////////////////

  const animateButton = (animate = true) => {
    if (active) return reset(animate);

    if (animate) {
      Animated.spring(anim.current, { toValue: 1 }).start();
    } else {
      anim.current.setValue(1);
    }

    setActive(true);
  };

  const reset = (animate = true) => {
    if (props.onReset) props.onReset();

    if (animate) {
      Animated.spring(anim.current, { toValue: 0 }).start();
    } else {
      anim.current.setValue(0);
    }

    timeout.current = setTimeout(() => {
      if (mounted.current) {
        setActive(false);
      }
    }, 250);
  };

  return (
    <View pointerEvents="box-none" style={[getOverlayStyles(), props.style]}>
      <Animated.View
        pointerEvents="none"
        style={[
          getOverlayStyles(),
          {
            backgroundColor: props.bgColor,
            opacity: anim.current.interpolate({
              inputRange: [0, 1],
              outputRange: [0, props.bgOpacity]
            })
          }
        ]}
      >
        {props.backdrop}
      </Animated.View>
      <View
        pointerEvents="box-none"
        style={[getOverlayStyles(), getOrientation(), getOffsetXY()]}
      >
        {active && !props.backgroundTappable && _renderTappableBackground()}

        {props.verticalOrientation === "up" &&
          props.children &&
          _renderActions()}
        {_renderMainButton()}
        {props.verticalOrientation === "down" &&
          props.children &&
          _renderActions()}
      </View>
    </View>
  );
};

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
export default ActionButton;
