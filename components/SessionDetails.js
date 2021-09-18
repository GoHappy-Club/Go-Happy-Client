import React, {Component} from 'react';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards';
import { Linking,ImageBackground,ScrollView,TouchableOpacity,TouchableHighlight,TouchableWithoutFeedback, StyleSheet, View,  TextInput, Image, KeyboardAvoidingView } from 'react-native';

import { Card as Cd, Title, Paragraph, Avatar } from 'react-native-paper';
import { Text, Badge, withBadge,Button } from 'react-native-elements';
import Video from 'react-native-video';



export default class SessionDetails extends Component {
	constructor(props)
	{
		super(props);
		this.state = {
			event:props.event,
			profileImage: 'https://www.dmarge.com/wp-content/uploads/2021/01/dwayne-the-rock-.jpg'
		}
		console.log(props);
	}	
	getTitle(){
		if(this.props.type=='expired')
		return "View Recording";
		if(this.props.type=='ongoing')
		return "Join";
		if(this.state.event.participantList!=null && this.state.event.participantList.includes('rashu.sharma14@gmail.com'))
		return "Cancel Your Booking";
		return "Book";
		
	}
	sessionAction(){
		this.props.sessionAction();
	}
	render() {
		if(this.state.loader==true){
			// return (<ActivityIndicator size='large' color="#0A1045" style={{flex: 1,justifyContent: "center",flexDirection: "row",justifyContent: "space-around",padding: 10}}/>);
			return (<MaterialIndicator color='white' style={{backgroundColor:"#0A1045"}}/>)
		}
		const navigation = this.props.navigation;
		const title = 'Login';
		const item = this.props.event;
		return (
			<View style = {{
				backgroundColor: 'white'
			}}>
				<ScrollView style = {{
					backgroundColor: 'white',height:'90%'
				}}>
					
					<View style = {{
						backgroundColor: 'white', borderRadius: 50,
						shadowColor: "black",
						shadowOffset: { height: 2},
						shadowOpacity: 0.3,
						width:'100%',
						height:'100%',
						justifyContent: "center",
					}}>
						<Image
						style={styles.cover}
						source={{
						uri: 'https://cdn.dnaindia.com/sites/default/files/styles/full/public/2019/09/05/865428-697045-senior-citizens-03.jpg',
						}}
						/>
						<View style={{ position: 'absolute', top: 0, paddingLeft:20, height: '180%', alignItems: 'flex-start', justifyContent: 'center' }}>
							<Text style={{overflow:"hidden",backgroundColor:'white',padding:4,color:'black',
								borderRadius:4}}>
								{item.seatsLeft} seats left
							</Text>
						</View>
					</View>
					
					<View style={{margin:20}}>
						<Text h3 style={{fontWeight: "bold"}}>
							{item.eventName}
						</Text>
						<Text h5 style={{color: "grey",marginTop:5}}>
							{item.expertName}
						</Text>
						<Icon
						name="time-outline" color="grey" size={15} 
						style={{marginTop:20}}>
							<Text style={{color: "grey",marginTop:15,fontSize:15}}>
							{(new Date(parseInt(item.startTime))).toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3")} -     
							{(new Date(parseInt(item.endTime))).toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3")}
							</Text>
						</Icon>
						<View style={{
							marginTop:2,
							borderBottomColor: 'grey',
							borderBottomWidth: 1,
						}}
						/>
						<Text style={{fontSize:17,color: "grey",marginTop:20,fontWeight:'bold'}}>
							About
						</Text>
						<Text style={{fontSize:17,color: "grey",marginTop:10}}>
							{item.description}
						</Text>
						<Text style={{fontSize:17,color: "grey",marginTop:20,fontWeight:'bold'}}>
							Expert
						</Text>
						<View style={{ flexDirection: 'row', justifyContent: 'space-between',marginTop:10}}>
						<View style={{ flex: 1, flexDirection: 'row'}}>
								<Avatar.Image
								source = {{
									uri: this.state.profileImage
								}}
								size={30}
								/>
								<Title style={{color:'#404040',fontSize:13,paddingLeft:10}}>{item.expertName}</Title>
							</View>
						</View>
					</View>
					
				</ScrollView>
				
				<View style={{margin:15}}>
					<Button outline 
						title={this.getTitle()}
						onPress={this.sessionAction.bind(this)}>
					</Button>
				</View>
			</View>

		);
	}
}

const styles = StyleSheet.create({
	container1: {
		flex: 1,
		backgroundColor: '#0A1045'
	},
	input: {
		width: "90%",
		backgroundColor: "white",
		padding: 15,
		marginBottom: 10
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
	cover:{
		flex: 1,
    	justifyContent: "center",
		borderBottomLeftRadius: 20,
		borderBottomRightRadius: 20,
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
		color: 'white',
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
	},
	backgroundVideo: {
		position: 'absolute',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
	  },
});