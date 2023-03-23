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
import { FlatList } from 'react-native-gesture-handler';
 
import ProgressBarAnimated from 'react-native-progress-bar-animated';
 
export default class PBA extends React.Component {
 
  state = {
    referralComplete: 7,
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
                <Text style={styles.label}>Referred and Attended: {"\n"} {this.props.numberReferrals} / 7</Text>
                <ProgressBarAnimated
                    {...progressCustomStyles}
                    width={barWidth}
                    value={this.props.referralsPercentages}
                    backgroundColorOnComplete="white"
                    // onComplete={() => {
                    //  Alert.alert('Congrats!', 'You finished the referring quest!');
                    // }}
                />
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
    marginBottom: 10,
  },
});