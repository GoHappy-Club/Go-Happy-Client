import React, {Component} from 'react';
import { TouchableOpacity,TouchableHighlight,TouchableWithoutFeedback, StyleSheet, View, Button, TextInput, Image, Text, KeyboardAvoidingView } from 'react-native';

// import AsyncStorage from '@react-native-community/async-storage';
import { Avatar } from 'react-native-paper'
import axios from 'axios';
import AwesomeAlert from 'react-native-awesome-alerts';
import HomeScreen from '../homeScreen/HomeScreen';
// import { Container, Header, Content, Left, Body, Right, Icon, Title, Form, Item, Input, Label } from 'native-base';
import {
  MaterialIndicator,
} from 'react-native-indicators';

import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
  } from '@react-native-google-signin/google-signin';



export default class LoginScreen extends Component {
	constructor(props)
	{
		super(props);
		this.state = {
			phoneNumber: '',
			password: '',showAlert:false,loader:false,

		}
	}
    // GoogleSignin.configure();
    // signIn = async () => {
    //     try {
    //       await GoogleSignin.hasPlayServices();
    //       const userInfo = await GoogleSignin.signIn();
    //       console.log(userInfo);
    //       this.setState({ userInfo });
    //     } catch (error) {
    //       if (error.code === statusCodes.SIGN_IN_CANCELLED) {
    //         // user cancelled the login flow
    //       } else if (error.code === statusCodes.IN_PROGRESS) {
    //         // operation (e.g. sign in) is in progress already
    //       } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
    //         // play services not available or outdated
    //       } else {
    //         // some other error happened
    //       }
    //     }
    //   };
	render() {
		if(this.state.loader==true){
			// return (<ActivityIndicator size='large' color="#0A1045" style={{flex: 1,justifyContent: "center",flexDirection: "row",justifyContent: "space-around",padding: 10}}/>);
			return (<MaterialIndicator color='white' style={{backgroundColor:"#0A1045"}}/>)
		}
		const navigation = this.props.navigation;
		const title = 'Login';
		return (
			<KeyboardAvoidingView behavior="padding" style={styles.container1}>
				<Text style={styles.title2}>Welcome to GoHappy Club</Text>
				<View style={styles.logoContainer}>
					<Avatar.Image
						style={styles.logo}
                      	source={require('../../images/logo.jpeg')}
                      size={150}
                    />
					<Text style={styles.title}>Hum hain na, dekhlenge.</Text>
				</View>

				<View style={styles.formContainer}>
					<View style={styles.container2}>

						<TextInput
							style={styles.newinput}
							placeholder="Phone Number"
							placeholderTextColor='rgba(255,255,255,0.7)'
							returnKeyType = "next"
							onChangeText = {(text)=>this.setState({phoneNumber: text})}
							onSubmitEditing={() => this.passwordInput.focus()}
							value={this.state.phoneNumber}
							autoCapitalize="none"
							keyboardType="numeric"
						/>
						<TextInput
							style={styles.newinput}
							placeholder="Password"
							placeholderTextColor='rgba(255,255,255,0.7)'
							returnKeyType = "go"
							onChangeText = {(text)=>this.setState({password: text})}
							value={this.state.password}
							ref={(input) => this.passwordInput = input}
							secureTextEntry
						/>
						<TouchableOpacity style={styles.userBtn} onPress={this._login}>
							<Text style={styles.btnTxt} >Submit</Text>
						</TouchableOpacity>
							<Text style={styles.registerTxt} onPress={this._register}>Not registered yet?</Text>
                        
					</View>
                    {/* <GoogleSigninButton
                            style={{ width: 192, height: 48 }} /> */}
				</View>
				<AwesomeAlert
				  show={this.state.showAlert}
				  showProgress={false}
				  title="Login Error"
				  message="Invalid Credentials"
				  closeOnTouchOutside={true}
				  closeOnHardwareBackPress={false}
				  showConfirmButton={true}
				  confirmText="Try Again"
				  confirmButtonColor="#DD6B55"
				  onConfirmPressed={() => {
				    this.setState({showAlert:false})
				  }}
				/>
			</KeyboardAvoidingView>
		);
	}
  _register = async() => {
		this.props.navigation.navigate('Register');
	}
	_login = async() => {
		this.setState({loader:true});
        this.props.navigation.navigate('Go Happy Club');
        this.setState({loader:false});
        return;
		axios.post("http://"+SERVER_URL+":8080/login/check", {'phoneNumber':this.state.phoneNumber,'password':this.state.password})
					.then(response => {
						console.log('here'+response);
							if (response.data && response.data!="ERROR") {
									// this.setState({fullName: userInfo.fullName});
									AsyncStorage.setItem('phoneNumber',response.data.phoneNumber);
									AsyncStorage.setItem('fullName',response.data.fullName);
									AsyncStorage.setItem('username',response.data.username);
									AsyncStorage.setItem('profileImage',response.data.profileImage);
									AsyncStorage.setItem('lastDataSync',response.data.dataSyncTime);
									this.props.navigation.navigate('DrawerNavigator');
							}
							else if(response.data=="ERROR"){
								this.setState({showAlert:true,loader:false})
							}
					})
					.catch(error => {
							console.log('Error while fetching the transactions from sms');
					});
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