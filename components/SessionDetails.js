import React, {Component}  from 'react';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards';
import { Pressable,Modal,Linking,ImageBackground,ScrollView,TouchableOpacity,TouchableHighlight,TouchableWithoutFeedback, StyleSheet, View,  TextInput, Image, KeyboardAvoidingView} from 'react-native';
import {WebView} from 'react-native-webview';
import { Card as Cd, Title, Paragraph, Avatar } from 'react-native-paper';
import { Text, Badge, withBadge,Button } from 'react-native-elements';
import TambolaTicket from './TambolaTicket.js'
import Video from 'react-native-video';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faClock} from '@fortawesome/free-solid-svg-icons'


export default class SessionDetails extends Component {
	constructor(props)
	{
		super(props);
		this.state = {
			event:props.event,
			modalVisible:false,
			profileImage: 'https://www.dmarge.com/wp-content/uploads/2021/01/dwayne-the-rock-.jpg',
			loadingButton:false,
			videoVisible:false
		}
		console.log(props);
	}	
	getTitle(){
		if(this.props.type=='expired')
		return "View Recording";
		if(this.props.type=='ongoing')
		return "Join";
		if(this.state.event.participantList!=null && this.props.phoneNumber!=null && this.state.event.participantList.includes(this.props.phoneNumber))
		return "Cancel Your Booking";
		return "Book";
		
	}

	checkTambola(){
		if(this.props.event.eventName.contains("Tambola")){
			return true;
		}
		return false;
	}
	sessionAction(){
		if(this.getTitle()==='View Recording'){
			console.log(this.props);
			this.videoPlayer();
			return;			;
		}
		console.log('outside');
		var output = this.props.sessionAction('book');
		this.setState({loadingButton:true});
		if(output=='SUCCESS'){
			console.log(this.props);
		}
	}
	videoPlayer(){
		this.setState({videoVisible:true});
	}
	render() {
		if(this.state.loader==true){
			// return (<ActivityIndicator size='large' color="#0A1045" style={{flex: 1,justifyContent: "center",flexDirection: "row",justifyContent: "space-around",padding: 10}}/>);
			return (<MaterialIndicator color='white' style={{backgroundColor:"#0A1045"}}/>)
		}
		const item = this.props.event;
		return (
			<View style = {{
				backgroundColor: 'white',flex:1
			}}>
				<ScrollView contentContainerStyle={{ flexGrow: 1 }} style = {{
					backgroundColor: 'white'
				}}>
					
					<View style = {{
						backgroundColor: 'white', borderRadius: 50,
						shadowColor: "black",
						shadowOffset: { height: 2},
						shadowOpacity: 0.3,
						width:'100%',
						height:300,
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
						{/* <FontAwesomeIcon icon={ faClock } color={ 'white' } size={25} /> */}
						<View style={{flexDirection:'row'}}>
						<FontAwesomeIcon
						icon={ faClock }  color={ 'grey' } size={15}
						style={{marginTop:20}}>
						</FontAwesomeIcon>
						<Text style={{color: "grey",marginTop:15,fontSize:15,marginLeft:5}}>
							{(new Date(parseInt(item.startTime))).toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3")} -   
							{(new Date(parseInt(item.endTime))).toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, " $1$3")}
						</Text>
						</View>
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
					<TambolaTicket event={this.props.event} phoneNumber={this.props.phoneNumber}/>
				</ScrollView>
				
				<View style={{margin:15}}>
					<Button outline 
						title={this.getTitle()}
						loading={this.state.loadingButton}
						onPress={this.sessionAction.bind(this)}>
					</Button>
				</View>

				{item.recordingLink!=null && <Modal
					style={{

					}}
					animationType="slide"
					transparent={false}
					visible={this.state.videoVisible}
					onRequestClose={() => {
					alert('Modal has been closed.');
					}}>
						<WebView
						javaScriptEnabled={true}
						style={{flex:1, borderColor:'red', borderWidth:1, height:400, width:400}}
						source={{
							uri: item.recordingLink
						}}
						/>
						<TouchableOpacity onPress={() => this.setState({videoVisible:false})}>
						<Text>Hide Modal</Text>
						</TouchableOpacity>
				</Modal>}

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