import React, {Component,useState, useEffect } from 'react';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards';
import { FlatList,SafeAreaView,ScrollView,TouchableOpacity,TouchableHighlight,TouchableWithoutFeedback, StyleSheet, View, TextInput, Image, KeyboardAvoidingView,Pressable } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import { Text, Badge, Icon, withBadge, Button } from 'react-native-elements';
import AnimateLoadingButton from 'react-native-animate-loading-button';

import { Card as Cd, Title, Paragraph,  Avatar,
	Caption,
	Drawer,
	TouchableRipple,
	Switch } from 'react-native-paper';
import Carousel, { ParallaxImage } from 'react-native-snap-carousel';
import { Dimensions } from 'react-native';
import { CirclesLoader, PulseLoader, TextLoader, DotsLoader } from 'react-native-indicator';
import CalendarDays from 'react-native-calendar-slider-carousel';
import { DefaultTheme } from '@react-navigation/native';
import { faHome,faHistory,faHeart as test,faClipboardList } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import ListItemSwipeable from 'react-native-elements/dist/list/ListItemSwipeable';
import {
  MaterialIndicator,
} from 'react-native-indicators';
const { width: screenWidth } = Dimensions.get('window')


export default class HomeDashboard extends Component {
	constructor(props)
	{
		super(props);
		var today = new Date().toDateString();
		this.state = {
			loader:false,
			selectedDate: today,
			email: null,
			bookingLoader:false,
			selectedDateRaw:null,
			profileImage: 'https://www.dmarge.com/wp-content/uploads/2021/01/dwayne-the-rock-.jpg'
		}
		console.log(props);
		
		this._retrieveData();
	}
	_retrieveData = async () => {
		try {
		  const value = await AsyncStorage.getItem('email');
		  if (value !== null) {
			// We have data!!
			this.setState({email:value});
			console.log('get async',value);
		  }
		} catch (error) {
		  // Error retrieving data
		  console.log('error here',error)
		}
	  };
	changeSelectedDate = date => {
		var select = new Date(Date.parse(date)).toDateString();
		this.setState({
		  selectedDate: select,
		  selectedDateRaw:new Date(Date.parse(date)).setHours(0,0,0,0)
		 });
		 this.setState({events:[]});
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
		this.props.bookEvent(item,this.state.email,this.state.selectedDateRaw);

	}
	
	static getDerivedStateFromProps(nextProps, prevState) {
		if(nextProps.events!==prevState.events){
			return { events: nextProps.events};
		 }
		 else return null;
	}
	
	render() {
		// const wentBack = this.props.route.params.wentBack;
		// this.props.navigation.navigate('Session Details')
		const renderItem = ({ item }) => (

			<Cd style={{...styles.card,marginLeft:30,marginRight:30,marginBottom:15,backgroundColor: '#3D5466'}}>
				<TouchableOpacity style={{...styles.card,marginTop:10,backgroundColor:'#3D5466'}} underlayColor={"#3D5466"} onPress = {() => this.props.navigation.navigate('Session Details',{event:item,email:this.state.email})}>

				<Cd.Content>
					<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', padding:4 }}>
						<View style={{ flex: 1, flexDirection: 'row'}}>
							<Badge value={item.category} badgeStyle={styles.badge} textStyle={{color:'#3D5466'}}/>
							<Text style={{color:'#F4ECD4',fontSize:14, paddingLeft:4}}>
								{(new Date(parseInt(item.startTime))).toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3")} | 
							</Text>
							<Text style={{color:'#F4ECD4',fontSize:14, paddingLeft:4}}>
								{item.seatsLeft} seats left
							</Text>
						</View>
						{/* <FontAwesomeIcon style={styles.fav} icon={ test } color={ 'black' } size={20} />      */}
					</View>
					<Title style={{color:'#F4ECD4',fontSize:20, padding:4}}>{this.trimContent(item.eventName,30)}</Title>

					<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between',padding:4 }}>
						<View style={{ flex: 1, flexDirection: 'row'}}>
							<Avatar.Image
							source = {{
								uri: this.state.profileImage
							}}
							size={30}
							/>
							<Title style={{color:'#F4ECD4',fontSize:13,paddingLeft:10}}>{this.trimContent(item.expertName,17)}</Title>
						</View>
						{/* item.participantList!=null && item.participantList.includes(this.state.email) */}
						<Button
							disabled = {item.status!=null || (item.participantList!=null && item.participantList.includes(this.state.email))?true:false}
							title={item.status!=null || (item.participantList!=null && item.participantList.includes(this.state.email))?"Booked":"Book"}
							onPress={this.updateEventBook.bind(this,item)}
							loading={item.loadingButton}
							buttonStyle={{backgroundColor:'#F4ECD4'}}
							titleStyle={{color:'#3D5466'}}
						/>
					</View>
				</Cd.Content>
				</TouchableOpacity>

			</Cd>
		  );
		return ( 
			
			<View style={{marginTop:'10%',flex:1,backgroundColor:'#F4ECD4'}}>
			<CalendarDays 
				numberOfDays={15}
				daysInView={4}
				paginate={true}
				onDateSelect={date => this.changeSelectedDate(date)}
			/>
			<Text h4 style={{marginLeft:30,marginTop:20,marginBottom:15,color:'#3D5466'}}>{this.state.selectedDate}</Text>
				{this.props.childLoader==true && <MaterialIndicator style={{marginTop:'10%'}} color='blue'/>}
				{this.props.childLoader==false && 
				<SafeAreaView style={{flex:1}}>
				
					<FlatList contentContainerStyle={{ flexGrow: 1 }}
						data={this.props.events}
						renderItem={renderItem}
						keyExtractor={item => item.id}
					/>
				
				</SafeAreaView>}
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
		borderColor: '#3D5466',
	},
	badge: {
		backgroundColor:'#F4ECD4',
		alignSelf:'flex-start',
		color:'#3D5466',
		// padding:4
	},
	fav: {
		alignSelf:'flex-start',
	},
	bookButton: {
		backgroundColor: 'green',
		
	}
});