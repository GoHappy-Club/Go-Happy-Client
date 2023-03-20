import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faWifi } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'react-native-elements';

class ErrorScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={styles.container}>
        <FontAwesomeIcon icon={faWifi} size={100} style={styles.icon} />
        <Text style={styles.errorText}>No Internet Connection</Text>
        <Text style={styles.subtext}>
          Please check your network settings and try again.
        </Text>
        {/* <Button
          title="Try Again"
          onPress={this.props.recheck}
          style={styles.button}
        /> */}
        <Button
          buttonStyle={styles.button}
          title="Try Again"
          onPress={this.props.recheck}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  icon: {
    color: '#000',
    marginBottom: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#000',
  },
  subtext: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    color: '#000',
  },
  button: {
    backgroundColor: '#38434D',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 20,
  },
});

export default ErrorScreen;
