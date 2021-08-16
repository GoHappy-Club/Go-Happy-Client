import React, {Component} from 'react';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards';
import { ScrollView,TouchableOpacity,TouchableHighlight,TouchableWithoutFeedback, StyleSheet, View, Button, TextInput, Image, Text, KeyboardAvoidingView } from 'react-native';

import { Card as Cd, Title, Paragraph } from 'react-native-paper';



export default class Profile extends Component {
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
			// return (<ActivityIndicator size='large' color="#0A1045" style={{flex: 1,justifyContent: "center",flexDirection: "row",justifyContent: "space-around",padding: 10}}/>);
			return (<MaterialIndicator color='white' style={{backgroundColor:"#0A1045"}}/>)
		}
		const navigation = this.props.navigation;
		const title = 'Login';
		return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text>This will contain my profile details</Text>
                  </View>
		);
	}
}

const styles = StyleSheet.create({
	container1: {
		flex: 1,
		backgroundColor: '#0A1045'
	},
});