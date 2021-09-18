import React, {Component} from 'react';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards';
import { ScrollView,TouchableOpacity,TouchableHighlight,TouchableWithoutFeedback, StyleSheet, View, Button, TextInput, Image, Text, KeyboardAvoidingView, Dimensions } from 'react-native';

import { Card as Cd, Title, Paragraph, Avatar } from 'react-native-paper';
import { white } from 'react-native-paper/lib/typescript/styles/colors';



export default class Profile extends Component {
	constructor(props)
	{
		super(props);
		this.state = {
			phoneNumber: '',
			password: '',showAlert:false,loader:false,
			profileImage: 'https://www.dmarge.com/wp-content/uploads/2021/01/dwayne-the-rock-.jpg',
			name: '',
			email:'',

		}
		this._retrieveData();
	}
	_retrieveData = async () => {
		try {
		  const name = await AsyncStorage.getItem("name");
		  const email = await AsyncStorage.getItem("email");
		  const profileImage = await AsyncStorage.getItem("profileImage");
		  this.setState({name:name});
		  this.setState({email:email});
		  this.setState({profileImage:profileImage});
		  console.log('get async',name);
		  
		} catch (error) {
		  // Error retrieving data
		  console.log('error here',error)
		}
	  };
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
						uri: this.state.profileImage+'0',
						}}
						/>
					</View>

					<View style={{backgroundColor:'black',backgroundColor: 'white', 
						shadowColor: "black",
						shadowOffset: { height: 2},
						shadowOpacity: 0.3,
						width:Dimensions.get('window').width*0.9,height:80,marginTop:-40
					}}>
						<View style={{flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start'}}>
							<View style={{width: '33%'}}>
								<Text>Total Sessions</Text>
							</View>
							<View style={{width: '33%'}}>
								<Text>Sessions Left</Text>
							</View>
							<View style={{width: '33%'}}>
								<Text>Plan</Text>
							</View>
						</View>
					</View>
					<View style={{margin:20,width:Dimensions.get('window').width*0.9}}>
						<Text h3 style={{fontWeight: "bold"}}>
							{this.state.name}
						</Text>
						
						<Text h5 style={{color: "grey",marginTop:5}}>
							{this.state.name}
						</Text>
						<Icon
						name="time-outline" color="grey" size={15} 
						style={{marginTop:20}}>
							
						</Icon>
						<View style={{
							marginTop:2,
							borderBottomColor: 'grey',
							borderBottomWidth: 1,
						}}
						/>
						<Text style={{fontSize:17,color: "grey",marginTop:20,fontWeight:'bold'}}>
							About
						</Text>
						<Text style={{fontSize:17,color: "grey",marginTop:10}}>
							{this.state.name}
						</Text>
						<Text style={{fontSize:17,color: "grey",marginTop:20,fontWeight:'bold'}}>
							Expert
						</Text>
						<View style={{ flexDirection: 'row', justifyContent: 'space-between',marginTop:10}}>
						<View style={{ flex: 1, flexDirection: 'row'}}>
								<Avatar.Image
								source = {{
									uri: this.state.profileImage
								}}
								size={30}
								/>
								{/* <Title style={{color:'#404040',fontSize:13,paddingLeft:10}}>{item.expertName}</Title> */}
							</View>
						</View>
					</View>
					
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
});