import React, {Component} from 'react';
import { SafeAreaView,NativeSyntheticEvent,Dimensions,TouchableOpacity,ImageBackground,Image,Text,StyleSheet, View,KeyboardAvoidingView,Keyboard,TouchableWithoutFeedback} from 'react-native';

import axios from 'axios';
import AwesomeAlert from 'react-native-awesome-alerts';
import PhoneInput from "react-native-phone-number-input";
import {
  MaterialIndicator,
} from 'react-native-indicators';
import Video from 'react-native-video'

import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
  } from '@react-native-google-signin/google-signin';
import firebase from '@react-native-firebase/app'
import '@react-native-firebase/auth';
import { Button } from 'react-native-elements';
import { BottomSheet, ListItem } from 'react-native-elements';
// import OTPTextInput from 'react-native-otp-textinput';
import OTPInputView from '@bherila/react-native-otp-input'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { connect } from 'react-redux';
import { setProfile } from '../../redux/actions/counts.js';
import { bindActionCreators } from 'redux';
import LinearGradient from 'react-native-linear-gradient';
import Dialog from "react-native-dialog";
import { ScrollView } from 'react-native-gesture-handler';

// import OtpInputs from 'react-native-otp-inputs';


// GoogleSignin.configure({
// 	webClientId: '908368396731-fr0kop29br013r5u6vrt41v8k2j9dak1.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
// 	offlineAccess: true,
// 	iosClientId: '908368396731-vppvalbam1en8cj8a35k68ug076pq2be.apps.googleusercontent.com', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
//   });

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
};
class LoginScreen extends Component {
	constructor(props)
	{
		super(props);
		this.state = {
			phoneNumber: '',
			password: '',showAlert:false,loader:true,loadingButton:false,
			userInfo: null,
			confirmResult: null,
			verificationCode:'',
			userId:'',
			email:'',
			name:'',
			state:'',
			city:'',
			conditionDialog: false,
			conditionText:'',
			dob:''
		}
		this.getCurrentUserInfo();
	}
	
	setProfile(name,email,phoneNumber,profileImage,token,plan,sessionsAttended,dob) {
		let { profile, actions } = this.props;
		profile = {name:name,email:email,phoneNumber:phoneNumber,profileImage:profileImage,token:token,membership:plan,sessionsAttended:sessionsAttended,dob:dob};
		actions.setProfile(profile);
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
		console.log('in handle send code');
		this.setState({ loadingButton:true })
		if (this.validatePhoneNumber()) {
		  firebase
			.auth()
			.signInWithPhoneNumber(this.state.phoneNumber)
			.then(confirmResult => {
				console.log('in handle send code inside');
			  this.setState({ confirmResult })
			  this.setState({ loadingButton:false })
			})
			.catch(error => {
			  alert(error.message)
			  this.setState({ loadingButton:false })
			})
		} else {
		  alert('Invalid Phone Number')
		}
	  }
	changePhoneNumber = () => {
		// this.loadingButton=true;
		this.setState({ confirmResult: null, verificationCode: '',phoneNumber:null})
	}
	resendOtp = () => {
		// this.loadingButton=true;
		//this.setState({ confirmResult: null, verificationCode: ''})
		this.handleSendCode();
	}
	handleVerifyCode = () => {
		// Request for OTP verification
		this.setState({ loadingButton:true })
		console.log('fsddfssdfsdfdsfdsfsdfs');
		const { confirmResult, verificationCode } = this.state
		if (verificationCode.length == 6) {
		  confirmResult
			.confirm(verificationCode)
			.then(user => {
		
			  this.setState({ userId: user.user.uid })
			  try{
			  	this._backendSignIn(user.user.uid,user.user.displayName,'https://www.pngitem.com/pimgs/m/272-2720607_this-icon-for-gender-neutral-user-circle-hd.png',user.user.phoneNumber);
			  } 
			  catch(error){
				  console.log(error);
			  }
			  this.setState({ loadingButton:false });
			  console.log('fsddfssdfsdfdsfdsfrwerewrwerwerwerewrewrsdfs');
			})
			.catch(error => {
			  alert(error.message)
			  this.setState({ loadingButton:false })

			  console.log('fwrewrsdfs');
			})
		} else {
		  alert('Please enter a 6 digit OTP code.')

		  console.log('fwrewrsdfsOTP');
		}
	  }
	  
	  renderConfirmationCodeView = () => {
		return (
		  <View style={styles.verificationView}>
			{/* <OTPTextInput inputCount={6} textInputStyle={{color:'white'}} handleTextChange= {(text) => {
				this.setState({verificationCode:text})}}/> */}
				<OTPInputView
					// ref={input => this.otpInput = input}
					style={{width: '80%', height: 60,color:'#000'}}
					pinCount={6}
					// secureTextEntry={true}

					// code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
					// onCodeChanged = {code => { this.setState({code})}}
					// autoFocusOnLoad
					codeInputFieldStyle={styles.underlineStyleBase}
					codeInputHighlightStyle={styles.underlineStyleHighLighted}
					onCodeChanged = {code => { this.setState({verificationCode:code})}}
				/>	
				 {/* <OtpInputs
				 style={{width: '50%', height: 60,color:'#000',backgroundColor:'black'}}
					handleChange={(code) => console.log(code)}
					numberOfInputs={6}
					/> */}
			<Button outline style={[styles.themeButton, { paddingTop:20 }]}
				title='Verify Code'
				loading={this.state.loadingButton}
				onPress={this.handleVerifyCode}
				ViewComponent={LinearGradient}
				linearGradientProps={{
					colors: ['#4c669f', '#3b5998', '#192f6a'],
					start: { x: 0, y: 0.25 },
					end: { x: 0.5, y: 1 },
					locations: [0,0.5,0.6]
					}}>
			</Button>
			<Button type='clear' 
				title='Resend OTP'
				loading={this.state.loadingButton}
				onPress={this.resendOtp.bind(this)}
				>
			</Button>
			<Button type='clear' 
				title='Enter a Different Phone Number'
				loading={this.state.loadingButton}
				onPress={this.changePhoneNumber}
				>
			</Button>
		</View>
			
		)
	  }
	getCurrentUserInfo = async () => {
		try {
			 
		  const token1 = await AsyncStorage.getItem('token');
		   
		  if(token1!=null){
				const name = await AsyncStorage.getItem('name');
				const email = await AsyncStorage.getItem('email');
				const profileImage = await AsyncStorage.getItem('profileImage');
				const token = await AsyncStorage.getItem('token');
				const membership = await AsyncStorage.getItem('membership');
				const phoneNumber = await AsyncStorage.getItem('phoneNumber');
				const sessionsAttended = await AsyncStorage.getItem('sessionsAttended');
				const dob = await AsyncStorage.getItem('dob');
				
				this.setProfile(name,email,phoneNumber,profileImage,token,membership,sessionsAttended,dob);
				this.props.navigation.replace('GoHappy Club');
				// this.setState({loader:false});
				return;
			// }
		  }
		  this.setState({loader:false});
		} catch (error) {
		  if (error.code === statusCodes.SIGN_IN_REQUIRED) {
			// user has not signed in yet
		  } else {
			// some other error
		  }
		}
	  };
	_backendSignIn(token,name,profileImage,phone){
		console.log(token,name,profileImage,phone);
		if(name==null){
			name='';
		}
		var url = SERVER_URL+"/auth/login";
		axios.post(url, {'token':token,'name':name,'profileImage':profileImage,'phone':phone.substr(1)})
		.then(response => {
			 console.log('backend sign in',response)
				if (response.data && response.data!="ERROR") {
				  // this.setState({fullName: userInfo.fullName});
				  if(response.data.phone!=null)
				  AsyncStorage.setItem('phoneNumber',response.data.phone);
				  // AsyncStorage.setItem('fullName',response.data.fullName);
				   
				  if(response.data.name!=null) 
				  AsyncStorage.setItem('name',response.data.name);
				  if(response.data.email!=null)
				  AsyncStorage.setItem('email',response.data.email);
				  if(response.data.profileImage!=null)
				  AsyncStorage.setItem('profileImage',response.data.profileImage);
				  AsyncStorage.setItem('token',token);
				  AsyncStorage.setItem('membership',response.data.membership);
				  AsyncStorage.setItem('sessionsAttended',response.data.sessionsAttended);
				  AsyncStorage.setItem('dob',response.data.dob);
				  this.setProfile(response.data.name,response.data.email,response.data.phone,response.data.profileImage,token,response.data.membership,response.data.sessionsAttended,response.data.dob)
				  this.setState({name:response.data.name,email:response.data.email,
						phoneNumber:response.data.phone,dob:response.data.dob});
				  // this.props.navigation.navigate('DrawerNavigator');
				  if(this.pending()){
					this.props.navigation.replace('Additional Details',{navigation:this.props.navigation,email:this.state.email,phoneNumber:this.state.phoneNumber,
						name:this.state.name,state:this.state.state,city:this.state.city,dob:this.state.dob});
					return;
				  }
				  else{
					this.setState({loader:true});
					this.props.navigation.replace('GoHappy Club');
					this.setState({loader:false});
				  }
				}
				else if(response.data=="ERROR"){
					this.setState({showAlert:true,loader:false})
				}
		})
		.catch(error => {
				 console.log(error);
		});
	}
	pending(){
		console.log('state in pending',this.state);
		if((this.state.phoneNumber==null || this.state.phoneNumber.length==0)||(this.state.name==null || this.state.name.length==0)||(this.state.dob==null || this.state.dob.length==0))
			return true;
		return false;
	}
	showConditions(type){
		var pp = 'GoHappy Club, a firm incorporated under the laws of India having registered office at B-306/19, Lane No5, Golden City ,Amritsar (143001),Punjab. ("Company" or "we" or "us" or "our"), provides Services (as defined in the Terms of Service) through its Mobile Application "GoHappy Club"at Google Play Store/Apple Play Store ( collectively referred to as "Platform"). Any Service availed by Users of the Platform (as defined in the Terms of Service) (hereinafter referred to as "you", "your" or "User") through the Platform is conditioned upon your acceptance of the terms and conditions contained in Terms of Service, as available on Platform and this privacy policy ("Privacy Policy"). THIS PRIVACY POLICY HAS BEEN DRAFTED AND PUBLISHED IN ACCORDANCE WITH THE INFORMATION TECHNOLOGY ACT 2000, THE INFORMATION TECHNOLOGY (AMENDMENT) ACT 2008, AND THE INFORMATION TECHNOLOGY (REASONABLE SECURITY PRACTICES AND PROCEDURES AND SENSITIVE PERSONAL DATA OR INFORMATION) RULES 2011. THIS PRIVACY POLICY CONSTITUTES A LEGAL AGREEMENT BETWEEN YOU, AS A USER OF THE PLATFORM AND US, AS THE OWNER OF THE PLATFORM. YOU MUST BE A NATURAL PERSON WHO IS AT LEAST 18 YEARS OF AGE. This privacy policy sets out how GoHappy Club Club uses and protects any information that you give GoHappy club when you use this Application. GoHappy Club is committed to ensuring that your privacy is protected. If we are asking you to provide certain information by which you can be identified while using this Application, then you can be assured that it will only be used in accordance with this privacy statement. GoHappy Club may change this policy from time to time by updating this page. You should check this page from time to time to ensure that you are satisfied with any changes. You undertake that you shall be solely responsible for the accuracy and truthfulness of the Personal Information you share with us.'
	   +'GoHappy Club is committed to ensuring that your privacy is protected. While signing up, some personal information is collected from and about you. This privacy policy sets out the details of how GoHappy Club uses the personal information collected, the manner in which it is collected, by whom as well as the purposes for which it is used.'
	   +'While registering, when you accept the terms of this Privacy Policy and your use of the App signifies your continued acceptance thereof. In order to use the App, you will be required to refer and accept the terms of the Privacy Policy as revised from time to time.'
	   +'Information collected while signing up:'
	   +'Name'
	   +'Email address'
	   +'Mobile number'
	   +'Date of Birth'
	   +'Address'
	   +'Use of Information'
	   
	   +'The personal information collected from or about you above, will be stored locally in the App on your device and will only be uploaded to and used by GoHappy Club'
	   
	   +'The mobile number and email address that you provide at the time of registration may be used to communicate with you through SMS, email, push notifications, or other such means for sending notifications or invites for the upcoming events.'
	   
	   +'We may also use the information to customize the website according to your interests or based on your feedback and reviews.'
	   
	   +'You understand and acknowledge that the Company reserves the right to track your Geographical location ("Track") during the provision of the Services or while using the Application.'
	   
	   
	   +'DATA STORAGE AND DATA PROCESS'
	   
	   +'GoHappy  Club will ensure that any personal information collected from you would be taken in a fair and reasonable manner, and where it has a lawful reason to do so. Use of your personal information by GoHappy Club depends on the purpose for which you access the Platform and/or the nature of GoHappy Club services availed by you. The Company may use or process personal information for the following purposes:'
	   
	   +'For providing information in respect of the services requested and to contact you in relation to the same and when otherwise necessary;'
	   +'for communicating /sending you information / recommendations relating to our services;'
	   +'for enabling and improving the Platform and its content to provide better features and services.;'
	   +'for compliance with internal policies and procedures / regulations of the state or any other law being in process.'
	   +'We will only retain your personal Information collected from you as long as it is necessary to fulfil the purposes as aforementioned. If you have chosen to receive any promotional / marketing communications from us, we will retain Information about your marketing preferences for a reasonable period of time, which will be kept based on the date you last expressed interest in our content or Services while accessing our platform. We may also retain your Information, if necessary, for our legitimate business interests or any other , such as fraud prevention or to maintain the security of our users.'
	   
	   +'We will take all possible reasonable steps to accurately record the Information that you provide to us including any subsequent updates. You can review, update and amend the Information that we maintain about you, and if in case you want to make any change or delete any information, you can request to delete Information about you that is inaccurate, incomplete or irrelevant for legitimate purposes, or is being processed in a way which infringes any applicable legal requirement.'
	   
	   +'We do not collect or otherwise record, process, organize, structure, store, adapt, alter, retrieve, use, disclose by transmission, dissemination or otherwise make available any End-User’s Personal Information or information pertaining to his/her race, religion, caste, sexual orientation or health or any other information that may be deemed to be sensitive the ordinary course of our business.'
	   
	   +'We generally store Information closest to the End-User or Participant where they are located through our data centres available globally. We may transfer your Information to Third-Parties acting on our behalf, for the purposes of processing or storage.'
	   
	   
	   +'GOVERNING STATUTE'
	   
	   +'This Privacy Policy is governed by and is compliant with the Information Technology( Reasonable Security Practices and Procedures and Sensitive Personal Data or Information)Rules 2011, which is designed to protect Personal Information of the End-User(s) of the Services; and other applicable rules and regulations related to privacy.'
	   
	   +'COOKIES'
	   
	   +'We may set "cookies" to track your use of the Platform. Cookies are small, encrypted files that a site or its service provider transfers to your device’s hard drive that enables the sites or service provider’s systems to recognize your device, capture and remember certain information. By using the Application, you signify your consent to our use of cookies for its smooth functioning of the Application and the user interface .'
	   
	   +'DISCLOSURES'
	   
	   +'We do not sell/rent your Personal Information to anybody and will never do so. We have reserved your personal information as per laws of the land, and we may disclose your Personal Information in the following cases:'
	   
	   +'Legal and Regulatory Authorities: Only when we may be required to disclose your Personal Information due to legal or regulatory requirements. In such instances, we reserve the right to disclose your Personal Information as required in order to comply with our legal obligations, including but not limited to complying with court orders, warrants, or discovery requests. We may also disclose your Personal Information(a) to law enforcement officers or others; (b) to comply with a judicial proceeding, court order, or legal process served on us or the Platform; (c) to enforce or apply this Privacy Policy or the Terms of Service or our other policies or Agreements; (d) for an insolvency proceeding involving all or part of the business or asset to which the information pertains; (e) respond to claims that any Personal Information violates the rights of third-parties; (f) or protect the rights, property, or personal safety of the Company, or the general public. You agree and acknowledge that we may not inform you prior to or after disclosures made according to this section.'
	   
	   +'Persons Who Acquire Our Assets or Business: If we sell or transfer any of our business or assets, certain Personal Information may be a part of that sale or transfer. In the event of such a sale or transfer, we will notify you in respect of such changes .'
	   
	   +'Co-branding / Joint Marketing Tie ups : Where permitted by law, we may share your Personal Information with joint marketers/ affiliates with whom we have a marketing arrangement, we would require all such joint marketers to have written contracts with us that specify the appropriate use of your Personal Information, require them to safeguard your Personal Information, and prohibit them from making unauthorized or unlawful use of your Personal Information.'
	   
	   +'DATA RETENTION'
	   
	   +' We will retain your Personal Information for as long as your registration with us is valid and till the time you are using the services . We may also retain and use your Personal Information as necessary to comply with our legal obligations, resolve disputes, and enforce our agreements. Subject to this section, we will try to delete your Personal Information upon reasonable written request for the same. Please note, however, that there might be latency in deleting Personal Information from our servers and backed-up versions might exist even after deletion.'
	   
	   +'SECURITY'
	   
	   +'We value your Personal Information, and protect it on the Platform against loss, misuse or alteration by taking extensive security measures. In order to protect your Personal Information, we have implemented adequate technology and will update these measures as new technology becomes available, as appropriate. All Personal Information is securely stored on a secure cloud setup and all communication takes place via secure SSL communication channels. Although we provide appropriate firewalls and protections, we cannot warrant the security of any Personal Information transmitted as our systems are not hack proof. Data pilferage due to unauthorized hacking, virus attacks, technical issues is possible, and we take no liabilities or responsibilities for it.'
	   
	   +'You are responsible for all actions that take place under your User Account. If you choose to share your User Account details and password or any Personal Information with third parties, you are solely responsible for the same. If you lose control of your User Account, you may lose substantial control over your Personal Information and may be subject to legally binding actions.'
	   
	   +'ACCESSING AND MODIFYING PERSONAL INFORMATION'
	   
	   +' In case you need to access, review, and/or make changes to the Personal Information, you shall have to login to your User Account and change the requisite details. You shall keep your Personal Information updated to help us better serve you.'
	   +'.'
	   
	   
	   +'COMMUNICATIONS FROM THE PLATFORM'
	   
	   +'Special Offers and Updates: We may send you information on services, special deals or any other deals in respect of the services being utilised by you. You may also unsubscribe any promotional messages in case you want to opt out and do not want any promotional messages.'
	   
	   +'Service Announcements: On certain occasions or under law, we are required to send out Service or Platform related announcements. We respect your privacy, however you may not opt-out of these communications. These communications would not be promotional in nature.'
	   
	   +'Customer Service: We communicate with Customer(s) on a regular basis to provide requested services and in regard to issues relating to their User Account, services and we will reply via email or phone/ WhatsApp, based on Customer(s) requirements and convenience.'
	   
	   +'INDEMNIFICATION'
	   
	   +'You agree to indemnify us, our subsidiaries, affiliates, officers, agents, co-branders or other partners, and employees and hold us harmless from and against any claims and demand, including reasonable attorneys\' fees, made by any third party arising out of or relating to: (i) Personal Information and contents that you submit or share through the Platform; (ii) your violation of this Privacy Policy, (iii) or your violation of rights of another Customer(s).'
	   
	   +'LIMITATIONS OF LIABILITY'
	   
	   +'You expressly understand and agree that the Company shall not be liable for any direct, indirect, incidental, special, consequential or exemplary damages, including but not limited to, damages for loss of profits, goodwill, use, data, information, details or other intangible losses (even if the Company has been advised of the possibility of such damages), resulting from: (i) the use or the inability to use the Services; (ii) unauthorized access to or alteration of your Personal Information.'
	   
	   +'GOVERNING LAWS AND DUTIES'
	   
	   +'You expressly understand and agree that the Company, including its directors, officers, employees, representatives or the service provider, shall not be liable for any direct, indirect, incidental, special, consequential or exemplary damages, including but not limited to, damages for loss of profits, goodwill, use, data or other intangible losses (even if the Company has been advised of the possibility of such damages), resulting from; (a) use or the inability to avail the Services (b) inability to use the Platform (c) failure or delay in providing the Services or access to the Platform (d) any performance or non-performance by the Company (e) any damages to or viruses that may infect your electronic devices or other property as the result of your access to the Platform or your downloading of any content from the Platform and (f) server failure or otherwise or in any way relating to the Services.'
	   
	   +'JURISDICTION:'
	   
	   +'This Agreement shall be construed and governed by the laws of India and courts of law at Amritsar shall have exclusive jurisdiction over such disputes without regard to principles of conflict of laws.'
	   
	   +'CHANGES TO THIS POLICY'
	   
	   +'We may update this Privacy Policy without notice to you. You are encouraged to check this Privacy Policy on a regular basis to be aware of the changes made to it. Continued use of the Services and access to the Platform shall be deemed to be your acceptance of this Privacy Policy.'
	   
	   +'YOUR ACCEPTANCE OF THE PRIVACY POLICY'
	   +'BY USING OR VISITING THE PLATFORM, YOU SIGNIFY YOUR AGREEMENT OF THIS PRIVACY POLICY. IF YOU DO NOT AGREE TO ANY OF THESE TERMS, PLEASE DO NOT USE THIS PLATFORM OR SERVICES'
	   
	   +'CONTACT US'
	   
	   +'If you have questions, concerns or grievances regarding this Privacy Policy, you can email us at our support email-address: support@gohappyclub.in';
		if(type==0){
			this.setState({conditionText:''});
		}
		else{
			this.setState({conditionText:pp});
		}
		var flag = !this.state.conditionDialog;
		this.setState({conditionDialog:flag});
		
	}
	render() {
		if(this.state.loader==true){
			// return (<ActivityIndicator size='large' color="#0A1045" style={{flex: 1,justifyContent: "center",flexDirection: "row",justifyContent: "space-around",padding: 10}}/>);
			// return (<MaterialIndicator color='white' style={{backgroundColor:"#0A1045"}}/>)
			return (
				<Video source={require('../../images/logo_splash.mp4')}
					style={{position: 'absolute',
							top: 0,flex: 1,
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center',
							left: 0,
							right: 0,
							bottom: 0,
							opacity: 1,}}
							muted={true}
							repeat={true}
							resizeMode="cover"/>
		)
		}
		const navigation = this.props.navigation;
		const title = 'Login';
		return (
			<View style={styles.container}>
				<Image
				resizeMode="contain"
				style={styles.logo}
				source={require('../../images/logo.png')}
				/>

				<Text style={{marginLeft:'10%',fontWeight: 'normal',fontSize:50,color:'black',alignSelf:'flex-start'}}>LOGIN</Text>
					{ !this.state.confirmResult &&  
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
							<Text style={{width:'80%'}}>
							<Text style={{paddingTop: 10,width:'80%',color:'grey',fontSize:12}}>
								By signing up, I agree to the {" "}	
							</Text>
							<Text style={{color: 'blue',width:'80%',fontSize:12}}
									onPress={this.showConditions.bind(this,0)}>
								Terms of service  
							</Text>
							<Text style={{width:'80%',color:'grey',fontSize:12}}>
							{" "} and {" "}
							</Text>
							<Text style={{color: 'blue',width:'80%',fontSize:12}}
									onPress={this.showConditions.bind(this,1)}>
								Privacy Policy  
							</Text>
							<Text style={{width:'80%',color:'grey',fontSize:12}}>
							, including usage of cookies.
							</Text>
							</Text>

							
							<>
								<BottomSheet modalProps={{}} isVisible={this.state.conditionDialog}>
								<Text style={styles.title}>Please Read Below</Text>
									<ListItem
										key='1'
									>
										<ListItem.Content>
										<ListItem.Title>{this.state.conditionText}</ListItem.Title>
										</ListItem.Content>
									</ListItem>
									<ListItem
									key='2'
									containerStyle={{ backgroundColor: 'blue' }}
									onPress={this.showConditions.bind(this,1)}
									>
									<ListItem.Content>
										<ListItem.Title style={{ color: 'white' }}>Close</ListItem.Title>
									</ListItem.Content>
									</ListItem>
								</BottomSheet>
							</>

							
							<Button outline style={[styles.themeButton, { paddingTop:20 }]}
								title={'Login'}
								loading={this.state.loadingButton}
								ViewComponent={LinearGradient}
								linearGradientProps={{
									colors: ['#4c669f', '#3b5998', '#192f6a'],
									start: { x: 0, y: 0.25 },
									end: { x: 0.5, y: 1 },
									locations: [0,0.5,0.6]
									}}

								onPress={this.handleSendCode}>
							</Button>
						</View>
					}
					{ this.state.confirmResult && 
						<View style={styles.page}>
							{ this.renderConfirmationCodeView()}		
						</View>
					}
						<ImageBackground resizeMode="contain"
						style={styles.cover}
						source={require('../../images/login_bg.png')}
						>
						</ImageBackground>
						{/* <Text style={{fontSize:20,color:'black',alignSelf:'center'}}>India ka Sabse Khush Pariwar</Text> */}
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
const { width , height } = Dimensions.get('window');

const styles = StyleSheet.create({
	title: {
		fontSize: 20,
    	fontWeight: "bold",
		color:'white',
		marginTop:'30%',
		alignSelf:'center'
	},
	container: {
		flex: 1,backgroundColor: '#fffaf1',
	},
	containerX:{
		marginTop: 20,
		marginLeft: 10,
		marginRight: 10
	  },
	  titleX: {
		  fontSize: 22,
		  alignSelf: 'center'
	  },
	  tcP: {
		  marginTop: 10,
		  marginBottom: 10,
		  fontSize: 12
	  },
	  tcP:{
		  marginTop: 10,
		  fontSize: 12
	  },
	  tcL:{
		  marginLeft: 10,
		  marginTop: 10,
		  marginBottom: 10,
		  fontSize: 12
	  },
	  tcContainer: {
		  marginTop: 15,
		  marginBottom: 15,
		  height: height * .7
	  },
	
	  button:{
		  backgroundColor: '#136AC7',
		  borderRadius: 5,
		  padding: 10
	  },
	
	  buttonDisabled:{
		backgroundColor: '#999',
		borderRadius: 5,
		padding: 10
	 },
	
	  buttonLabel:{
		  fontSize: 14,
		  color: '#FFF',
		  alignSelf: 'center'
	  },
	container1: {
		flex: 1,
		backgroundColor: '#fffaf1',
		justifyContent: "space-around"
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
		width: 200,
		height: 200,
		alignSelf: 'flex-end',
		marginTop: -20,
		marginRight: -20
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
	cover:{
		flex: 1,
    justifyContent: "center",
	marginBottom:-10
	// width:600,height:'100%'
	},
	page: {
		marginTop:'20%',
		alignItems: 'center',
		justifyContent: 'center',
		// marginBottom: 200
	  },
	  textInput: {
		width: '90%',
		height: 40,
		borderColor: '#555',
		borderWidth: 2,
		borderRadius: 5,
		paddingLeft: 10,
		color: '#fff',
		fontSize: 16,
	  },
	  themeButton: {
		paddingHorizontal: 40,
		paddingVertical: 10,
		borderRadius: 10,
		marginTop: 20
	  },
	  themeButtonTitle: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#fff'
	  },
	  verificationView: {
		width: '100%',
		alignItems: 'center',
		// marginTop: 50
	  },
	  underlineStyleBase: {
		borderColor: "black",
		color:'black'
	  },
	
	  underlineStyleHighLighted: {
		borderColor: "black",
	  },
});

const mapStateToProps = state => ({
	profile:state.profile
  });

  const ActionCreators = Object.assign(
	{},
	{setProfile}
  );
  const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators(ActionCreators, dispatch),
  });
  export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)