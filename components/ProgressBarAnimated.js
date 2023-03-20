import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Button,
  Alert,
  Text,
  Image,
} from 'react-native';
 
import ProgressBarAnimated from 'react-native-progress-bar-animated';
 
export default class PBA extends React.Component {
 
  state = {
    progressWithOnComplete: 0,
    friendsReferred: 0,
  }
 
  increase = (key, value) => {
    if (this.state[key] + value <= 100) {
      this.setState({
        [key]: this.state[key] + value,
      });
    }
    else {
      this.setState({
        [key]: 100,
      });
    }
  }

  increase2 = (key) => {
    this.setState({
      [key]: this.state[key] + 1,
    });
  }
 
  render() {
    const barWidth = Dimensions.get('screen').width*0.5;
    const progressCustomStyles = {
      backgroundColor: 'white', 
      borderRadius: 10,
      borderColor: 'white',
      flex: 1,
    };
    var referred = () => {

    };
    // var [chestOpened, setChestOpened] = useState(false);
    var chestClosed = <Image
    resizeMode="cover"
    style={{
      width: "20%",
      height: "20%",
      // alignSelf: "center",
      aspectRatio: 1/1,
      // marginLeft: "10%",
      // marginRight: "10%",
    }}
    source={require("../images/chest-closed.png")}/>

    var chestOpened = <Image
    resizeMode="cover"
    style={{
      width: "20%",
      height: "20%",
      alignSelf: "center",
      aspectRatio: 1/1,
      // marginLeft: "10%",
      // marginRight: "10%",
    }}
    source={require("../images/chest-opened.png")}/>
 
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.label}> {this.props.numberReferrals} / 7 friends referred</Text>
          <View style={{flexDirection: 'row'}}>
              <ProgressBarAnimated
                  {...progressCustomStyles}
                  width={barWidth}
                  value={this.state.progressWithOnComplete}
                  backgroundColorOnComplete="white"
                  // onComplete={() => {
                  //  Alert.alert('Congrats!', 'You finished the referring quest!');
                  // }}
              />
              {this.state.progressWithOnComplete==100 && chestOpened 
              || this.state.progressWithOnComplete!=100 && chestClosed}
          </View>

          <View style={styles.buttonContainer}>
            <View style={styles.buttonInner}>
              <Button
                title="Increase 50%"
                onPress={ 
                  this.increase.bind(this, "progressWithOnComplete", 15)
                  // this.increase2.bind(this, "friendsReferred")
                }
                //onPressIn={ this.increase2.bind(this, "friendsReferred") }
              />
              <Button
                title="Increase 50%"
                onPress={ 
                  //this.increase.bind(this, "progressWithOnComplete", 15)
                  this.increase2.bind(this, "friendsReferred")
                }
                //onPressIn={ this.increase2.bind(this, "friendsReferred") }
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}
 
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: '#2bbdc3',
    marginTop: 50,
    padding: 15,
    //alignSelf: "center",
  },
  buttonContainer: {
    marginTop: 15,
  },
  separator: {
    marginVertical: 30,
    borderWidth: 0.5,
    borderColor: '#DCDCDC',
  },
  label: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});