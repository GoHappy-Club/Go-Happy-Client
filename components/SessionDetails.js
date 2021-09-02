import React, {Component} from 'react';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards';
import { ImageBackground,ScrollView,TouchableOpacity,TouchableHighlight,TouchableWithoutFeedback, StyleSheet, View, Button, TextInput, Image, Text, KeyboardAvoidingView } from 'react-native';

import { Card as Cd, Title, Paragraph, Avatar } from 'react-native-paper';



export default class SessionDetails extends Component {
	constructor(props)
	{
		super(props);
		this.state = {
			event:props.event,
		}
		console.log(props);
	}
	render() {
		if(this.state.loader==true){
			// return (<ActivityIndicator size='large' color="#0A1045" style={{flex: 1,justifyContent: "center",flexDirection: "row",justifyContent: "space-around",padding: 10}}/>);
			return (<MaterialIndicator color='white' style={{backgroundColor:"#0A1045"}}/>)
		}
		const navigation = this.props.navigation;
		const title = 'Login';
		const item = this.props.event;
		return (
			<>
			<ImageBackground
			blurRadius={0}
			fadeDuration={1000}
			resizeMode="cover"
				style={styles.cover}
				source={{
				uri: 'https://images.herzindagi.info/image/2019/Nov/yoga-fitness-senior-citizens.jpg',
				}}
			/>
			<ScrollView>
                    <Cd style={{...styles.card,marginLeft:30,marginRight:30,marginBottom:15,backgroundColor: 'white'}}>

						<Cd.Content>
							<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', padding:4 }}>
								<View style={{ flex: 1, flexDirection: 'row'}}>

									{/* <Badge value={item.category} badgeStyle={styles.badge} /> */}
									<Text style={{color:'#404040',fontSize:14, paddingLeft:4}}>
										{(new Date(parseInt(item.startTime))).toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3")} | 
									</Text>
									<Text style={{color:'red',fontSize:14, paddingLeft:4}}>
										{item.seatsLeft} seats left
									</Text>
								</View>
								{/* <FontAwesomeIcon style={styles.fav} icon={ test } color={ 'black' } size={20} />      */}
							</View>
							<Title style={{color:'black',fontSize:20, padding:4}}>{item.eventName}</Title>

							<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between',padding:4 }}>
								<View style={{ flex: 1, flexDirection: 'row'}}>
									<Avatar.Image
									source = {{
										uri: this.state.profileImage
									}}
									size={30}
									/>
									<Title style={{color:'#404040',fontSize:13,paddingLeft:10}}>{item.expertName}</Title>
								</View>
								<Button
									disabled = {item.participantList!=null && item.participantList.includes(this.state.email)?true:false}
									title={item.participantList!=null && item.participantList.includes(this.state.email)?"Booked":"Book"}
									loading={item.loadingButton}
								/>
							</View>
						</Cd.Content>

					</Cd>
					</ScrollView>
					</>

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
	cover:{
		flex: 1,
    	justifyContent: "center"
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