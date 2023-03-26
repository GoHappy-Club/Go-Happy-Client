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
import { BackgroundImage } from 'react-native-elements/dist/config';
import * as Progress from 'react-native-progress';
 
const screenWidth = Dimensions.get("window").width;
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
            style={styles.progressBar}
            //animated={false}
            color="#b1f2f4" borderColor="#b1f2f4"
            progress={1.0} width={barWidth} height={barHeight} />
          {chestOpened}
          <Text style={styles.label2}>7/7</Text>
        </View>
      );
    }
    const ItemProfile = ({title}) => (
      <View style={styles.referralsItem}>
        {title.to!=this.props.trivialTitle1 
          &&<Image style={styles.profilePic} source={require('../images/profile_image-transparent.png')}/>}
      </View>
    );
    const ItemTo = ({title}) => (
      <View style={styles.referralsItem}>
        {title.to==this.props.trivialTitle1 ? (
          <Text style={styles.referralsTitle}>{title.to}</Text>
        ) : (
          <>
            <Text style={styles.referralsContents}>{title.to}</Text>
            <Text style={styles.referralsTime}>{title.time}</Text>
          </>
        )}
      </View>
    );
    const ItemAttend = ({title}) => (
      <View style={styles.referralsItem}>
        {title.hasAttendedSession==this.props.trivialTitle2 && <Text style={styles.referralsTitle}>Attended </Text> ||
         title.hasAttendedSession && 
          <Image style={{height: 15, width: 15, alignSelf: "center"}} source={require('../images/tick-icon.png')}></Image> 
          ||
         !title.hasAttendedSession && 
          <Image style={{height: 15, width: 15, alignSelf: "center"}} source={require('../images/hourglass.png')}></Image>
        }
      </View>
    );
 
    return (
      <View>
          <View style={styles.questContainer}>
            <Text style={styles.label}>Referral Quest</Text>
            <Text style={{fontSize: 15, marginLeft: 20, marginBottom: 5}}>
              ({openedChestCount} quest(s) completed)</Text>
            {/*chestComponents*/}  
            <View style={{flexDirection: 'row'}}>
              <Progress.Bar 
                style={styles.progressBar}
                color="#b1f2f4" borderColor="#b1f2f4"
                // indeterminateAnimationDuration={10000}
                progress={currentCount/7} width={barWidth} height={barHeight} />
              {chest}
              <Text style={styles.label2}>{currentCount}/7</Text>
            </View>
          </View>
          <View style={styles.statusListContainer}>
            <SafeAreaView style={styles.referralsList}>
              <View style={{flex:2}}>
                <FlatList 
                  data={this.props.referrals}
                  renderItem={({item}) => (<ItemProfile title={item}/>)}
                />
              </View>
              <View style={{flex:5}}>
                <FlatList 
                  data={this.props.referrals}
                  renderItem={({item}) => (<ItemTo title={item}/>)}
                />
              </View>
              <View style={{flex:2}}>
                <FlatList
                  data={this.props.referrals}
                  renderItem={({item}) => (<ItemAttend title={item}/>)}
                />
              </View>
            </SafeAreaView>
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
  progressBar: {
    borderRadius: 30,
    marginTop: 10,
    marginLeft: 20,
    marginBottom: 10,
  },
  label: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginLeft: 20,
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
  profilePic: {
    width: 40,
    height: 40,
    alignSelf: "center",
  },
  referralsList: {
    marginTop: 20,
    marginBottom: 10,
    marginRight: 10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  referralsItem: {
    // backgroundColor: '#29BFC2',
    // marginVertical: 8,
    height: 50,
    marginHorizontal: 0,
  },
  referralsTitle: {
    fontSize: 17,
    fontWeight: "bold",
  },
  referralsContents: {
    fontSize: 15,
    fontWeight: "bold",
  },
  referralsTime: {
    fontSize: 10,
  },
  questContainer: {
    backgroundColor: "#29BFC2",
    width: screenWidth*0.9,
    borderRadius: 20,
    marginBottom: 20,
  },
  statusListContainer: {
    backgroundColor: "#29BFC2",
    width: screenWidth*0.9,
    borderRadius: 20,
  },
});