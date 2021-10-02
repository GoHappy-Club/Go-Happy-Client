import React,{Component} from 'react';
import { Linking,TouchableOpacity,TouchableHighlight,TouchableWithoutFeedback, StyleSheet, View, Button, TextInput, Image, Text, KeyboardAvoidingView } from 'react-native';
// import { Container, Header, Content, Left, Body, Right, Icon, Title, Form, Item, Input, Label } from 'native-base';
import {
  MaterialIndicator,
} from 'react-native-indicators';
import SessionDetails from '../../components/SessionDetails';



export default class HomeDetailsScreen extends Component {
	constructor(props)
	{
		super(props);
		this.state = {
			email:''
		}
		this._retrieveData();
	}
	_retrieveData = async () => {
		try {
		  const value = await AsyncStorage.getItem('email');
		  console.log('get async',value);
		  console.log(this.props.route.params.event.participantList);
		  if (value !== null) {
			// We have data!!
			this.setState({email:value});
			
		  }
		} catch (error) {
		  // Error retrieving data
		  console.log('error here',error)
		}
	  };
	sessionAction(){
		if(this.props.route.params.type=='expired'){
			var meetingLink  = this.props.route.params.event.meetingLink;
			if(meetingLink==null)
				return;
			var si = meetingLink.indexOf("/j/")+3;
			var ei = meetingLink.indexOf("?");
			var meetingId = meetingLink.substring(si,ei);
			console.log("This is the meeting ID",meetingId);
			axios.post(SERVER_URL+"/zoom/getRecording",{'meetingId':meetingId})
				.then(response => {
					if (response.data) {
						console.log('this is response',response.data);
						Linking.canOpenURL(response.data).then(supported => {
							if (supported) {
							  Linking.openURL(response.data);
							} else {
							  console.log("Don't know how to open URI: " + response.data);
							}
						  })
					}
				})
				.catch(error => {
					this.error=true;
					console.log('Event Cancel output Error');
				}
			);
		}
		else if(this.props.route.params.type=='ongoing'){
			Linking.canOpenURL(this.props.route.params.event.meetingLink).then(supported => {
				if (supported) {
				  Linking.openURL(this.props.route.params.event.meetingLink);
				} else {
				  console.log("Don't know how to open URI: " + this.props.route.params.event.meetingLink);
				}
			  })
		}
		if(this.props.route.params.event.participantList!=null && this.props.route.params.event.participantList.includes(this.state.email)){
		console.log(this.props.route.params.event.id);
		console.log(this.props.route.params.email);
		var url = SERVER_URL+"/event/cancelEvent";
		axios.post(url,{'id':this.props.route.params.event.id,'email':this.props.route.params.email})
			.then(response => {
				if (response.data) {
					console.log('this is response',response.data);
					for(var i=0;i<response.data.events.length;i++){
						response.data.events[i].loadingButton = false;
						console.log('Event Cancel output',response.data);
					}
					this.setState({events: response.data.events});
					this.setState({error:false});
					this.setState({childLoader: false});
				}
			})
			.catch(error => {
				this.error=true;
				console.log('Event Cancel output Error');
			}
		);
		}
	}
	render() {
		if(this.state.loader==true){
			// return (<ActivityIndicator size='large' color="#0A1045" style={{flex: 1,justifyContent: "center",flexDirection: "row",justifyContent: "space-around",padding: 10}}/>);
			return (<MaterialIndicator color='white' style={{backgroundColor:"#0A1045"}}/>)
		}
		const navigation = this.props.navigation;
		const title = 'Login';
		return (
			<SessionDetails navigation={navigation} sessionAction={this.sessionAction.bind(this)} event={this.props.route.params.event} type={this.props.route.params.type} email={this.state.email}/>
		);
	}

}

const styles = StyleSheet.create({
	
});