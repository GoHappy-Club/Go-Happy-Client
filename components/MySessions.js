import React, {Component} from 'react';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards';
import { RefreshControl,Modal,FlatList,SafeAreaView,ScrollView,TouchableOpacity,TouchableHighlight,TouchableWithoutFeedback, StyleSheet, View, TextInput, Image, KeyboardAvoidingView } from 'react-native';
import { Text , Button} from 'react-native-elements';
import {WebView} from 'react-native-webview';

import { Card as Cd, Title, Paragraph,  Avatar,
	Caption,
	Drawer,
	TouchableRipple,
	Switch } from 'react-native-paper';


export default class MySessions extends Component {
	constructor(props)
	{
		super(props);
		this.state = {
			phoneNumber: '',
			email:'',
			password: '',showAlert:false,loader:false,
			mySession: [],
			refreshing:false,
			videoVisible:false,
			profileImage: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/da/Matt_LeBlanc_as_Joey_Tribbiani.jpg/220px-Matt_LeBlanc_as_Joey_Tribbiani.jpg',
		}
		this._retrieveData();
	}
	componentDidMount() {

		this.props.navigation.addListener(
		  'focus',
		  payload => {
			this._onRefresh();
		  }
		);
	
	}
	_retrieveData = async () => {
		try {
			console.log('dsadadadadada',await AsyncStorage.getAllKeys());
		  const email = await AsyncStorage.getItem("email");
		  this.setState({email:email});	
		} catch (error) {
		  // Error retrieving data
		  console.log('error here',error)
		}
	  };
	static getDerivedStateFromProps(nextProps, prevState) {
		if(nextProps.mySessions!==prevState.mySessions){
			return { mySessions: nextProps.mySessions};
		 }
		 else return null;
	}
	trimContent(text,cut){
		if(text.length<cut)
			return text;
		return text.substring(0,cut)+'...';
	}
	_onRefresh(){
		this.setState({refreshing:true});
		var _this = this;
		this.props.loadMySessions("",function(){
			console.log('i am in callback');
			_this.setState({refreshing:false});
		});
	}

	sorry(){
		return (
			<Text  h3 style={{height:'100%',marginTop:'20%',alignSelf:'center',textAlign:'center',flex: 1,
			justifyContent: 'center',
			alignItems: 'center'}}>
				No Events Booked 😟
			</Text>
		)
	}
	loadCaller(){
		console.log('ewfsdfdsfdsfdsfsdfdsfdsfds')
		console.log('ewfsdfdsfdsfdsfsdfdsfdsfds')
		console.log('ewfsdfdsfdsfdsfsdfdsfdsfds')
		console.log('ewfsdfdsfdsfdsfsdfdsfdsfds')
		console.log('ewfsdfdsfdsfdsfsdfdsfdsfds')
		console.log('ewfsdfdsfdsfdsfsdfdsfdsfds')
		console.log('ewfsdfdsfdsfdsfsdfdsfdsfds')
	}
	videoPlayer(link){
		console.log(link);
		this.setState({videoVisible:true});
	}

	render() {
		const renderItem = ({ item} , type) => (

			<Cd style={{...styles.card,marginLeft:10,marginRight:10,marginBottom:10,backgroundColor: 'white'}}>
				<TouchableOpacity style={{...styles.card,marginTop:10}} underlayColor={"grey"} onPress = {() => this.props.navigation.navigate('Session Details',{event:item,type:type,phoneNumber:this.props.phoneNumber,onGoBack: () => this.loadCaller()})}>

				<Cd.Content>
				<Text style={{padding:4}}>{(new Date(parseInt(item.startTime))).toDateString()} | {(new Date(parseInt(item.startTime))).toLocaleTimeString()}</Text>     

				<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', padding:4 }}>
						<View style={{ flex: 1, flexDirection: 'row'}}>

							<Text style={{color:'#404040',fontSize:14,fontWeight:'700'}}>
							{this.trimContent(item.eventName,30)}
							</Text>
						</View>
				</View>

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
						{type=='ongoing' && <Button
							disabled = {item.participantsList!=null && item.participantsList.includes(this.state.email)?true:false}
							title='Join'
							// onPress={this.updateEventBook.bind(this,item)}
							loading={item.loadingButton}
						/>}
						{type=='expired' && <Button
							disabled = {item.participantsList!=null && item.participantsList.includes(this.state.email)?true:false}
							title='View Recording'
							onPress={this.videoPlayer.bind(this,item.recordingLink)}
							loading={item.loadingButton}
						/>}
						{item.recordingLink!=null && <Modal
							style={{

							}}
							animationType="slide"
							transparent={false}
							visible={this.state.videoVisible}
							onRequestClose={() => {
								this.setState({videoVisible:false});
							}}>
								<WebView
								javaScriptEnabled={true}
								style={{flex:1, borderColor:'red', borderWidth:1, height:400, width:400}}
								source={{
									uri: item.recordingLink
								}}
								/>
						</Modal>}
					</View>
				</Cd.Content>
				</TouchableOpacity>

			</Cd>
		  );

		return (
            <ScrollView
			refreshControl={
				<RefreshControl
				  refreshing={this.state.refreshing}
				  onRefresh={this._onRefresh.bind(this)}
				/>
			  }>
				{this.props.ongoingEvents.length==0 && this.props.upcomingEvents.length==0 && this.props.expiredEvents.length==0 
				&& this.sorry()}
				{this.props.ongoingEvents.length>0 &&<Text h4 style={{marginLeft:5,marginTop:20,marginBottom:15}}>
				{this.props.ongoingEvents.length>0 && <Text h4 style={{marginLeft:30,marginTop:20,marginBottom:15}}>Ongoing Events</Text>}
				{this.props.childLoader==true && <MaterialIndicator color='blue'/>} 
				</Text>}
				<SafeAreaView style={styles.container}>
				<FlatList 
					data={this.props.ongoingEvents}
					renderItem={(item) => renderItem(item,'ongoing')}
					keyExtractor={item => item.id}
				/>
				</SafeAreaView>
				{this.props.upcomingEvents.length>0 && <Text h4 style={{marginLeft:5,marginTop:20,marginBottom:15}}>
				{this.props.upcomingEvents.length>0 && <Text h4 style={{marginLeft:30,marginTop:20,marginBottom:15}}>Upcoming Events</Text>}				
				{this.props.childLoader==true && <MaterialIndicator color='blue'/>}
				</Text>}
				<SafeAreaView style={styles.container}>
				<FlatList horizontal={true}
					data={this.props.upcomingEvents}
					renderItem={(item) => renderItem(item,'upcoming')}
					keyExtractor={item => item.id}
				/>
				</SafeAreaView>
				{this.props.expiredEvents.length>0 && <Text h4 style={{marginLeft:5,marginTop:20,marginBottom:15}}>
				{this.props.expiredEvents.length>0 && <Text h4 style={{marginLeft:30,marginTop:20,marginBottom:15}}>Past Events and Recordings</Text>}				
				{this.props.childLoader==true && <MaterialIndicator color='blue'/>}
				</Text>}
				<SafeAreaView style={styles.container}>
				<FlatList
					data={this.props.expiredEvents}
					renderItem={(item) => renderItem(item,'expired')}
					keyExtractor={item => item.id}
				/>
				</SafeAreaView>
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({

	card: {
		backgroundColor: "white",
		marginBottom: 10,
		borderRadius: 20,
		borderWidth: 1,
		borderColor: '#fff',
	},
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
	}
});