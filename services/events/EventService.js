import axios from "axios";

export const setSessionAttended = (phone) => {
  var url = SERVER_URL + "/user/sessionAttended";
  axios
    .post(url, { phone: phone })
    .then((response) => {})
    .catch((error) => {
      console.log(error);
    });
};
