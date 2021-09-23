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

		}
	}
	render() {
		if(this.state.loader==true){
			return (<MaterialIndicator color='white' style={{backgroundColor:"#0A1045"}}/>)
		}
		const navigation = this.props.navigation;
		const title = 'Login';
		return (
			<Membership navigation={this.props.navigation}/>
		);
	}

}

const styles = StyleSheet.create({
});