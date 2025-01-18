let useZoom;

if (!__DEV__) {
  try {
    // Dynamically require in production
    useZoom = require("@zoom/meetingsdk-react-native").useZoom;
  } catch (error) {
    console.error("Failed to load useZoom in production:", error);
    useZoom = () => ({
      joinMeeting: () => Promise.reject("useZoom is not available"),
      leaveMeeting: () => Promise.reject("useZoom is not available"),
      // Add any other methods as needed
    });
  }
} else {
  // Mock in development
  useZoom = () => ({
    joinMeeting: () => console.log("joinMeeting called (mock)"),
    leaveMeeting: () => console.log("leaveMeeting called (mock)"),
    // Add any other mock methods as needed
  });
}

export { useZoom };
