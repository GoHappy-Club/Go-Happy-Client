import React, {Component} from 'react';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards';
import { ScrollView,TouchableOpacity,TouchableHighlight,TouchableWithoutFeedback, StyleSheet, View, Button, TextInput, Image, Text, KeyboardAvoidingView } from 'react-native';

import { Card as Cd, Title, Paragraph } from 'react-native-paper';



export default class MySessions extends Component {
	constructor(props)
	{
		super(props);
		this.state = {
			phoneNumber: '',
			password: '',showAlert:false,loader:false,

		}
	}
	render() {
		if(this.state.loader==true){
			// return (<ActivityIndicator size='large' color="#0A1045" style={{flex: 1,justifyContent: "center",flexDirection: "row",justifyContent: "space-around",padding: 10}}/>);
			return (<MaterialIndicator color='white' style={{backgroundColor:"#0A1045"}}/>)
		}
		const navigation = this.props.navigation;
		const title = 'Login';
		return (
            <ScrollView>
                
                <ScrollView>
                    <Card>
                        <CardTitle
                        subtitle="Health Awareness"
                        />
                        <CardContent text="Event Date: 18th August 2021 " />
						<CardContent text="Event Time: 06:00 pm - 07:00 pm" />
                        <CardAction 
                        separator={true} 
                        inColumn={false}>
                        <CardButton
                            onPress={() => {}}
                            title="Not Started Yet"
                            color="#FEB557"
                        />
                        </CardAction>
                    </Card>

                    <Card>
                        <CardTitle
                        subtitle="Antakshari Session"
                        />
						<CardContent text="Event Date: 18th August 2021" />			
						<CardContent text="Event Time: 06:00 pm - 07:00 pm" />  
                        <CardAction 
                        separator={true} 
                        inColumn={false}>
                        <CardButton
                            onPress={() => {}}
                            title="View Recording"
                            color="#FEB557"
                        />
                        </CardAction>
                    </Card>
                    
                    </ScrollView>
                </ScrollView>
		);
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