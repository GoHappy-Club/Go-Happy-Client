import React, {Component} from 'react';
import { Text,StyleSheet, View} from 'react-native';

import axios from 'axios';
import AwesomeAlert from 'react-native-awesome-alerts';
import PhoneInput from "react-native-phone-number-input";
import {
  MaterialIndicator,
} from 'react-native-indicators';

import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
  } from '@react-native-google-signin/google-signin';
import firebase from '@react-native-firebase/app'
import '@react-native-firebase/auth';
import { Button } from 'react-native-elements';
import OTPTextInput from 'react-native-otp-textinput';
import AsyncStorage from '@react-native-async-storage/async-storage';


// GoogleSignin.configure({
// 	webClientId: '908368396731-fr0kop29br013r5u6vrt41v8k2j9dak1.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
// 	offlineAccess: true,
// 	iosClientId: '908368396731-vppvalbam1en8cj8a35k68ug076pq2be.apps.googleusercontent.com', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
//   });


export default class LoginScreen extends Component {
	constructor(props)
	{
		super(props);
		this.state = {
			phoneNumber: '',
			password: '',showAlert:false,loader:false,
			userInfo: null,
			confirmResult: null,
			verificationCode:'',
			userId:'',
			email:'',
			name:'',
			state:'',
			city:''
		}
		this.getCurrentUserInfo();
	}
	getCurrentUser = async () => {
		const currentUser = await GoogleSignin.getCurrentUser();
		this.setState({ currentUser });
	  };
	validatePhoneNumber = () => {
		var regexp = /^\+[0-9]?()[0-9](\s|\S)(\d[0-9]{8,16})$/
		return regexp.test(this.state.phoneNumber)
	}
	handleSendCode = () => {
		// Request to send OTP
		if (this.validatePhoneNumber()) {
		  firebase
			.auth()
			.signInWithPhoneNumber(this.state.phoneNumber)
			.then(confirmResult => {
			  this.setState({ confirmResult })
			})
			.catch(error => {
			  alert(error.message)
			   
			})
		} else {
		  alert('Invalid Phone Number')
		}
	  }
	changePhoneNumber = () => {
		this.setState({ confirmResult: null, verificationCode: '' })
	}
	handleVerifyCode = () => {
		// Request for OTP verification
		const { confirmResult, verificationCode } = this.state
		if (verificationCode.length == 6) {
		  confirmResult
			.confirm(verificationCode)
			.then(user => {
				 
			  this.setState({ userId: user.user.uid })
			  this._backendSignIn(user.user.uid,user.user.email,user.user.displayName,'https://www.pngitem.com/pimgs/m/272-2720607_this-icon-for-gender-neutral-user-circle-hd.png',user.user.phoneNumber);
			   
			})
			.catch(error => {
			  alert(error.message)
			   
			})
		} else {
		  alert('Please enter a 6 digit OTP code.')
		}
	  }
	  renderConfirmationCodeView = () => {
		return (
		  <View style={styles.verificationView}>
			<OTPTextInput inputCount={6} textInputStyle={{color:'white'}} handleTextChange= {(text) => {
				this.setState({verificationCode:text})}}/>
			<Button outline style={[styles.themeButton, { marginTop: 20 }]}
				title='Verify OTP'
				onPress={this.handleVerifyCode}>
			</Button>
		</View>
			
		)
	  }
	async fetchUserInfo(email){
		var url = SERVER_URL+"/user/getUserByEmail";
		 
		axios.post(url,{'email':email})
        .then(response => {
            if (response.data) {
				AsyncStorage.setItem('membership',response.data.user.membership);
            }
        })
        .catch(error => {
			this.error=true;
             
        });
	}
	getCurrentUserInfo = async () => {
		try {
			 
		  const token1 = await AsyncStorage.getItem('token');
		   
		  var userInfo=null; 
		//   if(token1==null)
		  	// userInfo = await GoogleSignin.signInSilently();
		  if(token1!=null){
			// if(this.pending())
			// 	this.props.navigation.navigate('Additional Details',{navigation:this.props.navigation,email:this.state.email,phoneNumber:this.state.phoneNumber,
			// 		name:this.state.name,state:this.state.state,city:this.state.city});
			// else{
				this.props.navigation.navigate('GoHappy Club');
				this.setState({loader:false});
				return;
			// }
		  }
		  this.setState({ userInfo });
		   
		  var token = userInfo['idToken'];
		  var email = userInfo['user']['email'];
		  var name = userInfo['user']['name'];
		  var profileImage = userInfo['user']['photo'];
		  await this.fetchUserInfo(email);
		  AsyncStorage.setItem('name',name);
		  AsyncStorage.setItem('email',email);
		  AsyncStorage.setItem('profileImage',profileImage);
		  AsyncStorage.setItem('token',token);
		//   this.props.navigator.resetTo({
		// 	title: 'GoHappy Club',
		// 	component: 'GoHappy Club',
		// })
		  if(this.pending())
		  	this.props.navigation.navigate('Additional Details',{navigation:this.props.navigation,email:this.state.email,phoneNumber:this.state.phoneNumber,
					name:this.state.name,state:this.state.state,city:this.state.city});
		  else
		  	this.props.navigation.navigate('GoHappy Club');
		  
		  this.setState({loader:false});
		} catch (error) {
		  if (error.code === statusCodes.SIGN_IN_REQUIRED) {
			// user has not signed in yet
		  } else {
			// some other error
		  }
		}
	  };
	componentDidMount(){
		// this.getCurrentUserInfo();
	}
	// signOut = async () => {
	// 	try {
	// 	  await GoogleSignin.revokeAccess();
	// 	  await GoogleSignin.signOut();
	// 	  setloggedIn(false);
	// 	  setuserInfo([]);
	// 	} catch (error) {
	// 	  console.error(error);
	// 	}
	//   };
	_backendSignIn(token,email,name,profileImage,phone){
		var url = SERVER_URL+"/auth/login";
		axios.post(url, {'token':token,'email':email,'name':name,'profileImage':profileImage,'phone':phone})
		.then(response => {
			 console.log('backend sign in',response)
				if (response.data && response.data!="ERROR") {
				  // this.setState({fullName: userInfo.fullName});
				  if(response.data.phone!=null)
				  AsyncStorage.setItem('phoneNumber',response.data.phoneNumber);
				  // AsyncStorage.setItem('fullName',response.data.fullName);
				   
				  if(response.data.name!=null) 
				  AsyncStorage.setItem('name',response.data.name);
				  if(response.data.email!=null)
				  AsyncStorage.setItem('email',response.data.email);
				  if(response.data.profileImage!=null)
				  AsyncStorage.setItem('profileImage',response.data.profileImage);
				  AsyncStorage.setItem('token',token);
				  this.setState({name:response.data.name,email:response.data.email,
						phoneNumber:response.data.phone});
				  // this.props.navigation.navigate('DrawerNavigator');
				  if(this.pending()){
					this.props.navigation.navigate('Additional Details',{navigation:this.props.navigation,email:this.state.email,phoneNumber:this.state.phoneNumber,
						name:this.state.name,state:this.state.state,city:this.state.city});
					return;
				  }
				  else{
					this.setState({loader:true});
					this.props.navigation.navigate('GoHappy Club');
					this.setState({loader:false});
				  }
				}
				else if(response.data=="ERROR"){
					this.setState({showAlert:true,loader:false})
				}
		})
		.catch(error => {
				 
		});
	}
    // _signIn = async () => {
    //     try {
    //       await GoogleSignin.hasPlayServices();
    //       const userInfo = await GoogleSignin.signIn();
           
    //       this.setState({ userInfo });
	// 	  var token = userInfo['idToken'];
	// 	  var email = userInfo['user']['email'];
	// 	  var name = userInfo['user']['name'];
	// 	  var profileImage = userInfo['user']['photo'];
	// 	  await this.fetchUserInfo(email);
	// 	  this._backendSignIn(token,email,name,profileImage,'');
		  
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
	pending(){
		console.log('state in pending',this.state);
		if((this.state.email==null || this.state.email.length==0)|| (this.state.phoneNumber==null || this.state.phoneNumber.length==0)||(this.state.name==null || this.state.name.length==0))
			return true;
		return false;
	}
	render() {
		if(this.state.loader==true){
			// return (<ActivityIndicator size='large' color="#0A1045" style={{flex: 1,justifyContent: "center",flexDirection: "row",justifyContent: "space-around",padding: 10}}/>);
			return (<MaterialIndicator color='white' style={{backgroundColor:"#0A1045"}}/>)
		}
		const navigation = this.props.navigation;
		const title = 'Login';
		return (
			<View style={styles.container1}>
				
					<Text style={styles.title}>Login </Text>
					<Text style={{marginTop:'3%',fontSize:20,color:'white',alignSelf:'center',fontWeight:'bold'}}>to</Text>
					<Text style={{marginTop:'5%',fontSize:30,color:'white',alignSelf:'center',fontWeight:'bold'}}>GoHappy Club</Text>
					<Text style={{marginTop:'5%',fontSize:15,color:'white',alignSelf:'center'}}>
						India ka sabse khush pariwar
					</Text>


						<View style={styles.page}>
							<PhoneInput
							style={styles.textInput}
								ref={this.state.phoneNumber}
								keyboardType='phone-pad'
								defaultCode="IN"
								layout="first"
								onChangeText={(text) => {
									this.setState({phoneNumber:text})
								}}
								onChangeFormattedText={(text) => {
								 
								this.setState({phoneNumber:text});
								}}
								withDarkTheme
								withShadow
								autoFocus
							/>
							<Button outline style={[styles.themeButton, { marginTop: 20 }]}
								title={this.state.confirmResult ? 'Change Phone Number' : 'Get OTP'}
								onPress={this.state.confirmResult
									? this.changePhoneNumber
									: this.handleSendCode}>
							</Button>
							{this.state.confirmResult ? this.renderConfirmationCodeView() : 
								(<>
									{/* <Text style={{color:'white',alignSelf:'center',marginTop:'9%'}}>OR</Text>
										<GoogleSigninButton 
												style={{width: 192, height: 48,alignSelf:'center',marginTop:'9%'}}
												size={GoogleSigninButton.Size.Wide}
												color={GoogleSigninButton.Color.Dark}
												onPress={this._signIn}
										/> */}
								</>)}
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
			 </View>
		);
	}

}

const styles = StyleSheet.create({
	title: {
		fontSize: 20,
    	fontWeight: "bold",
		color:'white',
		marginTop:'30%',
		alignSelf:'center'
	},
	container1: {
		flex: 1,
		backgroundColor: '#0A1045',
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