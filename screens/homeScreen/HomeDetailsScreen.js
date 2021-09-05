import React,{Component} from 'react';
import { TouchableOpacity,TouchableHighlight,TouchableWithoutFeedback, StyleSheet, View, Button, TextInput, Image, Text, KeyboardAvoidingView } from 'react-native';
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
		}
	}
	sessionAction(){
		if(this.props.route.params.type=='expired')
		return "View Recording";
		if(this.props.route.params.type=='ongoing')
		return "Join";
		if(this.props.route.params.event.participantList.includes('rashu.sharma14@gmail.com')){

		var url = SERVER_URL+"/event/cancelEvent";
		axios.post(url,{'id':this.props.route.params.event.id,'email':this.props.route.params.email})
			.then(response => {
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
				console.log('Errwdqor while fetching the transactions from sms');
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
			<SessionDetails navigation={navigation} sessionAction={this.sessionAction.bind(this)} event={this.props.route.params.event} type={this.props.route.params.type}/>
		);
	}

}

const styles = StyleSheet.create({
	
});