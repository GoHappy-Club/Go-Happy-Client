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
    referralComplete: 7,
    referralProgressInPercentage: 0,
  }

  componentDidUpdate(prevProps, prevState){
    //console.log("before modification percentage:")
    //console.log(this.state.referralProgressInPercentage);
    //console.log(this.props.numberReferrals);
    if (
      this.props.numberReferrals !== prevProps.numberReferrals ||
      this.state.referralProgressInPercentage !== prevState.referralProgressInPercentage
    ){
      if (this.props.numberReferrals <= 6 && this.props.numberReferrals >= 0) {
        this.setState({referralProgressInPercentage: this.props.numberReferrals*15})
      }
      else if (this.props.numberReferrals >= 7) {
        this.setState({referralProgressInPercentage: 100})
      }
      else {
        this.setState({referralProgressInPercentage: 0})
      }
    //console.log("modified percentage:")
    //console.log(this.state.referralProgressInPercentage);
    }
  }
 
  render() {
    //this.referralProgressNumberToPercentage.bind(this);
    const barWidth = Dimensions.get('screen').width*0.5;
    const progressCustomStyles = {
      backgroundColor: 'white', 
      borderRadius: 10,
      borderColor: 'white',
      flex: 1,
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
                  value={this.state.referralProgressInPercentage}
                  backgroundColorOnComplete="white"
                  // onComplete={() => {
                  //  Alert.alert('Congrats!', 'You finished the referring quest!');
                  // }}
              />
              {this.props.numberReferrals==this.state.referralComplete && chestOpened 
              || this.props.numberReferrals!=this.state.referralComplete && chestClosed}
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