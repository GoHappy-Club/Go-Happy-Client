import React, {Component} from 'react';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards';
import { ScrollView,TouchableOpacity,TouchableHighlight,TouchableWithoutFeedback, StyleSheet, View, Button, TextInput, Image, Text, KeyboardAvoidingView } from 'react-native';

import { Card as Cd, Title, Paragraph } from 'react-native-paper';



export default class HomeDashboard extends Component {
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
                <ScrollView horizontal={true}>
                    <Cd style={{...styles.card,margin:5,backgroundColor: '#40a8c4',padding:5}}>
                    <Cd.Content>
                    <Paragraph style={{color:'white',marginTop:-8,textAlign:'center'}}>Upcoming Session</Paragraph>
                    <Title style={{color:'white',fontSize:30,textAlign:'center',marginTop:8}}>Tambola</Title>
                    </Cd.Content>
                    </Cd>
                    <Cd style={{...styles.card,margin:5,backgroundColor: '#206a5d',padding:5}}>
                        <Cd.Content>
                        <Paragraph style={{color:'white',marginTop:-8,textAlign:'center'}}>Early Bird Offer </Paragraph>
                        <Title style={{color:'white',fontSize:30,textAlign:'center',marginTop:8}}>50% off</Title>
                        </Cd.Content>
                    </Cd>
                    <Cd style={{...styles.card,margin:5,backgroundColor: '#e94560',padding:5}}>

                        <Cd.Content>
                        <Paragraph style={{color:'white',marginTop:-8,textAlign:'center'}}>Monthly Subscription</Paragraph>
                        <Title style={{color:'white',fontSize:30,textAlign:'center',marginTop:8}}>Rs.500 only</Title>
                        </Cd.Content>
                    </Cd>
                    
                </ScrollView>
                <ScrollView>
                    <Card>
                        <CardImage 
                        source={{uri: 'https://assets.seniority.in/media/ktpl_blog/Edited_Seniors_Day.jpg'}} 
                        title="Health Awareness"
                        />
                        <CardTitle
                        subtitle="Health is Wealth"
                        />
                        <CardContent text="This will contain all the details about the event.This will contain all the details about the event.This will contain all the details about the event.This will contain all the details about the event." />
                        <CardAction 
                        separator={true} 
                        inColumn={false}>
                        <CardButton
                            onPress={() => {}}
                            title="Join"
                            color="#FEB557"
                        />
                        <CardButton
                            onPress={() => {}}
                            title="Explore"
                            color="#FEB557"
                        />
                        </CardAction>
                    </Card>

                    <Card>
                        <CardImage 
                        source={{uri: 'https://assets.seniority.in/media/ktpl_blog/Online_Games_for_Seniors_Cover_Image_1_Updated.jpg'}} 
                        title="Antakshari Session"
                        />
                        <CardTitle
                        subtitle="Fun Activity"
                        />
                        <CardContent text="This will contain all the details about the event.This will contain all the details about the event.This will contain all the details about the event.This will contain all the details about the event." />
                        <CardAction 
                        separator={true} 
                        inColumn={false}>
                        <CardButton
                            onPress={() => {}}
                            title="Join"
                            color="#FEB557"
                        />
                        <CardButton
                            onPress={() => {}}
                            title="Explore"
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