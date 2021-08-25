import React, {Component} from 'react';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards';
import { FlatList,SafeAreaView,ScrollView,TouchableOpacity,TouchableHighlight,TouchableWithoutFeedback, StyleSheet, View, TextInput, Image, KeyboardAvoidingView } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import { Text, Badge, Icon, withBadge } from 'react-native-elements';

import { Card as Cd, Title, Paragraph,  Avatar,
	Caption,
	Drawer,
	TouchableRipple,
	Switch, Button } from 'react-native-paper';
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
			profileImage: 'https://www.dmarge.com/wp-content/uploads/2021/01/dwayne-the-rock-.jpg'
		}
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
		 });
		 this.props.events =[]
		this.props.loadEvents(new Date(Date.parse(date)).setHours(0,0,0,0));
	  };
	// _renderItem ({item, index}, parallaxProps) {
    //     return (
    //         <View style={styles.item}>
	// 			<Text>Live</Text>
	// 			<PulseLoader color="green" size={15}/>
      

    //             <ParallaxImage
    //                 source={{ uri: 'https://png.pngtree.com/png-clipart/20210311/original/pngtree-up-to-50-off-price-tags-png-image_5999761.jpg' }}
    //                 containerStyle={styles.imageContainer}
    //                 style={styles.image}
    //                 parallaxFactor={0.4}
	// 				text='testtesttesttesttesttesttesttesttesttest'
    //                 {...parallaxProps}
    //             />
                
    //         </View>
    //     );
    // }
	trimContent(text,cut){
		if(text.length<cut)
			return text;
		return text.substring(0,cut)+'...';
	}
	
	
	render() {
		// if(this.state.loader==true){
		// 	// return (<ActivityIndicator size='large' color="#0A1045" style={{flex: 1,justifyContent: "center",flexDirection: "row",justifyContent: "space-around",padding: 10}}/>);
		// 	return (<MaterialIndicator color='white' style={{backgroundColor:"#0A1045"}}/>)
		// }
		// if(this.state.error==false){
		// 	return (<SafeAreaView style={styles.container}>
		// 		<FlatList
		// 			data={this.props.events}
		// 			renderItem={renderItem}
		// 			keyExtractor={item => item.id}
		// 		/>
		// 	</SafeAreaView>)
		// }
		// else{
		// 	return (<MaterialIndicator color='white' style={{backgroundColor:"#0A1045"}}/>)
		// }
		const renderItem = ({ item }) => (

			<Cd style={{...styles.card,marginLeft:30,marginRight:30,marginBottom:15,backgroundColor: 'white'}}>
				<Cd.Content>
					<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', padding:4 }}>
						<View style={{ flex: 1, flexDirection: 'row'}}>

							<Badge value={item.category} badgeStyle={styles.badge} />
							<Text style={{color:'#404040',fontSize:14, paddingLeft:4}}>
								{(new Date(parseInt(item.startTime))).toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3")} | 
							</Text>
							<Text style={{color:'red',fontSize:14, paddingLeft:4}}>
								{item.seatsLeft} seats left
							</Text>
						</View>
						<FontAwesomeIcon style={styles.fav} icon={ test } color={ 'black' } size={20} />     
					</View>
					<Title style={{color:'black',fontSize:20, padding:4}}>{this.trimContent(item.eventName,30)}</Title>

					<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between',padding:4 }}>
						<View style={{ flex: 1, flexDirection: 'row'}}>
							<Avatar.Image
							source = {{
								uri: this.state.profileImage
							}}
							size={30}
							/>
							<Title style={{color:'#404040',fontSize:13,paddingLeft:10}}>{this.trimContent(item.expertName,17)}</Title>
						</View>
						<Button disabled = {item.participants!=null && item.participants.includes(this.state.email)?true:false} style={styles.bookButton} mode="contained" onPress={() => this.setState({bookingLoader:!this.props.bookEvent(item.id,this.state.email)})}>{item.participants!=null && item.participants.includes(this.state.email)?"Booked":"Book"}</Button>
					</View>

					{/* <Paragraph style={{color:'black',marginTop:-8,textAlign:'center'}}>{item.eventName}</Paragraph> */}
					{/* <Title style={{color:'black',fontSize:15,textAlign:'center',marginTop:8}}>{item.eventName}</Title> */}
				</Cd.Content>
			</Cd>
		  );
		return ( 
			<>
			<CalendarDays
				numberOfDays={15}
				daysInView={4}
				paginate={true}
				onDateSelect={date => this.changeSelectedDate(date)}
			/>
			<Text h4 style={{marginLeft:30,marginTop:20,marginBottom:15}}>{this.state.selectedDate}</Text>
			{/* <ScrollView> */}
			
				{/* <View > */}
				{this.state.bookingLoader==true && <MaterialIndicator color='blue'/>}
				{this.props.childLoader==true && <MaterialIndicator color='blue'/>}
				<SafeAreaView style={styles.container}>
					<FlatList
						data={this.props.events}
						renderItem={renderItem}
						keyExtractor={item => item.id}
					/>
				</SafeAreaView>
					{/* <Carousel
						sliderWidth={screenWidth}
						sliderHeight={screenWidth}
						itemWidth={screenWidth - 60}
						data={this.state.events}
						renderItem={this._renderItem}
						hasParallaxImages={true}
					/> */}
					{/* {this.state.events.map((event, key) => {
						return (
							<Card key={event.id}>
							<CardImage 
							source={{uri: 'https://assets.seniority.in/media/ktpl_blog/Edited_Seniors_Day.jpg'}} 
							title={event.eventName}
							/>
							<CardTitle
							subtitle={event.category}
							/>
							
							<CardContent text={"Session Date: "+ (new Date(parseInt(event.eventDate))).toDateString()} />
							<CardContent text={"Session Time: "+ (new Date(parseInt(event.startTime))).toLocaleTimeString()+" - "+
								(new Date(parseInt(event.endTime))).toLocaleTimeString()} />
							<CardAction 
							separator={true}
							inColumn={false}>
							<CardButton
								onPress={() => {}}
								title="Book"
								color="#FEB557"
							/>
							<CardButton
								onPress={() => {this.props.navigation.navigate('Session Details',{event:event});}}
								title="Details"
								color="#FEB557"
							/>
							</CardAction>
						</Card>
						);
					})} */}
				{/* </View> */}
            {/* </ScrollView> */}
			</>
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
		borderColor: '#fff',
	},
	badge: {
		backgroundColor:'green',
		alignSelf:'flex-start',
		
		padding:2
	},
	fav: {
		alignSelf:'flex-start',
	},
	bookButton: {
		backgroundColor: 'green',
		
	},
	btnContainer: {
		flexDirection: "row",
		justifyContent: "center"
	},
	userBtn: {
		backgroundColor: "#f0ad4e",
		paddingVertical: 15,
		height: 60
	},
	btnTxt: {
		fontSize: 20,
		textAlign: 'center',
		color: "black",
		fontWeight: '700'
	},
	registerTxt: {
		marginTop: 5,
		fontSize: 15,
		textAlign: 'center',
		color: "white",
	},
	welcome: {
		fontSize: 30,
		textAlign: 'center',
		margin: 10,
		color: 'white'
	},
	logo: {
		width: 150,
		height: 150
	},
	logoContainer: {
		alignItems: 'center',
		flexGrow: 1,
		justifyContent: 'center'
	},
	formContainer: {

	},
	title: {
		color: 'black',
		marginTop: 10,
		width: 160,
		opacity: 0.9,
		textAlign: 'center'
	},
	newinput: {
		height: 50,
		backgroundColor: 'rgba(255,255,255,0.2)',
		marginBottom: 10,
		color: 'white',
		paddingHorizontal: 10
	},
	container2: {
		padding: 25
	},
	title2: {
		color: 'white',
		marginTop: '30%',
		marginBottom: 10,
		opacity: 0.9,
		textAlign: 'center',
		fontSize: 30
	}
});