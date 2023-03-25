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
    const openedChestCount = Math.floor(this.props.numberReferrals/7);
    const currentCount = this.props.numberReferrals - (openedChestCount*7);
    // var [chestOpened, setChestOpened] = useState(false);
    var chestType = (
      currentCount < this.state.referralComplete
      )
      ? require('../images/chest-closed.png')
      : require('../images/chest-opened.png');
    var chest = <Image 
      // resizeMode="cover"
      style={styles.chest}
      source={chestType} />;
    var chestOpened = <Image
      // resizeMode="cover"
      style={styles.chest}
      source={require('../images/chest-opened.png')} />;    
    // getting number of rounds

    const chestComponents = [];
    for (let i=0; i < openedChestCount; i++){
      chestComponents.push(
        <View style={{flexDirection: 'row', marginBottom: 10}}>
          <Progress.Bar 
            style={{borderRadius: 30,}}
            //animated={false}
            color="black" borderColor="black"
            progress={1.0} width={barWidth} height={29} />
          {chestOpened}
          <Text style={styles.label2}>7/7</Text>
        </View>
      );
    }
 
    return (
      <View style={styles.container}>
        <View> 
          <Text style={styles.label}>Referral Quest {"\n"} ({this.props.numberReferrals} completed)</Text>
          {chestComponents}  
          <View style={{flexDirection: 'row'}}>
            <Progress.Bar 
              style={{borderRadius: 30,}}
              color="black" borderColor="black"
              progress={currentCount/7} width={barWidth} height={29} />
            {chest}
            <Text style={styles.label2}>{currentCount}/7</Text>
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
  label2: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 20,
    alignSelf: "center",
  },
  chest: {
    width: 29,
    height: 29,
    aspectRatio: 1/1,
    marginLeft: "5%",
    alignSelf: "center",
  }
});