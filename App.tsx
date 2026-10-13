import "react-native-gesture-handler";
import React from "react";
import { StatusBar, LogBox } from "react-native";
import SplashScreen from "react-native-splash-screen";
/**
 * ? Local Imports
 */
import Navigation from "./src/navigation";
import { WeatherProvider } from "./src/services/weather/WeatherContext";
import { isAndroid } from "@freakycoder/react-native-helpers";

LogBox.ignoreAllLogs();

const App = () => {
  React.useEffect(() => {
    // ? Every screen has a dark sky or navy header behind the status bar
    StatusBar.setBarStyle("light-content");
    if (isAndroid) {
      StatusBar.setBackgroundColor("rgba(0,0,0,0)");
      StatusBar.setTranslucent(true);
    }

    setTimeout(() => {
      SplashScreen.hide();
    }, 750);
  }, []);

  return (
    <WeatherProvider>
      <Navigation />
    </WeatherProvider>
  );
};

export default App;
