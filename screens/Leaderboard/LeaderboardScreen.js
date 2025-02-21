import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import LeaderboardTypeSelection from "../../components/Leaderboard/LeaderboardType";
import Leaderboard from "../../components/Leaderboard/Leaderboard";

const LeaderboardScreen = () => {
  const [type, setType] = useState("");
  return (
    <>
      {type == "" && <LeaderboardTypeSelection type={type} setType={setType} />}
      {type && type != "" && <Leaderboard type={type} setType={setType} />}
    </>
  );
};

export default LeaderboardScreen;

const styles = StyleSheet.create({});
