export const setSessionAttended = (phone) => {
  var url = SERVER_URL + "/user/sessionAttended";
  axios
    .post(url, { phone: phone })
    .then((response) => {})
    .catch((error) => {
      crashlytics().recordError(JSON.stringify(error));
    });
};

export const getEvent = (id) => {
  var url = SERVER_URL + "/event/getEvent";
  ////console.log(id)
  return axios.post(url, { id: id });
};

export const getTitle = (item, phoneNumber) => {
  var isOngoing = false;
  if (item.startTime - 600000 <= new Date().getTime()) {
    isOngoing = true;
  }
  if (item.participantList == null) {
    return "Book";
  }
  const isParticipant = item.participantList.includes(phoneNumber);

  if (isOngoing && isParticipant) {
    return "Join";
  } else if (isParticipant) {
    return "Booked";
  } else if (item.seatsLeft == 0) {
    return "Seats Full";
  } else {
    return "Book";
  }
};

export const getTitle_for_details = (item, phoneNumber, type) => {
  var currTime = Date.now();
  // var title =
  if (type == "expired") {
    return "View Recording";
  }
  if (type == "ongoing") {
    return "Join";
  }
  if (
    item.participantList != null &&
    phoneNumber != null &&
    item.participantList.includes(phoneNumber)
  ) {
    if (currTime > item.endTime) {
      return "View Recording";
    } else if (currTime + 600000 < item.startTime) {
      return "Cancel Your Booking";
    } else {
      return "Join";
    }
  }
  if (item.seatsLeft == 0) {
    return "Seats Full";
  }
  return "Book";
};
