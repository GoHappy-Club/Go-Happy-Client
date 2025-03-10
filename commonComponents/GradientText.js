import MaskedView from "@react-native-masked-view/masked-view";
import PropTypes from "prop-types";
import React from "react";
import { Text } from "react-native";
import LinearGradient from "react-native-linear-gradient";

const GradientText = (props) => {
  return (
    <MaskedView
      maskElement={
        <Text style={[props.style, { backgroundColor: "transparent" }]}>
          {props.text}
        </Text>
      }
    >
      <LinearGradient
        colors={props.colors || ["#f00", "#0f0"]}
        start={props.start || { x: 0, y: 0 }}
        end={props.end || { x: 0.7, y: 0 }}
      >
        <Text style={[props.style, { opacity: 0 }]}>{props.text}</Text>
      </LinearGradient>
    </MaskedView>
  );
};

GradientText.propTypes = {
  props: PropTypes.object.isRequired,
  colors: PropTypes.arrayOf(PropTypes.string),
  start: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }),
  end: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }),
  style: PropTypes.object,
  text: PropTypes.string.isRequired,
};

export default GradientText;
