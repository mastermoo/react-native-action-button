'use strict';

var React = require('react-native');
var {
  Component,
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
} = React;


let actionBtnWidth = 0;

class ActionButtonItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spaceBetween: 10,
      offsetTop: props.size > 42 ? 17 : 10,
    };

    if (!props.children || Array.isArray(props.children)) throw new Error("ActionButtonItem must have a Child component.");

    if(this.props.size > 0) actionBtnWidth = this.props.size;
  }

  render() {
    return (
      <Animated.View style={
        [
          styles.actionButtonWrap,
          {
            marginBottom: this.props.spacing,
            opacity: this.props.anim,
            transform: [
              {
                translateY: this.props.anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [40, 0]
                }),
              },
            ],
          }
        ]
      }>
        <TouchableOpacity style={{flex:1}} onPress={this.props.onPress}>
          <View style={[styles.actionButton, this.props.style, 
            { 
              width: actionBtnWidth, 
              height: actionBtnWidth, 
              borderRadius: actionBtnWidth/2,  
              backgroundColor: this.props.buttonColor || 'white'
            }
          ]}>
            {this.props.children}
          </View>
        </TouchableOpacity>
        <Text style={this.getTextStyles()}>{this.props.title}</Text>
      </Animated.View>
    );
  }

  getTextStyles() {
    let positionStyles = { 
      right: actionBtnWidth + this.state.spaceBetween, 
      top: this.state.offsetTop 
    }
    
    if (this.props.position == 'left') positionStyles = { 
      left: actionBtnWidth + this.state.spaceBetween, 
      top: this.state.offsetTop 
    }

    return [styles.actionText, positionStyles]
  }
}

var styles = StyleSheet.create({
  actionButtonWrap: {
    alignItems: 'center',
  },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 2,
  },
  actionText: {
    color: '#fff',
    fontFamily: 'Avenir',
    fontSize: 14,
    fontWeight: '600',
    position: 'absolute',
  },
});

module.exports = ActionButtonItem;