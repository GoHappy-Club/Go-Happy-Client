import React, {Component} from 'react';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards';
import { RefreshControl,FlatList,SafeAreaView,ScrollView,TouchableOpacity,TouchableHighlight,TouchableWithoutFeedback, StyleSheet, View, TextInput, Image, KeyboardAvoidingView } from 'react-native';
import { Text , Button} from 'react-native-elements';

import { Card as Cd, Title, Paragraph,  Avatar,
	Caption,
	Drawer,
	TouchableRipple,
	Switch } from 'react-native-paper';
import { PermissionsAndroid } from 'react-native';
import Contacts from 'react-native-contacts';
// import AlphabetFlatList from "react-native-alphabet-flat-list";

export default class Refer extends Component {
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
			profileImage: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/da/Matt_LeBlanc_as_Joey_Tribbiani.jpg/220px-Matt_LeBlanc_as_Joey_Tribbiani.jpg',
		}
		this._retrieveData();
	}
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


	_contacts(){
		console.log('got into contacts');
		PermissionsAndroid.request(
			PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
			{
			  'title': 'Contacts',
			  'message': 'This app would like to view your contacts.',
			  'buttonPositive': 'Please accept bare mortal'
			}
		  )
			.then(Contacts.getAll()
			  .then((contacts) => {
				  // work with contacts
				  this.setState({DATA:contacts});
					console.log(contacts)
				  })
					.catch((e) => {
						console.log(e)
					}))
	}
	Item = ({ title }) => (
		<View style={styles.item}>
		  <Text style={styles.title}>{title}</Text>
		</View>
	  );
	render() {
		const renderItem = ({ item }) => (
			<View >
		  <Text >{item.displayName}</Text>
		</View>
		  );

		return (
            <ScrollView
			refreshControl={
				<RefreshControl
				  refreshing={this.state.refreshing}
				  onRefresh={this._onRefresh.bind(this)}
				/>
			  }>
				<Text>Test</Text>
				<Button onPress={this._contacts.bind(this)}
				title="hello"/>
				
				{/* <AlphabetFlatList
					data={data}
					itemHeight={CONTACT_ITEM_HEIGHT}
					headerHeight={HEADER_HEIGHT}
					renderItem={ContactItem}
					ListHeaderComponent={(
					<View style={{
						height: HEADER_HEIGHT,
						justifyContent: 'center',
						alignItems: 'center'
					}}>
						<Text>ListHeaderComponent</Text>
					</View>
					)}
				/> */}
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({

	card: {
		backgroundColor: "white",
		marginBottom: 10,
		borderRadius: 20,
		borderWidth: 1,
		borderColor: '#fff',
	},
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