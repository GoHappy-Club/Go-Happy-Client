import React,{Component} from 'react';
import { TouchableOpacity,TouchableHighlight,TouchableWithoutFeedback, StyleSheet, View, Button, TextInput, Image, Text, KeyboardAvoidingView } from 'react-native';
import { Avatar } from 'react-native-paper'
import axios from 'axios';
import AwesomeAlert from 'react-native-awesome-alerts';
import {
  MaterialIndicator,
} from 'react-native-indicators';
import HomeDashboard from '../../components/HomeDashboard.js'

// var tambola = require('tambola-generator');
import tambola from 'tambola';



export default class HomeScreen extends Component {
	constructor(props)
	{
		super(props);
		console.log('in home screen ',props);
		this.state = {
			phoneNumber: '',
			password: '',showAlert:false,childLoader:false,
			events: [],
			error:true,
		}
	}
	render() {
		if(this.state.error==false){
			return (<HomeDashboard events={this.state.events} childLoader={this.state.childLoader} bookEvent={this.bookEvent.bind(this)} loadEvents={this.loadEvents.bind(this)}  navigation={this.props.navigation}/>)
		}
		else{
			return (<MaterialIndicator color='white' style={{backgroundColor:"#0A1045"}}/>)
		}
	}
	loadEvents(selectedDate) {
		this.setState({childLoader: true});
		this.setState({events:[]});
		var url = SERVER_URL+"/event/getEventsByDate";

		console.log('date for events',selectedDate,url);
		axios.post(url,{'date':selectedDate})
			.then(response => {
				console.log(response);
				if (response.data) {
					console.log('this is response',response.data);
					for(var i=0;i<response.data.events.length;i++){
						response.data.events[i].loadingButton = false;
						console.log('this is response',response.data);
					}
					this.setState({events: response.data.events});
					this.setState({error:false});
					this.setState({childLoader: false});
				}
			})
			.catch(error => {
				this.error=true;
				console.log('Errwdqor lllwhile fetching the transactions from sms',error);
			});
	}

	bookEvent(item,email,selectedDate){
		let ticket = tambola.generateTicket(); // This generates a standard Tambola Ticket

		console.log(ticket);
		var id = item.id;
		var url = SERVER_URL+"/event/bookEvent";
		console.log(item,email,url);
        axios.post(url,{'id':id,'email':email,'tambolaTicket':ticket})
        .then(response => {
			console.log(response);
            if (response.data) {
				
				if(response.data=="SUCCESS"){

					var tempEvents = this.state.events;
					for(var i=0;i<tempEvents.length;i++){
						if(tempEvents[i].id==item.id){
							tempEvents[i].seatsLeft = tempEvents[i].seatsLeft - 1;
							tempEvents[i].loadingButton = false;
							tempEvents[i].status="Booked";
							this.setState({events:tempEvents});
							break;
						}
					}
					this.loadEvents(selectedDate);
					// _callback();
					// item.seatsLeft = item.seatsLeft - 1;

					
					return item;
				}
            }
        })
        .catch(error => {
			this.error=true;
            console.log('Error whilmjne fetching the transactions from sms',error);
			return false;
        });		
	}
	componentDidMount() {
		this.loadEvents(new Date().setHours(0,0,0,0));
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