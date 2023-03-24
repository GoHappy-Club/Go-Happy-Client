import React, { Component } from 'react';
import {
  Card,
  CardAction,
  CardButton,
  CardContent,
  CardImage,
  CardTitle,
} from 'react-native-cards';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { Button, Text } from 'react-native-elements';
import {
  Cell,
  Col,
  Cols,
  Row,
  Rows,
  Table,
  TableWrapper,
} from 'react-native-table-component';

export default class TambolaTicket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      tambolaTicket1: [
        [0, 0, 0, 0, '-', 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ],
      tambolaTicket: [
        [0, 0, 0, 0, '-', 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ],
      widthArr: [30, 30, 30, 30, 30, 30, 30, 30, 30],
      ticketNumber: -1,
    };
  }

  setModalVisible(flag) {
    this.setState({ modalVisible: flag });
    this.setState({
      ticketNumber: this.props.event.participantList.indexOf(
        this.props.phoneNumber
      ),
    });
    // var index = this.props.event.participantList.indexOf(this.props.email);
    // this.setState({tambolaTicket:this.props.event.tambolaTickets[this.props.event.participantList.indexOf(this.props.email)].substr(1,this.props.event.tambolaTickets[this.props.event.participantList.indexOf(this.props.email)].length-2)})
    //
  }
  x;
  render() {
    // const tic = ;
    const item = this.props.event;

    var tic = null;
    var tic = new Array(10);
    for (var i = 0; i < tic.length; i++) {
      tic[i] = new Array(3);
    }
    if (
      item != null &&
      this.props.event.participantList != null &&
      this.props.event.participantList.length != 0
    ) {
      if (
        this.props.event.participantList.indexOf(this.props.phoneNumber) != -1
      ) {
        var jsonString =
          this.props.event.tambolaTickets[
            this.props.event.participantList.indexOf(this.props.phoneNumber)
          ];

        if (jsonString != null) {
          var temp = jsonString.match(/\d+/g);
          for (var i = 0; i < 9; i++) {
            tic[0][i] = parseInt(temp[i]);
            if (tic[0][i] == 0) {
              tic[0][i] = '';
            }
          }
          for (var i = 9; i < 18; i++) {
            tic[1][i - 9] = parseInt(temp[i]);
            if (tic[1][i - 9] == 0) {
              tic[1][i - 9] = '';
            }
          }
          for (var i = 18; i < 27; i++) {
            tic[2][i - 18] = parseInt(temp[i]);
            if (tic[2][i - 18] == 0) {
              tic[2][i - 18] = '';
            }
          }

          // jsonString = jsonString.replace('"','');
          // jsonString = jsonString.substr(1,jsonString.length-1);
          // tic = JSON.parse(jsonString);
        }
      }
    }
    return (
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            this.props.setModalVisible(!this.state.modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Your Tambola Ticket</Text>
              {this.props != null && (
                <Table
                  borderStyle={{
                    borderWidth: 1,
                    borderColor: '#ffa1d2',
                  }}
                >
                  <Rows
                    data={tic}
                    widthArr={this.state.widthArr}
                    textStyle={styles.TableText}
                  />
                </Table>
              )}
              <Text style={{ textAlign: 'left', marginTop: '5%' }}>
                Ticket Number: {this.state.ticketNumber}
              </Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => this.setModalVisible(!this.state.modalVisible)}
              >
                <Text style={styles.textStyle}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        {this.props != null &&
          this.props.event.eventName.indexOf('Tambola') >= 0 &&
          this.props.phoneNumber != null &&
          this.props.event.participantList != null &&
          this.props.event.participantList.indexOf(this.props.phoneNumber) !=
            -1 && (
            <Button
              outline
              title="Check Tambola Ticket"
              onPress={() => this.setModalVisible(true)}
            />
          )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    // marginBottom:100
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 20,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
    // marginBottom: 0,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  HeadStyle: {
    height: 50,
    alignContent: 'center',
    backgroundColor: '#ffe0f0',
  },
  TableText: {
    alignSelf: 'center',
    fontSize: 12,
  },
});
