import React, { Component } from 'react';

import { View } from 'react-native';

import { Text } from 'react-native-elements';

export default class About extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View
        style={{
          backgroundColor: 'white',
          flex: 1,
          alignItems: 'center',
        }}
      >
        <View style={{ marginTop: '10%' }}>
          <Text
            style={{
              fontSize: 30,
              textAlign: 'center',
              marginBottom: '8%',
              fontWeight: 'bold',
            }}
          >
            About Us
          </Text>
          <Text style={{ fontSize: 18, paddingLeft: '5%', paddingRight: '5%' }}>
            GoHappy Club is an initiative with a vision to make the happiest
            community of senior citizens.
          </Text>
          <Text
            style={{
              fontSize: 18,
              paddingTop: '5%',
              paddingLeft: '5%',
              paddingRight: '5%',
            }}
          >
            Our mission is to make senior citizens productive and engaged in
            their second innings of the lives. We empower them through Live
            Sessions in three different categories:
          </Text>
          <Text
            style={{
              fontSize: 18,
              paddingLeft: '5%',
              paddingRight: '5%',
              marginBottom: 5,
              marginTop: 5,
            }}
          >
            <Text style={{ fontWeight: 'bold' }}>1. Fun:</Text> Tambola,
            Antakshari, Quizzes
          </Text>
          <Text
            style={{
              fontSize: 18,
              paddingLeft: '5%',
              paddingRight: '5%',
              marginBottom: 5,
            }}
          >
            <Text style={{ fontWeight: 'bold' }}>2. Learning:</Text> Mobile
            Learning, Singing, Health, Art & Craft.
          </Text>
          <Text style={{ fontSize: 18, paddingLeft: '5%', paddingRight: '5%' }}>
            <Text style={{ fontWeight: 'bold' }}>3. Fitness:</Text> Diet, Yoga,
            Dance, Mental Health and many more to help them find joy and
            happiness in this modern & technological era.
          </Text>

          <View
            style={{
              justifyContent: 'center', //Centered horizontally
              alignItems: 'center', //Centered vertically
              flex: 1,
            }}
          >
            <Text
              style={{
                fontSize: 24,
                paddingLeft: '5%',
                paddingRight: '5%',
                justifyContent: 'center',
                fontWeight: 'bold',
                alignSelf: 'center',
              }}
            >
              India Ka Sabse Khush Parivar
            </Text>
          </View>
        </View>
      </View>
    );
  }
}
