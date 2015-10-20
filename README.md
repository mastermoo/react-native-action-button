# react-native-action-button
customizable multi-action-button component for react-native

![react-native-action-button demo](http://i.giphy.com/3oEduOzHEUJHPnUWv6.gif)

### Installation
```bash
npm i react-native-action-button --save
```

### Usage

First, require it from your app's JavaScript files with:
```bash
var ActionButton = require('react-native-action-button');
```

##### ActionButton
`ActionButton` component is the main component which wraps everything and provides a couple of props (see Config below).

##### ActionButton.Item
`ActionButton.Item` specifies an Action Button. You have to include at least 1 `ActionButton.Item`.


### Example

```js
var React = require('react-native');
var { Component, Stylesheet, View, } = React;

var ActionButton = require('react-native-action-button'),
    Icon = require('react-native-vector-icons/Ionicons');


class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{flex:1}}>
        <ActionButton bgColor="rgba(23, 9, 107, 0.75)" buttonColor="rgba(63,159,107,1)">
          <ActionButton.Item title="New Task" onPress={() => console.log("new task tapped!")}>
            <Icon name="android-create" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item title="My Notifications" onPress={() => {}}>
            <Icon name="android-notifications-none" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'black',
  },
});
```

This will create a floating Button in the bottom right corner with 2 action buttons.
Also this example uses `react-native-vector-icons` for the button Icons.



### Configuration

##### ActionButton:
| Property      | Type        	| Default 		 				| Description |
| ------------- |:-------------:|:------------:				| ----------- |
| active        | boolean 			| false 			 				| action buttons visible or not
| type    		  | string  	    |	"float" 		 				| either `float` (bigger btns) or `tab` (smaller btns) + position changes
| position 		  | string  	    |	"right" / "center" 	| one of: `left` `center` and `right`
| bgColor 			| string     	  | "transparent"	 			| background color when ActionButtons are visible
| buttonColor		| string     	  | "rgba(0,0,0,1)"			| background color of the +Button **(must be rgba value!)**
| spacing				| number 	   	  | 20									| spacing between the `ActionButton.Item`s
| offsetX				| number 	   	  | 10 / 30							| offset to the sides of the screen
| offsetY				| number 	   	  | 4 / 30							| offset to the bottom of the screen

##### ActionButton.Item:
| Property      | Type        	| Default 		 				| Description |
| ------------- |:-------------:|:------------:				| ----------- |
| title    		  | string  	    |	undefined 					| the title shown next to the button
| onPress 			| func  	   	  | null				 				| **required** function, triggers when a button is tapped
| buttonColor		| string     	  | "white"							| background color of the Button





