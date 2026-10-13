import React from "react";
import { useColorScheme } from "react-native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { isReadyRef, navigationRef } from "react-navigation-helpers";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
/**
 * ? Local & Shared Imports
 */
import { SCREENS } from "@shared-constants";
import { DarkTheme, LightTheme } from "@theme/themes";
import { weatherColors } from "@theme/weather";
// ? Screens
import ForecastsScreen from "@screens/forecasts/ForecastsScreen";
import RadarScreen from "@screens/radar/RadarScreen";
import AlertsScreen from "@screens/alerts/AlertsScreen";
import SearchScreen from "@screens/search/SearchScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TAB_ICONS: Record<string, { focused: string; unfocused: string }> = {
  [SCREENS.FORECASTS]: {
    focused: "partly-sunny",
    unfocused: "partly-sunny-outline",
  },
  [SCREENS.RADAR]: { focused: "locate", unfocused: "locate-outline" },
  [SCREENS.ALERTS]: {
    focused: "notifications",
    unfocused: "notifications-outline",
  },
};

const Navigation = () => {
  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";

  React.useEffect((): any => {
    return () => (isReadyRef.current = false);
  }, []);

  const RenderTabIcon = (
    route: any,
    focused: boolean,
    color: string,
    size: number,
  ) => {
    const icons = TAB_ICONS[route.name] ?? TAB_ICONS[SCREENS.FORECASTS];
    return (
      <Icon
        name={focused ? icons.focused : icons.unfocused}
        type={IconType.Ionicons}
        size={size}
        color={color}
      />
    );
  };

  const RenderTabNavigation = () => {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) =>
            RenderTabIcon(route, focused, color, size),
          tabBarActiveTintColor: weatherColors.tabActive,
          tabBarInactiveTintColor: weatherColors.tabInactive,
          tabBarStyle: { backgroundColor: weatherColors.sheet },
        })}
      >
        <Tab.Screen name={SCREENS.FORECASTS} component={ForecastsScreen} />
        <Tab.Screen name={SCREENS.RADAR} component={RadarScreen} />
        <Tab.Screen name={SCREENS.ALERTS} component={AlertsScreen} />
      </Tab.Navigator>
    );
  };

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        isReadyRef.current = true;
      }}
      theme={isDarkMode ? DarkTheme : LightTheme}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name={SCREENS.MAIN} component={RenderTabNavigation} />
        <Stack.Screen name={SCREENS.SEARCH} component={SearchScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
