import React, { useState, useEffect, useCallback } from 'react';
import {
  FlatList,
  Linking,
  Modal,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button, Text } from 'react-native-elements';
import { WebView } from 'react-native-webview';
import { Avatar, Card as Cd, Title } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIndicator } from 'react-native-indicators';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const MySessions = ({ ongoingEvents, upcomingEvents, expiredEvents, loadMySessions, phoneNumber, profile, childLoader }) => {
  const [email, setEmail] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [videoVisible1, setVideoVisible1] = useState(false);
  const [recordingLink, setRecordingLink] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    retrieveData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      onRefresh();
    }, [])
  );

  const retrieveData = async () => {
    try {
      const storedEmail = await AsyncStorage.getItem('email');
      setEmail(storedEmail);
    } catch (error) {
      // Error retrieving data
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadMySessions('', () => setRefreshing(false));
  }, [loadMySessions]);

  const trimContent = (text, cut) => {
    if (text.length < cut) {
      return text;
    }
    return text.substring(0, cut) + '...';
  };

  const loadDate = (item) => {
    const dt = new Date(parseInt(item));
    let hours = dt.getHours();
    const AmOrPm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12;
    let minutes = dt.getMinutes();
    hours = hours < 10 ? `0${hours}` : hours;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${minutes} ${AmOrPm}`;
  };

  const sorry = () => (
    <Text h3 style={styles.sorryText}>
      No Recordings Found 😟
    </Text>
  );

  const videoPlayer = (link) => {
    setVideoVisible1(true);
    setRecordingLink(link);
  };

  const startEvent = (item) => {
    Linking.openURL(item.meetingLink);
  };

  const renderItem = ({ item }, type) => (
    <Cd style={styles.cardStyle}>
      <TouchableOpacity
        style={{ ...styles.card, marginTop: 10 }}
        underlayColor={'grey'}
        onPress={() =>
          navigation.navigate('Session Details', {
            event: item,
            deepId: item.id,
            type: type,
            phoneNumber: phoneNumber,
            profile: profile,
            onGoBack: () => loadMySessions(),
          })
        }
      >
        <Cd.Content>
          <Text style={{ padding: 4 }}>
            {new Date(parseInt(item.startTime)).toDateString()} | {loadDate(item.startTime)}
          </Text>

          <View style={styles.rowSpaceBetween}>
            <View style={styles.row}>
              <Text style={styles.eventNameText}>
                {trimContent(item.eventName, 30)}
              </Text>
            </View>
          </View>

          <View style={styles.rowSpaceBetween}>
            <View style={styles.row}>
              <Avatar.Image
                source={require('../images/profile_image.jpeg')}
                size={30}
              />
              <Title style={styles.expertNameText}>
                {trimContent(item.expertName, 17)}
              </Title>
            </View>
            {type === 'ongoing' && (
              <Button
                disabled={item.participantsList != null && item.participantsList.includes(phoneNumber)}
                title="Join"
                buttonStyle={{ backgroundColor: '#29BFC2' }}
                onPress={() => startEvent(item)}
                loading={item.loadingButton}
              />
            )}
            {type === 'expired' && (
              <Button
                disabled={item.participantsList != null && item.participantsList.includes(phoneNumber)}
                title="View Recording"
                buttonStyle={{ backgroundColor: '#29BFC2' }}
                onPress={() => videoPlayer(item.recordingLink)}
                loading={item.loadingButton}
              />
            )}
          </View>
        </Cd.Content>
      </TouchableOpacity>
    </Cd>
  );

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {ongoingEvents.length === 0 && upcomingEvents.length === 0 && expiredEvents.length === 0 && sorry()}
      {ongoingEvents.length > 0 && (
        <Text h4 style={styles.sectionTitle}>
          Ongoing Events
          {childLoader && <MaterialIndicator color="blue" />}
        </Text>
      )}
      <SafeAreaView style={styles.container}>
        <FlatList
          data={ongoingEvents}
          renderItem={(item) => renderItem(item, 'ongoing')}
          keyExtractor={(item) => item.id}
        />
      </SafeAreaView>
      {upcomingEvents.length > 0 && (
        <Text h4 style={styles.sectionTitle}>
          Upcoming Events
          {childLoader && <MaterialIndicator color="blue" />}
        </Text>
      )}
      <SafeAreaView style={styles.container}>
        <FlatList
          horizontal={true}
          data={upcomingEvents}
          renderItem={(item) => renderItem(item, 'upcoming')}
          keyExtractor={(item) => item.id}
        />
      </SafeAreaView>
      {expiredEvents.length > 0 && (
        <Text h4 style={styles.sectionTitle}>
          {childLoader && <MaterialIndicator color="blue" />}
        </Text>
      )}
      <SafeAreaView style={styles.container}>
        <FlatList
          data={expiredEvents}
          renderItem={(item) => renderItem(item, 'expired')}
          keyExtractor={(item) => item.id}
        />
      </SafeAreaView>
      {recordingLink && (
        <Modal
          animationType="slide"
          transparent={false}
          visible={videoVisible1}
          onRequestClose={() => {
            setVideoVisible1(false);
          }}
        >
          <WebView
            allowsFullscreenVideo
            javaScriptEnabled={true}
            style={styles.webView}
            source={{
              uri: recordingLink,
            }}
          />
        </Modal>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  cardStyle: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  sorryText: {
    height: '100%',
    marginTop: '20%',
    alignSelf: 'center',
    textAlign: 'center',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowSpaceBetween: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 4,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  eventNameText: {
    color: '#404040',
    fontSize: 14,
    fontWeight: '700',
  },
  expertNameText: {
    color: '#404040',
    fontSize: 13,
    paddingLeft: 10,
  },
  sectionTitle: {
    marginLeft: 30,
    marginTop: 20,
    marginBottom: 15,
  },
  webView: {
    flex: 1,
    borderColor: 'red',
    borderWidth: 1,
  },
});

export default MySessions;