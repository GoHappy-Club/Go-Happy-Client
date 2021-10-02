import React, {Component} from 'react';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards';
import { ScrollView,TouchableOpacity,TouchableHighlight,TouchableWithoutFeedback, StyleSheet, View, TextInput, Image, KeyboardAvoidingView, Dimensions } from 'react-native';

import { Card as Cd, Title, Paragraph, Avatar } from 'react-native-paper';
import { white } from 'react-native-paper/lib/typescript/styles/colors';
import { Text, Button} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackActions, NavigationActions } from 'react-navigation';
import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
  } from '@react-native-google-signin/google-signin';

  GoogleSignin.configure({
	webClientId: '908368396731-fr0kop29br013r5u6vrt41v8k2j9dak1.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
	offlineAccess: true,
	// hostedDomain: '', // specifies a hosted domain restriction
	// loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
	// forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
	// accountName: '', // [Android] specifies an account name on the device that should be used
	iosClientId: '908368396731-vppvalbam1en8cj8a35k68ug076pq2be.apps.googleusercontent.com', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
  });

export default class Profile extends Component {
	constructor(props)
	{
		super(props);
		this.state = {
			phoneNumber: '',
			password: '',showAlert:false,loader:false,
			profileImage: '',
			name: '',
			email:'',
			membership:'',
			city:'Pune',
			state:'Maharashtra'
		}
		this._retrieveData();
	}
	_signout = async () => {
		try {
		  await GoogleSignin.revokeAccess();
		  await GoogleSignin.signOut();
		  AsyncStorage.clear();
		  this.props.navigation.reset({
			index: 0,
			routes: [{ name: 'Login' }],
		  });
		} catch (error) {
		  console.error(error);
		}
	  };
	_retrieveData = async () => {
		try {
			console.log('dsadadadadada',await AsyncStorage.getAllKeys());
		  const name = await AsyncStorage.getItem("name");
		  const email = await AsyncStorage.getItem("email");
		  const profileImage = await AsyncStorage.getItem("profileImage");
		  const membership = await AsyncStorage.getItem("membership");
		  this.setState({name:name});
		  this.setState({email:email});
		  this.setState({profileImage:profileImage});
		  this.setState({membership:membership})
		  console.log('get async',membership);
		  
		} catch (error) {
		  // Error retrieving data
		  console.log('error here',error)
		}
	  };
	  componentDidMount = () => {
		this.focusListener = this.props.navigation.addListener('focus',
		   () => { 
				   console.log('focus is called'); 
				   this._retrieveData();
			}
		 );
	}
	render() {
		if(this.state.loader==true){
			// return (<ActivityIndicator size='large' color="#0A1045" style={{flex: 1,justifyContent: "center",flexDirection: "row",justifyContent: "space-around",padding: 10}}/>);
			return (<MaterialIndicator color='white' style={{backgroundColor:"#0A1045"}}/>)
		}
		const navigation = this.props.navigation;
		const title = 'Login';
		return (
			<View style = {{
				backgroundColor: 'white',flex:1
			}}>
				<ScrollView style = {{
					backgroundColor: 'white',height:'100%'
				}}
				contentContainerStyle={{justifyContent: 'center',
				alignItems: 'center'}}
				>
					
					<View style = {{
						backgroundColor: 'white', 
						shadowColor: "black",
						shadowOffset: { height: 2},
						shadowOpacity: 0.3,
						width:'100%',
						height:(Dimensions.get('window').height)/3,
						justifyContent: "center",
					}}>
						<Image
						style={styles.cover}
						source={{
						uri: this.state.profileImage,
						}}
						/>
						<View style={{ position: 'absolute', top: 0, paddingLeft:20, height: '170%', alignItems: 'flex-start', justifyContent: 'center' }}>
							<Text h3 style={{overflow:"hidden",paddingLeft:4,color:'white',
							}}>
								{this.state.name}
							</Text>
							<Text style={{overflow:"hidden",paddingLeft:4,color:'white',
								}}>
								{this.state.city}, {this.state.state}
							</Text>
						</View>
					</View>

					<View style={{backgroundColor:'black',backgroundColor: 'white', 
						shadowColor: "black",
						shadowOffset: { height: 2},
						shadowOpacity: 0.3, borderRadius:10,
						width:Dimensions.get('window').width*0.9,height:80,marginTop:-10
					}}>
						
						<View style={{flex: 1,
							flexDirection: 'row',
							flexWrap: 'wrap',
							alignItems: 'flex-start'}}
						>
							<View style={{width: '33%',height:'100%',borderColor:'#E0E0E0'
							,borderRightWidth:1,justifyContent:'center',alignContent:'center'}}>
								<Text style={{...styles.cardText,fontWeight: "bold"}}>20</Text>
								<Text style={{...styles.cardText}}>Sessions Left</Text>
							</View>
							<View style={{width: '33%',height:'100%',borderColor:'#E0E0E0'
							,borderRightWidth:1,justifyContent:'center',alignContent:'center'}}>
								<Text style={{...styles.cardText,fontWeight: "bold"}}>XX-XX-XX-XX</Text>
								<Text style={{...styles.cardText}}>To Be Decided</Text>
							</View>
							<View style={{width: '33%',height:'100%',justifyContent:'center',alignContent:'center'}}>
								<Text style={{...styles.cardText,fontWeight: "bold"}}>{this.state.membership}</Text>
								<Text style={{...styles.cardText}}>Plan</Text>
							</View>
						</View>
					</View>
					<View style={{marginTop:20,width:Dimensions.get('window').width*0.9}}>
						<TouchableOpacity style={{width:'100%',borderTopWidth:1,borderColor:'#E0E0E0'}} onPress={() => {this.props.navigation.navigate('Membership Details')}}>
							<View>
								<Text style={styles.optionList}>Subscriptions and Plans</Text>
							</View>
						</TouchableOpacity>
					</View>
					<View style={{width:Dimensions.get('window').width*0.9}}>
						<TouchableOpacity style={{width:'100%',borderTopWidth:1,borderColor:'#E0E0E0'}} onPress={this._onPressButton}>
							<View >
								<Text style={styles.optionList}>Refer and Earn</Text>
							</View>
						</TouchableOpacity>
					</View>
					<View style={{width:Dimensions.get('window').width*0.9}}>
						<TouchableOpacity style={{width:'100%',borderTopWidth:1,borderColor:'#E0E0E0'}} onPress={this._onPressButton}>
							<View >
								<Text style={styles.optionList}>About GoHappy Club</Text>
							</View>
						</TouchableOpacity>
					</View>
					<View style={{width:Dimensions.get('window').width*0.9}}>
						<TouchableOpacity style={{width:'100%',borderTopWidth:1,borderColor:'#E0E0E0'}} onPress={this._onPressButton}>
							<View >
								<Text style={styles.optionList}>Privacy Policy</Text>
							</View>
						</TouchableOpacity>
					</View>
					<View style={{width:Dimensions.get('window').width*0.9}}>
						<TouchableOpacity style={{width:'100%',borderTopWidth:1,borderColor:'#E0E0E0'}} onPress={this._onPressButton}>
							<View >
								<Text style={styles.optionList}>Terms & Conditions</Text>
							</View>
						</TouchableOpacity>
					</View>
					<View style={{width:Dimensions.get('window').width*0.9}}>
						<TouchableOpacity style={{width:'100%',borderTopWidth:1,borderColor:'#E0E0E0',borderBottomWidth:1}} onPress={this._signout.bind(this)}>
							<View>
								<Text style={styles.optionList}>Logout</Text>
							</View>
						</TouchableOpacity>
					</View>
					{/* <View >
							<View>
								<Text >GoHappy Club from GoIndependent.in</Text>
								<Text >All rights reserved</Text>
							</View>
					</View> */}
				</ScrollView>
				
				
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container1: {
		flex: 1,
		backgroundColor: '#0A1045'
	},
	cover:{
		flex: 1,
    	justifyContent: "center",

	},
	cardText:{
		textAlign:'center',
		marginTop:10
	},
	optionList:{
		fontSize:16,
		padding:10,
		color:'#424242'
	}
});