import { format, fromUnixTime } from "date-fns";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { hp, wp } from "../../helpers/common";
import { Colors } from "../../assets/colors/color";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

const TransactionHistory = ({ transactions, seeAll = false }) => {
  const navigation = useNavigation();

  const { t } = useTranslation();

  const loadDate = (timestamp) => {
    const dt = fromUnixTime(timestamp / 1000);
    const finalTime = format(dt, "MMM d, h:mm aa");
    return finalTime;
  };

  const renderTransaction = ({ item }) => {
    const isCredit = item.type === "CREDIT";

    return (
      <View style={styles.transactionItem}>
        <View style={styles.leftContent}>
          <Text style={styles.transactionTitle}>{item.title}</Text>
          <Text style={styles.timestamp}>{loadDate(item.transactionDate)}</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text
            style={[
              styles.amount,
              isCredit ? styles.creditAmount : styles.debitAmount,
            ]}
          >
            {isCredit ? "+" : "-"} {item.amount}{" "}
          </Text>
          <FastImage
            source={require("../../images/coins.png")}
            style={{
              height: 18,
              width: 18,
            }}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{t("recent_transactions")}</Text>
      <View style={styles.separator} />
      {transactions.length === 0 && (
        <Text style={{ textAlign: "center", marginTop: 16 }}>
          No transactions found
        </Text>
      )}
      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item?.transactionDate.toString()}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
      />

      {seeAll && (
        <TouchableOpacity
          style={styles.seeAllButton}
          onPress={() => navigation.navigate("AllTransactions")}
        >
          <Text style={styles.seeAllText}>{t("see_all")}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "auto",
    backgroundColor: Colors.bottomNavigation,
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: wp(5),
  },
  header: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.black,
    marginBottom: 16,
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  leftContent: {
    flex: 1,
    marginRight: 16,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.black,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 14,
    color: Colors.grey.countdown,
  },
  amount: {
    fontSize: 16,
    fontWeight: "500",
  },
  creditAmount: {
    color: Colors.coinsGreen,
  },
  debitAmount: {
    color: Colors.coinsRed,
    // color:Colors.black
  },
  separator: {
    height: 1,
    backgroundColor: Colors.grey.lightgrey,
  },
  seeAllButton: {
    marginTop: 16,
    alignItems: "center",
  },
  seeAllText: {
    color: Colors.primaryText,
    fontSize: 16,
    fontWeight: "500",
    textDecorationLine: "underline",
  },
});

export default TransactionHistory;
