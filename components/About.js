import React, {Component} from 'react';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards';
import { ScrollView,TouchableOpacity,TouchableHighlight,TouchableWithoutFeedback, StyleSheet, View, TextInput, Image, KeyboardAvoidingView, Dimensions } from 'react-native';

import { Card as Cd, Title, Paragraph, Avatar } from 'react-native-paper';
import { white } from 'react-native-paper/lib/typescript/styles/colors';
import { Text, Button} from 'react-native-elements';
import RazorpayCheckout from 'react-native-razorpay';


export default class About extends Component {
	constructor(props)
	{
		super(props);
		
	}
	
	render() {
        return (
			<View style = {{
				backgroundColor: 'white',flex:1
			}}>
                <View style={{marginTop:'10%'}}>
                    <Text style={{fontSize:30,textAlign:'center',marginBottom:'8%',fontWeight:'bold'}}>
                        About Us
                    </Text>
                    <Text style={{fontSize:18,paddingLeft:'5%',paddingRight:'5%'}}>
                        GoHappy Club is an initiative with a vision to make happiest community of senior citizens.
                    </Text>
                    <Text style={{fontSize:18,padding:'5%'}}>
                        Our mission is to make senior citizens productive and engaged in their second innings of the lives.
                        We empower them through Live Zoom Interactive Sessions that include Yoga, Tambola, Antakshari, Quizzes, and many more to help them find joy in this pandemic.
                    </Text>
                </View>
				
				
			</View>
		);
	}
}