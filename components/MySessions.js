import React, {Component} from 'react';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards';
import { FlatList,SafeAreaView,ScrollView,TouchableOpacity,TouchableHighlight,TouchableWithoutFeedback, StyleSheet, View, TextInput, Image, KeyboardAvoidingView } from 'react-native';
import { Text , Button} from 'react-native-elements';

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
			password: '',showAlert:false,loader:false,
			mySession: [],
			profileImage: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/da/Matt_LeBlanc_as_Joey_Tribbiani.jpg/220px-Matt_LeBlanc_as_Joey_Tribbiani.jpg',
		}
	}
	static getDerivedStateFromProps(nextProps, prevState) {
		console.log('nextprps',nextProps);
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
	render() {
		const renderItem = ({ item} , type) => (

			<Cd style={{...styles.card,marginLeft:10,marginRight:10,marginBottom:10,backgroundColor: 'white'}}>
				<TouchableOpacity style={{...styles.card,marginTop:10}} underlayColor={"grey"} onPress = {() => this.props.navigation.navigate('Session Details',{event:item,type:type})}>

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
							// onPress={this.updateEventBook.bind(this,item)}
							loading={item.loadingButton}
						/>}
					</View>
				</Cd.Content>
				</TouchableOpacity>

			</Cd>
		  );
		return (
            <ScrollView>
				{this.props.ongoingEvents.length>0 &&<Text h4 style={{marginLeft:5,marginTop:20,marginBottom:15}}>
				{this.props.ongoingEvents.length>0 && <Text>Ongoing Events</Text>}
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
					renderItem={renderItem}
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