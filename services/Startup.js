import axios from "../config/CustomAxios";

export const activateFreeTrial = async (profile) => {
  const url = SERVER_URL + "/membership/activateFreeTrial";
  try {
    const response = await axios.post(url, {
      phone: profile.phoneNumber,
    });
    console.log(response.data);

    return {
      membershipType: response.data.membershipType,
      coins: response.data.coins,
      membershipStartDate: response.data.membershipStartDate,
      membershipEndDate: response.data.membershipEndDate,
      id: response.data.id,
    };
  } catch (error) {
    crashlytics().log(`Error in activateFreeTrial Startup.js ${error}`);
    console.log("Error in activate", error);
  }
};

export const deactivateFreeTrial = async () => {
  const url = SERVER_URL + "/membership/cancelFreeTrial";
  try {
    const res = axios.post(url, {
      phone: profile.phone,
    });
  } catch (error) {
    crashlytics().log(`Error in deactivateFreeTrial Startup.js ${error}`);
    console.log("Error in deactivate", error);
  }
};

export const checkFreeTrialExpired = (membership) => {
  const currTime = new Date().getTime();
  const membershipEndDate = membership.membershipEndDate;
  if (currTime > membershipEndDate) return true;
  return false;
};

export const checkPendingFeedback = async (
  setShowRating,
  setCurrentSession
) => {
  const currentTime = new Date().getTime();
  try {
    const sessions = await AsyncStorage.getItem("completedSessions");
    const parsedSessions = sessions ? JSON.parse(sessions) : [];
    const sessionNeedingFeedback = parsedSessions
      .filter((session) => session.hasGivenFeedback == false)
      .filter((session) => session.sessionEndTime < currentTime);

    if (sessionNeedingFeedback.length > 0) {
      setCurrentSession(sessionNeedingFeedback[0]);
      setShowRating(true);
    }
    // remove older sessions
    const updatedSessions = parsedSessions.filter(
      (session) => currentTime - session.timestamp < 24 * 60 * 60 * 1000
    );
    await AsyncStorage.setItem(
      "completedSessions",
      JSON.stringify(updatedSessions)
    );
  } catch (error) {
    console.error("Error checking feedback:", error);
  }
};

export const storeCompletedSession = async (
  sessionId,
  sessionName,
  sessionImage,
  sessionSubCategory,
  phone,
  sessionEndTime
) => {
  try {
    const sessions = await AsyncStorage.getItem("completedSessions");
    const parsedSessions = sessions ? JSON.parse(sessions) : [];
    if (parsedSessions.map((session) => session.sessionId).includes(sessionId))
      return;

    parsedSessions.push({
      sessionId,
      sessionName,
      sessionImage,
      sessionSubCategory,
      sessionEndTime,
      phone,
      timestamp: new Date().getTime(),
      hasGivenFeedback: false,
    });

    await AsyncStorage.setItem(
      "completedSessions",
      JSON.stringify(parsedSessions)
    );
  } catch (error) {
    console.error("Error storing session:", error);
  }
};

export const submitRating = async (
  currentSession,
  setCurrentSession,
  setShowRating,
  rating = 0,
  interested = true,
  phone,
  reason,
  setSubmitted,
  setLoading
) => {
  try {
    setLoading(true);
    const sessions = await AsyncStorage.getItem("completedSessions");
    let parsedSessions = sessions ? JSON.parse(sessions) : [];
    if (!interested) {
      parsedSessions = parsedSessions.map((session) =>
        session.sessionId === currentSession.sessionId
          ? { ...session, hasGivenFeedback: true, rating }
          : session
      );
      await AsyncStorage.setItem(
        "completedSessions",
        JSON.stringify(parsedSessions)
      );
      setShowRating(false);
      setCurrentSession(null);
      return;
    }
    parsedSessions = parsedSessions.map((session) =>
      session.sessionId === currentSession.sessionId
        ? { ...session, hasGivenFeedback: true, rating }
        : session
    );

    await AsyncStorage.setItem(
      "completedSessions",
      JSON.stringify(parsedSessions)
    );
    await sendRatingToBackend(
      currentSession.sessionId,
      rating,
      phone,
      currentSession.sessionSubCategory,
      reason,
      setSubmitted
    );
    setShowRating(false);
    setLoading(false);
  } catch (error) {
    setLoading(false);
    console.error("Error submitting rating:", error);
  }
};

export const getTodaysFestival = async () => {
  try {
    const res = await axios.get(`${SERVER_URL}/festivals/today`);
    return res.data.festival;
  } catch (error) {
    console.log("Error in getTodaysFestival", error);
    crashlytics().log(`Error in getTodaysFestival Startup.js ${error}`);
  }
};

const sendRatingToBackend = async (
  id,
  rating,
  phone,
  sessionSubCategory,
  reason,
  setSubmitted
) => {
  try {
    const response = await axios.post(`${SERVER_URL}/event/submitRating`, {
      id,
      rating,
      phone,
      subCategory: sessionSubCategory,
      reason,
    });
    setSubmitted(true);
  } catch (error) {
    crashlytics().log(`Error in submitRating Startup.js ${error}`);
    setSubmitted(true);
    console.log("Error in submitRating", error);
  }
};
