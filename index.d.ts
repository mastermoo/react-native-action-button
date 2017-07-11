import * as React from 'react';
import { TextStyle } from 'react-native';

export interface ActionButtonItemProps {
  active?: boolean,
  useNativeFeedback?: boolean,
  fixNativeFeedbackRadius?: boolean,
  nativeFeedbackRippleColor?: string,
  activeOpacity?: number
}

export interface ActionButtonProps {
  resetToken?: any,
  active?: boolean,

  position?: string,
  elevation?: number,
  zIndex?: number,

  hideShadow?: boolean,
  shadowStyle?: object | any[] | number,

  bgColor?: string,
  bgOpacity?: number,
  buttonColor?: string,
  buttonTextStyle?: TextStyle,
  buttonText?: string,

  offsetX?: number,
  offsetY?: number,
  spacing?: number,
  size?: number,
  autoInactive?: boolean,
  onPress?: () => void,
  background?: boolean | object,
  degrees?: number,
  verticalOrientation?: 'up' | 'down',
  backgroundTappable?: boolean,
  activeOpacity?: number,

  useNativeFeedback?: boolean,
  fixNativeFeedbackRadius?: boolean,
  nativeFeedbackRippleColor?: string
}

export default class ActionButton extends React.Component<ActionButtonItemProps, any> {
  public static Item: React.ComponentClass<ActionButtonItemProps>
}
