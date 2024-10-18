import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const SubscriptionPlans = ({plans}) => {

    const handleBuyPlan = async (plan) => {
        //handle buy plan logic
        // set AsyncStorage items 'paymentProgress' & 'paymentProgressTime' too.
    }

    const handleRenewPlan = async (plan) => {
        //handle renew plan logic
    }

  return (
    <View>
      <Text>SubscriptionPlans</Text>
      {/* map through the plans and display them */}
    </View>
  )
}

export default SubscriptionPlans

const styles = StyleSheet.create({})