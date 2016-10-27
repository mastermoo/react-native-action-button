# react-native-action-button
customizable multi-action-button component for react-native

![react-native-action-button demo](http://i.giphy.com/26BkMir9IcAhqe4EM.gif)
![react-native-action-button demo](http://i.giphy.com/xTcnTeW9BBXh8wMhLq.gif)
![react-native-action-button demo](http://i.giphy.com/l0K7psuhDQGLeT3d6.gif)
![react-native-action-button demo](http://i.giphy.com/xTcnSOtuet39cM46s0.gif)

### Installation
```bash
npm i react-native-action-button --save
```

### Usage

First, require it from your app's JavaScript files with:
```bash
import ActionButton from 'react-native-action-button';
```

##### ActionButton
`ActionButton` component is the main component which wraps everything and provides a couple of props (see Config below).

##### ActionButton.Item
`ActionButton.Item` specifies an Action Button. You have to include at least 1 `ActionButton.Item`.


### Example
_The following Basic example can be found in `example/Basic`._

```js
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';


class App extends Component {

  render() {
    return (
      <View style={{flex:1, backgroundColor: '#f3f3f3'}}>
        {/*Rest of App come ABOVE the action button component!*/}
        <ActionButton buttonColor="rgba(231,76,60,1)">
          <ActionButton.Item buttonColor='#9b59b6' title="New Task" onPress={() => console.log("notes tapped!")}>
            <Icon name="md-create" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#3498db' title="Notifications" onPress={() => {}}>
            <Icon name="md-notifications-off" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#1abc9c' title="All Tasks" onPress={() => {}}>
            <Icon name="md-done-all" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});
```

This will create a floating Button in the bottom right corner with 3 action buttons.
Also this example uses `react-native-vector-icons` for the button Icons.

### FAB Example
```js
<ActionButton
  buttonColor="rgba(231,76,60,1)"
  onPress={() => { console.log("hi")}}
/>
```

### Show/hide the FAB on scroll
Take a look at [this gist](https://gist.github.com/mmazzarolo/cfd467436f9d110e94a685b06eb3900f) for showing and hiding the floating action button depending on the scroll direction.

### Configuration

##### ActionButton:
| Property      | Type          | Default             | Description |
| ------------- |:-------------:|:------------:       | ----------- |
| active        | boolean       | false               | action buttons visible or not
| autoInactive  | boolean       | true                | Auto hide ActionButtons when ActionButton.Item is pressed.
| hideShadow    | boolean       | false               | use this to hide the default elevation and boxShadow
| position      | string        | "right" / "center"  | one of: `left` `center` and `right`
| bgColor       | string        | "transparent"       | background color when ActionButtons are visible
| buttonColor   | string        | "rgba(0,0,0,1)"     | background color of the +Button **(must be rgba value!)**
| spacing       | number        | 20                  | spacing between the `ActionButton.Item`s
| offsetX       | number        | 10 / 30             | offset to the sides of the screen
| offsetY       | number        | 4 / 30              | offset to the bottom of the screen
| btnOutRange   | string        | props.buttonColor   | button background color to animate to
| outRangeScale | number        | 1                   | changes size of button during animation
| onPress       | function      | null                | fires, when ActionButton is tapped
| onLongPress   | function      | null                | fires, when ActionButton is long pressed
| icon          | Component     | +                   | Custom component for ActionButton Icon
| backdrop      | Component     | false               | Custom component for use as Backdrop (i.e. [BlurView](https://github.com/react-native-fellowship/react-native-blur#blur-view), [VibrancyView](https://github.com/react-native-fellowship/react-native-blur#vibrancy-view))
| degrees       | number        | 135                 | degrees to rotate icon
| text          | string        | null                | use this to set a different text on the button
| buttonStyle   | style         | null                | use this to set the textstyle of the button's text
| onReset       | function      | null                | use this to set the callback that will be called after the button reset's it's items
| verticalOrientation | string  | "up"                | direction action buttons should expand.  One of: `up` or `down`
| backgroundTappable | boolean  | false               | make background tappable in active state of ActionButton

##### ActionButton.Item:
| Property      | Type          | Default             | Description |
| ------------- |:-------------:|:------------:       | ----------- |
| title         | string        | undefined           | the title shown next to the button, not shown when empty
| onPress       | func          | null                | **required** function, triggers when a button is tapped
| buttonColor   | string        | same as + button    | background color of the Button
| titleColor    | string        | "#444"              | color of title
| titleBgColor  | string        | "white"             | background color of title
| textContainerStyle  | style   | null                | use this to set the textstyle of the button's item text container
| textStyle     | style         | null                | use this to set the textstyle of the button's item text
| spaceBetween  | number        | 15                  | use this to set the space between the Button and the text container
