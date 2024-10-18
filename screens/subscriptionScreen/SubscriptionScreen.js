import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { useState } from 'react';

const SubscriptionScreen = () => {

    // pass this subscription plans as a prop to the child component
    const [plans,setPlans] = useState([]);

    const getPlans = async ()=>{
        //get all subscription plans by api
        const url = SERVER_URL + "/memberships/listAll";
        const response = await axios.get(url);
        setPlans(response.data);
    }
  
  return (
    <View>
      <Text>SubscriptionScreen</Text>
    </View>
  );
};

export default SubscriptionScreen;

const styles = StyleSheet.create({});
