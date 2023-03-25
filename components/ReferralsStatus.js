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
  FlatList,
} from 'react-native';
import * as Progress from 'react-native-progress';
 
export default class PBA extends React.Component {
 
  state = {
    referralComplete: 7,
  }
 
  render() {
    //this.referralProgressNumberToPercentage.bind(this);
    const barHeight = 29;
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
            progress={1.0} width={barWidth} height={barHeight} />
          {chestOpened}
          <Text style={styles.label2}>7/7</Text>
        </View>
      );
    }
    const ItemTo = ({title}) => (
      <View style={styles.referralsItem}>
        {title.to==this.props.trivialTitle1 && <Text style={styles.referralsTitle}>{title.to}</Text> ||
         title.to!=this.props.trivialTitle1 && <Text style={styles.referralsContents}>{title.to}</Text>
        }
      </View>
    );
    const ItemAttend = ({title}) => (
      <View style={styles.referralsItem}>
        {title.hasAttendedSession==this.props.trivialTitle2 && <Text style={styles.referralsTitle}>Attended </Text> ||
         title.hasAttendedSession && <Text style={styles.referralsContents}>Yes </Text> ||
         !title.hasAttendedSession && <Text style={styles.referralsContents}>Not Yet </Text>
        }
      </View>
    );
 
    return (
      <View style={styles.container}>
        <View> 
          <Text style={styles.label}>Referral Quest {"\n"} ({this.props.numberReferrals} completed)</Text>
          {chestComponents}  
          <View style={{flexDirection: 'row'}}>
            <Progress.Bar 
              style={{borderRadius: 30,}}
              color="black" borderColor="black"
              // indeterminateAnimationDuration={10000}
              progress={currentCount/7} width={barWidth} height={barHeight} />
            {chest}
            <Text style={styles.label2}>{currentCount}/7</Text>
          </View>
          <View>
            <SafeAreaView style={styles.referralsList}>
              <FlatList 
                data={this.props.referrals}
                renderItem={({item}) => (<ItemTo title={item}/>)}
              />
              <FlatList
                data={this.props.referrals}
                renderItem={({item}) => (<ItemAttend title={item}/>)}
              />
            </SafeAreaView>
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
  },
  referralsList: {
    marginTop: 10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  referralsItem: {
    backgroundColor: 'white',
    // marginVertical: 8,
    marginHorizontal: 16,
  },
  referralsTitle: {
    fontSize: 17,
    fontWeight: "bold",
  },
  referralsContents: {
    fontSize: 15,
  },
});