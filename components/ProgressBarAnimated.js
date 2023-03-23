import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Dimensions,
  Button,
  Alert,
  Text,
  Image,
} from 'react-native';
import * as Progress from 'react-native-progress';
 
export default class PBA extends React.Component {
 
  state = {
    referralComplete: 7,
  }
 
  render() {
    //this.referralProgressNumberToPercentage.bind(this);
    const barWidth = Dimensions.get('screen').width*0.5;
    const progressCustomStyles = {
      backgroundColor: 'black', 
      borderRadius: 10,
      borderColor: 'black',
      flex: 1,
    };
    // var [chestOpened, setChestOpened] = useState(false);
    var chestType = (
      this.props.numberReferrals < this.state.referralComplete
      )
      ? require('../images/chest-closed.png')
      : require('../images/chest-opened.png');
    var chest = <Image 
      // resizeMode="cover"
      style={{
        width: "25%",
        height: "25%",
        aspectRatio: 1/1,
        marginLeft: "5%",
        // marginRight: "10%",
      }}
      source={chestType} />;
 
    return (
      <View style={styles.container}>
        <View>
            {console.log("in PBA")} 
            {console.log(this.props.referralsPercentages)}
            <View style={{flexDirection: 'row'}}>
              <View>
                <Text style={styles.label}>Referred and Attended:</Text>
                <Text style={styles.label1}>{this.props.numberReferrals} / 7</Text>
                <Progress.Bar 
                  color="black" borderColor="black"
                  progress={this.props.numberReferrals/7} width={barWidth} />
              </View>
              {chest}
            </View>
        </View>
      </View>
    );
  }
}
 
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: '#2bbdc3',
    // marginTop: 50,
    // padding: 5,
    //alignSelf: "center",
  },
  label: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  label1: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 0,
    alignSelf: "center",
  },
});