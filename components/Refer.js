import React, {Component} from 'react';
import { Share,Button,RefreshControl,FlatList,SafeAreaView,ScrollView,TouchableOpacity,TouchableHighlight,TouchableWithoutFeedback, StyleSheet, View, TextInput, Image, KeyboardAvoidingView } from 'react-native';
import { Text } from 'react-native-elements';
import { connect } from 'react-redux';
import { setProfile } from '../redux/actions/counts';
import { bindActionCreators } from 'redux';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import firebase from '@react-native-firebase/app'
import { faInfoCircle,faShareAlt} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon  } from '@fortawesome/react-native-fontawesome'
import { CopyToClipboard } from 'react-copy-to-clipboard';

class Refer extends Component {
	constructor(props)
	{
		super(props);
		this.state = {
			phoneNumber: '',
			email:'',
			password: '',showAlert:false,loader:false,
			mySession: [],
			refreshing:false,
			DATA:[],
			referralLink:String,
			profileImage: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/da/Matt_LeBlanc_as_Joey_Tribbiani.jpg/220px-Matt_LeBlanc_as_Joey_Tribbiani.jpg',
		}
		this._retrieveData();
	}
	shareMessage = () => {
		//Here is the Share API
		Share.share({
		  message: "You're invited. Use my link to join GoHappy Club: "+this.state.referralLink,
		})
		  //after successful share return result
		  .then((result) => console.log(result))
		  //If any thing goes wrong it comes here
		  .catch((errorMsg) => console.log(errorMsg));
	  };
	_retrieveData = async () => {
		try {
			console.log('dsadadadadada',await AsyncStorage.getAllKeys());
		  const email = await AsyncStorage.getItem("email");
		  this.setState({email:email});	
		} catch (error) {
		  // Error retrieving data
		  console.log('error here',error)
		}
	  };
	static getDerivedStateFromProps(nextProps, prevState) {
		if(nextProps.mySessions!==prevState.mySessions){
			return { mySessions: nextProps.mySessions};
		 }
		 else return null;
	}
	trimContent(text,cut){
		if(text.length<cut)
			return text;
		return text.substring(0,cut)+'...';
	}
	_onRefresh(){
		this.setState({refreshing:true});
		var _this = this;
		this.props.loadMySessions("",function(){
			console.log('i am in callback');
			_this.setState({refreshing:false});
		});
	}
	Item = ({ title }) => (
		<View style={styles.item}>
		  <Text style={styles.title}>{title}</Text>
		</View>
	  );
	createDynamicReferralLink= async () => {
		let selfInviteCode=this.props.profile.selfInviteCode;
		// alert('hi');
	  const link1 = await firebase.dynamicLinks().buildShortLink({
		  link: 'https://gohappyclub.in/refer?idx='+selfInviteCode,
		  domainUriPrefix: 'https://gohappyclub.page.link',
		},firebase.dynamicLinks.ShortLinkType.SHORT);
		console.log(link1);
		this.setState({referralLink:link1});
	}
	componentDidMount(){
		this.createDynamicReferralLink();
	  }
	render() {
		const {profile} = this.props;
		const {referralLink} = this.state;
		console.log('sfasfsd',profile); 
		return (
            <View style={{backgroundColor:'white'}}>
				<Text style={styles.title}>Refer & Win</Text>
				<Text style={styles.subtitle}>Refer and introduce the club to your contacts</Text>
				<View style={{marginLeft:'14%',marginTop:'15%',display:'flex',flexDirection:'row'}}>
					<FontAwesomeIcon icon={ faInfoCircle } color={ '#ffc8c8' } size={20}/>
					<Text style={styles.info}>How it works</Text>
				</View>


				<View style={{display:"flex", flexDirection:'row',alignSelf:'center'
					,margin:'5%'}}>
					<View style={styles.circleNumber}>
						<View style={{display:"flex", flexDirection:'row'}}>
							<View style={styles.cicle}>
								<Text style={styles.number}>1</Text>
							</View>
							<Text style={styles.dashes}>----</Text>
						</View>
						<Text style={{fontSize:10,width:'70%',textAlign:'center',marginLeft:-10}}>Invite your friends</Text>
					</View>
					<View style={styles.circleNumber}>
					<View style={{display:"flex", flexDirection:'row'}}>
							<View style={styles.cicle}>
								<Text style={styles.number}>2</Text>
							</View>
							<Text style={styles.dashes}>----</Text>
						</View>
						<Text style={{fontSize:10,width:'60%',textAlign:'center',marginLeft:-10}}>They join using your link</Text>
					</View>
					<View style={styles.circleNumber}>
						<View style={{display:"flex", flexDirection:'row'}}>
							<View style={styles.cicle}>
								<Text style={styles.number}>3</Text>
							</View>
						</View>
						<Text style={{fontSize:10,width:'60%',textAlign:'center'}}>You win a reward</Text>
					</View>

				</View>


				<View style={styles.clip}>
					<Text style={styles.link}>{referralLink}</Text>
					<TouchableOpacity style={{...styles.copyButton,backgroundColor:'#2bbdc3'}} underlayColor={"#2bbdc3"} onPress = {() => this.shareMessage.bind(this)}>
							<Text style={{color:'black',fontWeight:'bold'}}>Copy</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.messageBox}>
					<Text style={styles.messageText}>Share you referral link and invite your friends and win rewards.</Text>
					<TouchableOpacity style={styles.referButton} underlayColor={"#2bbdc3"} onPress = {this.shareMessage.bind(this)}>
						<View style={{display:'flex',flexDirection:'row'}}>
							<FontAwesomeIcon icon={faShareAlt} size={20}/>
							<Text style={styles.referButtonText}>REFER NOW</Text>
						</View>
					</TouchableOpacity>
				</View>
				{/* <Button onPress={this.shareMessage.bind(this)}
				title="Share with friends"></Button> */}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	circleNumber: {
		display: 'flex',
		flexDirection:'column'
	},
	dashes: {

		fontSize:38,
		fontWeight:'bold'
	},
	number: {
		alignSelf:'center',
		fontSize:38,
		fontWeight:'bold'
	},
	cicle: {
		borderRadius:80,
		backgroundColor:'#ffc8c8',
		width:50,
		height:50,
	},
	referButton: {
		marginTop:'3%',
		marginBottom:'3%',
		backgroundColor:'#ff8159',
		paddingTop:8,
		paddingBottom:8,
		paddingLeft:16,
		paddingRight:16,
		
	},
	referButtonText: {
		fontWeight:'bold',
		justifyContent:'center',
		alignSelf:'center',
		marginLeft:'10%'
	},
	messageBox:{
		width:'90%',
		backgroundColor:'#fef9f3',
		alignSelf:'center',
		alignItems: 'center',
		marginTop:'5%',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.5,
		shadowRadius: 2,
		elevation: 2,
	},
	messageText: {
		marginTop:'3%',
		width:'80%',
		backgroundColor:'#fef9f3',
		textAlign:'center',
		alignSelf:'center',
		fontWeight:'bold'
	},
	title: {
		color: 'black',
		marginTop: '7%',
		fontWeight: "bold",
		textAlign: 'center',
		fontSize: 32,
	},
	subtitle: {
		color: 'black',
		marginTop: 6,
		textAlign: 'center',
		fontSize: 14,
	},
	info: {
		marginLeft: '2%',
		color:'#ffb5b5'
	},
	link: {
		backgroundColor:'#b1f2f4',
		padding:5,
		marginTop:40,
		fontWeight:'700',
		alignSelf:'center',
		width:'88%',
	},
	clip:{
		display:'flex',
		flexDirection:'row',
		width:'90%',
		alignSelf:'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.5,
		shadowRadius: 2,
		elevation: 2,
	},
	copyButton:{
		height:'42%',
		marginTop:40,
		padding:5,
	},
});
const mapStateToProps = state => ({
	profile:state.profile.profile
  });

  const ActionCreators = Object.assign(
	{},
	{setProfile}
  );
  const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators(ActionCreators, dispatch),
  });
  export default connect(mapStateToProps, mapDispatchToProps)(Refer)