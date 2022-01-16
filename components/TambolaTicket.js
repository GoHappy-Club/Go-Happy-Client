import React, {Component} from 'react';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards';
import { Pressable,Modal,ScrollView,TouchableOpacity,TouchableHighlight,TouchableWithoutFeedback, StyleSheet, View, TextInput, Image, KeyboardAvoidingView, Dimensions } from 'react-native';

import { Text, Button} from 'react-native-elements';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';


export default class TambolaTicket extends Component {
	constructor(props)
	{
		super(props);
        this.state={
            modalVisible:false,
            tambolaTicket1:[[0,0,0,0,"-",0,0,0,0],[0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0]],
            tambolaTicket:[[0,0,0,0,"-",0,0,0,0],[0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0]],
            widthArr: [40, 40, 40, 40, 40,40,40,40,40]
        }
        console.log('----------------------------------------');
		console.log(props);
	}


    setModalVisible(flag){
		this.setState({modalVisible:flag});
        // var index = this.props.event.participantList.indexOf(this.props.email);
        // this.setState({tambolaTicket:this.props.event.tambolaTickets[this.props.event.participantList.indexOf(this.props.email)].substr(1,this.props.event.tambolaTickets[this.props.event.participantList.indexOf(this.props.email)].length-2)})
        // console.log(this.props.event.tambolaTickets[this.props.event.participantList.indexOf(this.props.email)].substr(1,this.props.event.tambolaTickets[this.props.event.participantList.indexOf(this.props.email)].length-2));
	}
	x
	render() {
        // const tic = ;
        const item = this.props.event;
        console.log('fsdfsfdfdfdsfdsfdsfdsfdsfdsfdfdsfdfdsfdsfdsfdsfdsf');
        console.log(item);
		console.log(this.props);
        var tic=null;
        if(item!=null && this.props.event.participantList!=null && this.props.event.participantList.length!=0){
            var jsonString = this.props.event.tambolaTickets[this.props.event.participantList.indexOf(this.props.email)];
			if(jsonString!=null){
				jsonString = jsonString.replaceAll('"','');
            	tic = JSON.parse(jsonString);
            	console.log('sfsfdsfsdfdsfdsf',tic);
			}
        }
        return (
			<View style={styles.centeredView}>
					<Modal
						animationType="slide"
						transparent={true}
						visible={this.state.modalVisible}
						onRequestClose={() => {
						Alert.alert("Modal has been closed.");
						this.props.setModalVisible(!this.state.modalVisible);
						}}
					>
						<View style={styles.centeredView}>
						<View style={styles.modalView}>
                        <Text style={styles.modalText}>Your Tambola Ticket</Text>
                        {this.props!=null &&  <Table borderStyle={{borderWidth: 1, borderColor: '#ffa1d2'}}>
                            <Rows data={tic} widthArr={this.state.widthArr} textStyle={styles.TableText}/>
                        </Table>}
                       
                        <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => this.setModalVisible(!this.state.modalVisible)}
                        >
                        <Text style={styles.textStyle}>Close</Text>
                        </Pressable>
						</View>
						</View>
					</Modal>
                    {this.props!=null && this.props.event.eventName.indexOf("Tambola")>=0
                    && this.props.email!=null && this.props.event.participantList!=null && this.props.event.participantList.includes(this.props.email) && <Button outline 
						title='Check Tambola Ticket'
						onPress={() => this.setModalVisible(true)}>
					</Button>}
				</View>	
		);
	}
}

const styles = StyleSheet.create({
	  centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 22,
        // marginBottom:100
	  },
	  modalView: {
		margin: 20,
		backgroundColor: "white",
		borderRadius: 20,
		padding: 35,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
		  width: 0,
		  height: 2
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5
	  },
	  button: {
		borderRadius: 20,
		padding: 10,
		elevation: 2,
        marginTop:20,
	  },
	  buttonOpen: {
		backgroundColor: "#F194FF",
	  },
	  buttonClose: {
		backgroundColor: "#2196F3",
	  },
	  textStyle: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center"
	  },
	  modalText: {
		marginBottom: 15,
		textAlign: "center"
	  },
      HeadStyle: { 
        height: 50,
        alignContent: "center",
        backgroundColor: '#ffe0f0'
      },
      TableText: { 
        margin: 10
      }
});