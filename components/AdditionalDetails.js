import React, {Component} from 'react';
import { SafeAreaView,TouchableOpacity,TouchableHighlight,TouchableWithoutFeedback, StyleSheet, View, TextInput, Image, Text, KeyboardAvoidingView } from 'react-native';

// import AsyncStorage from '@react-native-async-storage/async-storage';
import { Avatar } from 'react-native-paper'
import axios from 'axios';
import AwesomeAlert from 'react-native-awesome-alerts';

import PhoneInput from "react-native-phone-number-input";
import {
  MaterialIndicator,
} from 'react-native-indicators';

import { Button } from 'react-native-elements';

export default class AdditionalDetails extends Component {
	constructor(props)
	{
		super(props);
		this.state = {
			email:props.route.params.email,
			name:props.route.params.name,
			state:props.route.params.state,
			city:props.route.params.city,
            phoneNumber:props.route.params.phoneNumber
		}
        console.log('ffsefsdds',props.route.params);
	}
	
	componentDidMount(){
		// this.getCurrentUserInfo();
	}
	
	updateDetails(){
		var url = SERVER_URL+"/user/update";
		axios.post(url, {'email':this.state.email,'name':this.state.name,'state':this.state.state,'city':this.state.city,'phone':this.state.phoneNumber})
		.then(response => {
			console.log('here'+response);
				if (response.data && response.data!="ERROR") {
				  // this.setState({fullName: userInfo.fullName});
				  if(response.data.phoneNumber!=null)
				  AsyncStorage.setItem('phoneNumber',response.data.phoneNumber);
				  // AsyncStorage.setItem('fullName',response.data.fullName);
				  if(response.data.name!=null) 
				  AsyncStorage.setItem('name',name);
				  if(response.data.email!=null)
				  AsyncStorage.setItem('email',email);
				  if(response.data.profileImage!=null)
				  AsyncStorage.setItem('profileImage',profileImage);
				  AsyncStorage.setItem('token',token);
				  // this.state.navigation.navigate('DrawerNavigator');
				  this.setState({loader:true});
				  this.state.navigation.navigate('GoHappy Club');
				  this.setState({loader:false});
				}
				else if(response.data=="ERROR"){
					this.setState({showAlert:true,loader:false})
				}
		})
		.catch(error => {
				console.log('Error while logging in',error);
		});
	}
    
	render() {
		return (
			<View style={styles.container1}>
                <Text style = {styles.title}>Add Information</Text>
                <TextInput style = {styles.input}
                    underlineColorAndroid = "transparent"
                    placeholder = "name"
                    placeholderTextColor = "#000"
                    autoCapitalize = "none"
                    value={this.state.name}
                    onChangeText={(text) => this.setState({name:text})}
                />
                <TextInput style = {styles.input}
                    underlineColorAndroid = "transparent"
                    placeholder = "Email"
                    placeholderTextColor = "#000"
                    autoCapitalize = "none"
                    value={this.state.email}
                    onChangeText={(text) => this.setState({email:text})}
                />      
                <TextInput style = {styles.input}
                    underlineColorAndroid = "transparent"
                    placeholder = "Phone Number"
                    placeholderTextColor = "#000"
                    autoCapitalize = "none"
                    value={this.state.phoneNumber}
                    onChangeText={(text) => this.setState({phoneNumber:text})}
                />      
                <TextInput style = {styles.input}
                    underlineColorAndroid = "transparent"
                    placeholder = "State"
                    placeholderTextColor = "#000"
                    autoCapitalize = "none"
                    value={this.state.state}
                    onChangeText={(text) => this.setState({state:text})}
                />      
                <TextInput style = {styles.input}
                    underlineColorAndroid = "transparent"
                    placeholder = "City"
                    placeholderTextColor = "#000"
                    autoCapitalize = "none"
                    value={this.state.city}
                    onChangeText={(text) => this.setState({city:text})}
                />     
                <Button outline style={ { marginTop: '30%' }}
                    title='Save'
                    onPress={this.updateDetails.bind(this)}>
                </Button>          
			 </View>
		);
	}

}

const styles = StyleSheet.create({
	title: {
		fontSize: 25,
        fontWeight:'bold',
		color:'white',
		marginTop:'30%',
		alignSelf:'center',
	},
	container1: {
		flex: 1,
		backgroundColor: '#0A1045',
	},
	input: {
		fontSize: 20,
		color:'black',
		marginTop:'10%',
		alignSelf:'center',
		backgroundColor: 'white',
        padding:15,
        borderColor:'yellow',
        borderWidth:2,
        borderRadius:5,
        width:'90%'
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
		width: 250,
		height: 250
	},
	logoContainer: {
		alignItems: 'center',
		flexGrow: 1,
		justifyContent: 'center'
	},
	
	newinput: {
		height: 50,
		backgroundColor: 'rgba(255,255,255,0.2)',
		marginBottom: 10,
		color: 'white',
		paddingHorizontal: 10
	},
	container2: {
		flex: 1,
		backgroundColor: '#aaa'
	},
	title2: {
		color: 'white',
		marginTop: '30%',
		marginBottom: 10,
		opacity: 0.9,
		textAlign: 'center',
		fontSize: 30
	},
	page: {
		marginTop:'20%',
		alignItems: 'center',
		justifyContent: 'center'
	  },
	  textInput: {
		width: '90%',
		height: 40,
		borderColor: '#555',
		borderWidth: 2,
		borderRadius: 5,
		paddingLeft: 10,
		color: '#fff',
		fontSize: 16
	  },
	  themeButton: {
		width: '100%',
		height: 50,
		alignItems: 'center',
		justifyContent: 'center',
		
		borderRadius: 5
	  },
	  themeButtonTitle: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#fff'
	  },
	  verificationView: {
		width: '100%',
		alignItems: 'center',
		marginTop: 50
	  }
});