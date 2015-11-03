'use strict';

var React = require('react-native');
var {
  Component,
  StyleSheet,
  Text,
  View,
  Animated,
  Easing,
  TouchableOpacity,
} = React;


let actionBtnWidth = 0;

class ActionButtonItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spaceBetween: 15,
      offsetTop: props.size > 42 ? 14 : 10,
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
              backgroundColor: this.props.buttonColor || this.props.btnColor
            }
          ]}>
            {this.props.children}
          </View>
        </TouchableOpacity>
        <View style={this.getTextStyles()}>
          <Text style={styles.actionText}>{this.props.title}</Text>
        </View>
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

    return [styles.actionTextView, positionStyles]
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
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0, height: 1,
    },
    shadowColor: '#444',
    shadowRadius: 1,
  },
  actionTextView: {
    position: 'absolute',
    backgroundColor: 'white',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 3,
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0, height: 1,
    },
    shadowColor: '#444',
    shadowRadius: 1,
  },
  actionText: {
    color: '#444',
    fontSize: 14,
  }
});

module.exports = ActionButtonItem;