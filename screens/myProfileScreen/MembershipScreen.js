import React,{Component} from 'react';
import { TouchableOpacity,TouchableHighlight,TouchableWithoutFeedback, StyleSheet, View, Button, TextInput, Image, Text, KeyboardAvoidingView } from 'react-native';
import {
  MaterialIndicator,
} from 'react-native-indicators';
import Membership from '../../components/Membership';


export default class MembershipScreen extends Component {
	constructor(props)
	{
		super(props);
		this.state = {
			phoneNumber: '',
			password: '',showAlert:false,loader:false,
			orderId:''
		}
	}
	getOrderId(amount){
		var url = SERVER_URL+"/razorPay/pay";
		console.log('right here');
		axios.post(url,{'amount':amount})
        .then(response => {
            if (response.data) {
				console.log('this is response',response.data);
				this.setState({orderId: response.data});
				return response.data;
            }
        })
        .catch(error => {
			this.error=true;
            console.log('Errwdqor while fetching the transactions from sms');
        });
	}
	setMembership(email,planName,_callback){
		var url = SERVER_URL+"/user/setMembership";
		axios.post(url,{'email':email,'planName':planName})
        .then(response => {
            // if (response.data) {
				AsyncStorage.setItem('membership',planName);
				_callback();
            // } 
        })
        .catch(error => {
			this.error=true;
            console.log('Errwdqor while fetching the transactions from sms');
        });
	}
	render() {
		if(this.state.loader==true){
			return (<MaterialIndicator color='white' style={{backgroundColor:"#0A1045"}}/>)
		}
		const navigation = this.props.navigation;
		const title = 'Login';
		return (
			<Membership navigation={this.props.navigation} getOrderId={this.getOrderId.bind(this)}
			setMembership={this.setMembership.bind(this)}/>
		);
	}

}

const styles = StyleSheet.create({
});