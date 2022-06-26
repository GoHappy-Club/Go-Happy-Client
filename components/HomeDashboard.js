import React, {Component,useState, useEffect } from 'react';
import { FlatList,SafeAreaView,ScrollView,TouchableOpacity,TouchableHighlight,TouchableWithoutFeedback, StyleSheet, View, TextInput, Image, KeyboardAvoidingView,Pressable } from 'react-native';
import { Text, Badge, Icon, withBadge, Button } from 'react-native-elements';

import { Card as Cd, Title, Paragraph,  Avatar} from 'react-native-paper';
import { Dimensions } from 'react-native';
import CalendarDays from 'react-native-calendar-slider-carousel';
import {
  MaterialIndicator,
} from 'react-native-indicators';

import { connect } from 'react-redux';
import { setProfile } from '../redux/actions/counts.js';
import { bindActionCreators } from 'redux';
import firebase from '@react-native-firebase/app'


const { width: screenWidth } = Dimensions.get('window')


class HomeDashboard extends Component {
	constructor(props)
	{
		super(props);
		var today = new Date().toDateString();
		var todayRaw = new Date().setHours(0,0,0,0);
		this.state = {
			loader:false,
			selectedDate: today,
			email: null,
			bookingLoader:false,
			selectedDateRaw:todayRaw,
			profileImage: 'https://www.dmarge.com/wp-content/uploads/2021/01/dwayne-the-rock-.jpg'
		}
		//console.log(props);
		
		this._retrieveData();
	}
	_retrieveData = async () => {
		try {
		  const value = await AsyncStorage.getItem('email');
		  const phoneNumber = await AsyncStorage.getItem('phoneNumber');
		  if (value !== null) {
			// We have data!!
			this.setState({email:value});
			//console.log('get async',value);
		  }
		  if (phoneNumber !== null) {
			// We have data!!
			this.setState({phoneNumber:phoneNumber});
			//console.log('get async',phoneNumber);
		  }
		} catch (error) {
		  // Error retrieving data
		  //console.log('error here',error)
		}
	  };
	  async createDynamicReferralLink(){
		  let name="rakshit sharma";
		  let phone="919888138824";
		const link1 = await firebase.dynamicLinks().buildLink({
			link: 'https://gohappyclub.in/refer?idx='+name.substring(0,4)+phone.substring(2,4)+phone.substring(10,12),
			domainUriPrefix: 'https://gohappyclub.page.link',
		  });
		  console.log(link1);
		  alert(link1);
	  }
	changeSelectedDate = date => {
		this.createDynamicReferralLink();
		var select = new Date(Date.parse(date)).toDateString();
		var tempDate = new Date(Date.parse(date)).setHours(0,0,0,0);
		this.setState({
		  selectedDate: select
		 });
		 this.setState({selectedDateRaw:tempDate})
		 this.setState({events:[]});
		 console.log('in change date',tempDate); 

		 console.log('in change date',this.state.selectedDateRaw); 
		this.props.loadEvents(new Date(Date.parse(date)).setHours(0,0,0,0));
	  };
	trimContent(text,cut){
		if(text.length<cut)
			return text;
		return text.substring(0,cut)+'...';
	}
	updateEventBook(item){
		this.setState({bookingLoader:true});
		item.loadingButton=true;
		var _this = this;
		console.log('in update profile',this.state.selectedDateRaw);
		console.log('in update profile bookkkkk',this.props.profile);
		this.props.bookEvent(item,this.props.profile.phoneNumber,this.state.selectedDateRaw);

	}
	
	static getDerivedStateFromProps(nextProps, prevState) {
		if(nextProps.events!==prevState.events){
			return { events: nextProps.events};
		 }
		 else return null;
	}
	loadCaller(){
		this.props.loadEvents(this.state.selectedDateRaw);
	}

	sorry(){
		return (
			<Text  h4 style={{height:'100%',marginTop:'20%',alignSelf:'center',textAlign:'center',flex: 1,
			justifyContent: 'center',
			alignItems: 'center',color:'#2f2f31'}}>
				No Sessions Available 😟
			</Text>
		)
	}
	loadDate(item) {
		var dt = new Date(parseInt(item.startTime));
		var hours = dt.getHours() ; // gives the value in 24 hours format
		var AmOrPm = hours >= 12 ? 'pm' : 'am';
		hours = (hours % 12) || 12;
		var minutes = dt.getMinutes() ;
		if(hours<10){
			hours="0"+hours;
		}
		if(minutes<10){
			minutes="0"+minutes;
		}
		var finalTime = hours + ":" + minutes + " " + AmOrPm; 
		return finalTime;
	}
	
	render() {

		const {profile} = this.props;
		const renderItem = ({ item }) => (

			<Cd style={{...styles.card,marginLeft:30,marginRight:30,marginBottom:15,backgroundColor: '#29BFC2'}}>
				<TouchableOpacity style={{...styles.card,marginTop:10,backgroundColor:'#29BFC2'}} underlayColor={"#29BFC2"} onPress = {() => this.props.navigation.navigate('Session Details',{event:item,phoneNumber:profile.phoneNumber,
					onGoBack: () => this.loadCaller(),
				  }
				)}>

				<Cd.Content>
					<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', padding:4 }}>
						<View style={{ flex: 1, flexDirection: 'row'}}>
							<Badge value={item.category} badgeStyle={styles.badge} textStyle={{color:'#2f2f31'}}/>
							<Text style={{color:'white',fontSize:14, paddingLeft:4}}>
								{this.loadDate(item)} | 
							</Text>
							<Text style={{color:'white',fontSize:14, paddingLeft:4}}>
								{item.seatsLeft} seats left
							</Text>
						</View>
						{/* <FontAwesomeIcon style={styles.fav} icon={ test } color={ 'black' } size={20} />      */}
					</View>
					<Title style={{color:'white',fontSize:20, padding:4}}>{this.trimContent(item.eventName,30)}</Title>

					<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between',padding:4 }}>
						<View style={{ flex: 1, flexDirection: 'row'}}>
							<Avatar.Image
							source = {
								require('../images/profile_image.jpeg')
								// {
								// 	uri: this.state.profileImage
								// }
							}
							size={30}
							/>
							<Title style={{color:'white',fontSize:13,paddingLeft:10}}>{this.trimContent(item.expertName,17)}</Title>
						</View>
						{/* item.participantList!=null && item.participantList.includes(this.state.email) */}
						<Button
							disabled = {item.status!=null || (item.participantList!=null && item.participantList.includes(profile.phoneNumber))?true:false}
							title={item.status!=null || (item.participantList!=null && item.participantList.includes(profile.phoneNumber))?"Booked":"Book"}
							onPress={this.updateEventBook.bind(this,item)}
							loading={item.loadingButton}
							loadingProps={{ size: 'small', color: 'black' }}
							buttonStyle={{backgroundColor:'white'}}
							titleStyle={{color:'#2f2f31'}}
						/>
					</View>
				</Cd.Content>
				</TouchableOpacity>

			</Cd>
		  );
		return ( 
			
			<View style={{flex:1,backgroundColor:'white'}}>
			<CalendarDays
				numberOfDays={15}
				daysInView={3}
				paginate={true}
				onDateSelect={date => this.changeSelectedDate(date)}
			/>
			<Text h4 style={{marginLeft:30,marginTop:20,marginBottom:15,color:'#2f2f31'}}>{this.state.selectedDate}</Text>
				{this.props.childLoader==true && <MaterialIndicator color='#29BFC2'/>}
				{this.props.childLoader==false && this.props.events.length>0 && 
				<SafeAreaView style={{flex:1}}>
				
					<FlatList contentContainerStyle={{ flexGrow: 1 }}
						data={this.props.events}
						renderItem={renderItem}
						keyExtractor={item => item.id}
					/>
				
				</SafeAreaView>}
				{this.props.events.length==0 && this.props.childLoader==false 
				&& this.sorry()}
				{/* {wentBack ? 'do something it went back!' : 'it didnt go back'} */}
				</View>
			
		);
	}
}

const styles = StyleSheet.create({
	item: {
		width: screenWidth - 60,
		height: screenWidth - 60,
	},
	imageContainer: {
		flex: 1,
		marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
		backgroundColor: 'white',
		borderRadius: 8,
	},
	image: {
		...StyleSheet.absoluteFillObject,
		resizeMode: 'cover',
	},
	contentContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'lightgrey',
		paddingBottom: 50,
		margin:40
	  },
	container: {
	flex: 1,
	},
	card: {
		backgroundColor: "white",
		marginBottom: 10,
		borderRadius: 20,
		borderWidth: 1,
		borderColor: '#29BFC2',
	},
	badge: {
		backgroundColor:'white',
		alignSelf:'flex-start',
		color:'#29BFC2',
		// padding:4
	},
	fav: {
		alignSelf:'flex-start',
	},
	bookButton: {
		backgroundColor: 'green',
		
	}
});


const mapStateToProps = state => ({
	profile:state.profile.profile
  });

  const ActionCreators = Object.assign(
	{},
	{setProfile}
  );
  const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators(ActionCreators, dispatch),
  });
  export default connect(mapStateToProps, mapDispatchToProps)(HomeDashboard)