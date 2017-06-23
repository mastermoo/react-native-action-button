import {
  Platform,
  TouchableOpacity,
  TouchableNativeFeedback
} from "react-native";

export const DEFAULT_ACTIVE_OPACITY = 0.85;

export const shadowStyle = {
  shadowOpacity: 0.35,
  shadowOffset: {
    width: 0,
    height: 5
  },
  shadowColor: "#000",
  shadowRadius: 3,
  elevation: 5
};

export const alignItemsMap = {
  center: "center",
  left: "flex-start",
  right: "flex-end"
};

export const isAndroid = Platform.OS === "android";

export function getTouchableComponent(useNativeFeedback) {
  if (useNativeFeedback === true && isAndroid === true) {
    return TouchableNativeFeedback;
  }
  return TouchableOpacity;
}

export function touchableBackground(color, fixRadius) {
  if (isAndroid) {
    if (Platform["Version"] >= 21) {
      return TouchableNativeFeedback.Ripple(
        color || "rgba(255,255,255,0.75)",
        fixRadius
      );
    } else {
      TouchableNativeFeedback.SelectableBackground();
    }
  }
  return undefined;
}
