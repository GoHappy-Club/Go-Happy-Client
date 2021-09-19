import React, {Component} from 'react';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards';
import { ScrollView,TouchableOpacity,TouchableHighlight,TouchableWithoutFeedback, StyleSheet, View, TextInput, Image, KeyboardAvoidingView, Dimensions } from 'react-native';

import { Card as Cd, Title, Paragraph, Avatar } from 'react-native-paper';
import { white } from 'react-native-paper/lib/typescript/styles/colors';
import { Text, Button} from 'react-native-elements';


export default class Membership extends Component {
	constructor(props)
	{
		super(props);
		this.state = {
			phoneNumber: '',
			password: '',showAlert:false,loader:false,
			profileImage: 'https://www.dmarge.com/wp-content/uploads/2021/01/dwayne-the-rock-.jpg',
			name: '',
			email:'',
			city:'Pune',
			state:'Maharashtra'
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
    planBox(price,duration,unit){
        return (
            <View style={{width:'50%'}}>
                <TouchableOpacity onPress={this._onPressButton}>
                <View style={{backgroundColor:'black',backgroundColor: 'white', 
                    shadowColor: "black",
                    shadowOffset: { height: 2},
                    shadowOpacity: 0.3, borderRadius:10,
                    height:100,margin:30,justifyContent:'center',
                    alignItems:'center'
				}}>
                    <Text style={{fontSize:30}}>₹{price}</Text> 
                    <Text>{duration} {unit}</Text>                    
                </View>
                </TouchableOpacity>
            </View>
        )
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
					
					<Text h1 style={{fontWeight:'bold',marginTop:'25%'}}>Choose your plan</Text>
					<View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
                        {this.planBox(100,30,'days')}
                        {this.planBox(300,45,'days')}
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
                    {this.planBox(550,6,'months')}
                    {this.planBox(1100,1,'year')}
                    </View>

                    <Text h4 style={{marginLeft:20,width:Dimensions.get('window').width*0.9}}>Payment Methods</Text>
					<View style={{marginTop:20,width:Dimensions.get('window').width*0.9}}>
						<TouchableOpacity style={{width:'100%',borderTopWidth:1,borderColor:'#E0E0E0'}} onPress={this._onPressButton}>
							<View>
								<Text style={styles.optionList}>Google Pay</Text>
							</View>
						</TouchableOpacity>
					</View>
					<View style={{width:Dimensions.get('window').width*0.9}}>
						<TouchableOpacity style={{width:'100%',borderTopWidth:1,borderColor:'#E0E0E0'}} onPress={this._onPressButton}>
							<View >
								<Text style={styles.optionList}>Apple Pay</Text>
							</View>
						</TouchableOpacity>
					</View>
					<View style={{width:Dimensions.get('window').width*0.9}}>
						<TouchableOpacity style={{width:'100%',borderTopWidth:1,borderColor:'#E0E0E0'}} onPress={this._onPressButton}>
							<View >
								<Text style={styles.optionList}>PhonePe</Text>
							</View>
						</TouchableOpacity>
					</View>
					<View style={{width:Dimensions.get('window').width*0.9}}>
						<TouchableOpacity style={{width:'100%',borderTopWidth:1,borderColor:'#E0E0E0'}} onPress={this._onPressButton}>
							<View >
								<Text style={styles.optionList}>Paytm</Text>
							</View>
						</TouchableOpacity>
					</View>
					<View style={{width:Dimensions.get('window').width*0.9}}>
						<TouchableOpacity style={{width:'100%',borderTopWidth:1,borderColor:'#E0E0E0'}} onPress={this._onPressButton}>
							<View >
								<Text style={styles.optionList}>Debit Card</Text>
							</View>
						</TouchableOpacity>
					</View>
					<View style={{width:Dimensions.get('window').width*0.9}}>
						<TouchableOpacity style={{width:'100%',borderTopWidth:1,borderColor:'#E0E0E0',borderBottomWidth:1}} onPress={this._onPressButton}>
							<View>
								<Text style={styles.optionList}>Credit Card</Text>
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