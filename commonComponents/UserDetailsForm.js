import React from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import AutocompleteCityInput from '../components/Autocomplete';
import { Calendar } from 'lucide-react-native';
import { Colors } from '../assets/colors/color';

const UserDetailsForm = ({
  state,
  setState,
  setOpen,
  setUpdated,
  styles,
  getFormattedDate
}) => {
  return (
    <>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name : </Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor={Colors.grey[6]}
          value={state.name}
          onChangeText={(text) =>
            setState((prev) => ({ ...prev, name: text }))
          }
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email : </Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          placeholderTextColor={Colors.grey[6]}
          autoCapitalize="none"
          value={state.email}
          onChangeText={(text) =>
            setState((prev) => ({ ...prev, email: text }))
          }
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Emergency Contact : </Text>
        <TextInput
          style={styles.input}
          value={state.emergencyContact}
          placeholder="Emergency Contact"
          placeholderTextColor={Colors.grey[6]}
          maxLength={10}
          keyboardType="phone-pad"
          onChangeText={(text) =>
            setState((prev) => ({ ...prev, emergencyContact: text }))
          }
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Date of Birth : </Text>
        <Pressable
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
            borderBottomWidth: 2,
            borderBottomColor: "#ccc",
          }}
          onPress={() => setOpen(true)}
        >
          <Text style={[styles.input, { borderBottomWidth: 0 }]}>
            {getFormattedDate(state.dob)}
          </Text>
          <Calendar size={24} color={"black"} />
        </Pressable>
      </View>
      <AutocompleteCityInput
        label={"City : "}
        input={state.city}
        setInput={(city) => setState((prev) => ({ ...prev, city: city }))}
        selectedFromDropdown={state.selectedFromDropdown}
        setSelectedFromDropdown={(value) => {
          setUpdated(false);
          setState((prev) => ({ ...prev, selectedFromDropdown: value }));
        }}
      />
    </>
  );
};

export default UserDetailsForm;