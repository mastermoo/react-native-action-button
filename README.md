# react-native-action-button
customizable multi-action-button component for react-native

![react-native-action-button demo](http://i.giphy.com/26BkMir9IcAhqe4EM.gif)

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
      <View style={{flex:1, backgroundColor: '#f3f3f3'}}>
        // Rest of App come ABOVE the action button component!
        <ActionButton buttonColor="rgba(231,76,60,1)">
          <ActionButton.Item buttonColor='#9b59b6' title="New Task" onPress={() => console.log("notes tapped!")}>
            <Icon name="android-create" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#3498db' title="Notifications" onPress={() => {}}>
            <Icon name="android-notifications-none" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#1abc9c' title="All Tasks" onPress={() => {}}>
            <Icon name="android-done-all" style={styles.actionButtonIcon} />
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
    color: 'white',
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
| autoInactive        | boolean 			| true 			 				| auto hide ActionButtons when ActionButton.Item pressed every time or not
| type    		  | string  	    |	"float" 		 				| either `float` (bigger btns) or `tab` (smaller btns) + position changes
| position 		  | string  	    |	"right" / "center" 	| one of: `left` `center` and `right`
| bgColor 			| string     	  | "transparent"	 			| background color when ActionButtons are visible
| buttonColor		| string     	  | "rgba(0,0,0,1)"			| background color of the +Button **(must be rgba value!)**
| spacing				| number 	   	  | 20									| spacing between the `ActionButton.Item`s
| offsetX				| number 	   	  | 10 / 30							| offset to the sides of the screen
| offsetY       | number        | 4 / 30              | offset to the bottom of the screen
| btnOutRange   | string        | props.buttonColor   | button background color to animate to
| outRangeScale | number 	   	  | 1	                	| changes size of button during animation

##### ActionButton.Item:
| Property      | Type        	| Default 		 				| Description |
| ------------- |:-------------:|:------------:				| ----------- |
| title    		  | string  	    |	undefined 					| the title shown next to the button, can be empty
| onPress 			| func  	   	  | null				 				| **required** function, triggers when a button is tapped
| buttonColor		| string     	  | same as + button  	| background color of the Button





