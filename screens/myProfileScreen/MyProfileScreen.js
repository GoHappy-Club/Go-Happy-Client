import React, { Component } from 'react';
import {
  Button,
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  TouchableOpacityBase,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

// import AsyncStorage from '@react-native-community/async-storage';
import { Avatar } from 'react-native-paper';
import axios from 'axios';
import AwesomeAlert from 'react-native-awesome-alerts';
// import { Container, Header, Content, Left, Body, Right, Icon, Title, Form, Item, Input, Label } from 'native-base';
import { MaterialIndicator } from 'react-native-indicators';
import MyProfile from '../../components/Profile';

export default class MyProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: '',
      password: '',
      showAlert: false,
      loader: false,
    };
  }
  render() {
    if (this.state.loader == true) {
      // return (<ActivityIndicator size='large' color="#0A1045" style={{flex: 1,justifyContent: "center",flexDirection: "row",justifyContent: "space-around",padding: 10}}/>);
      return (
        <MaterialIndicator
          color="white"
          style={{ backgroundColor: '#0A1045' }}
        />
      );
    }
    const navigation = this.props.navigation;
    const title = 'Login';
    return <MyProfile navigation={this.props.navigation} />;
  }
}

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    backgroundColor: '#0A1045',
  },
  input: {
    width: '90%',
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  userBtn: {
    backgroundColor: '#f0ad4e',
    paddingVertical: 15,
    height: 60,
  },
  btnTxt: {
    fontSize: 20,
    textAlign: 'center',
    color: 'black',
    fontWeight: '700',
  },
  registerTxt: {
    marginTop: 5,
    fontSize: 15,
    textAlign: 'center',
    color: 'white',
  },
  welcome: {
    fontSize: 30,
    textAlign: 'center',
    margin: 10,
    color: 'white',
  },
  logo: {
    width: 150,
    height: 150,
  },
  logoContainer: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
  },
  formContainer: {},
  title: {
    color: 'white',
    marginTop: 10,
    width: 160,
    opacity: 0.9,
    textAlign: 'center',
  },
  newinput: {
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginBottom: 10,
    color: 'white',
    paddingHorizontal: 10,
  },
  container2: {
    padding: 25,
  },
  title2: {
    color: 'white',
    marginTop: '30%',
    marginBottom: 10,
    opacity: 0.9,
    textAlign: 'center',
    fontSize: 30,
  },
});
