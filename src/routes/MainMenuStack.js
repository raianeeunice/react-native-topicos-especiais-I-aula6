import * as React from "react";
import { Text, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  NavigationContainer,
  getFocusedRouteNameFromRoute,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../screens/Login";
import Register from "../screens/Register";
import HomeMenuBottomTab from "./HomeMenuBottonTab";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Stack = createStackNavigator();

function getHeaderTitle(route) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? "Home";
  switch (routeName) {
    case "Home":
      return "Home";
    case "Schedules":
      return "Agendamentos";
    case "History":
      return "Histórico";
  }
}
export default function MainMenuStack() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#24527a" }}>
      <StatusBar style="auto" backgroundColor="#fafafa" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerStyle: { backgroundColor: "#24527a" }, // Header color
            headerTintColor: "#FFFFFF", // Header text color
          }}
        >
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              title: "Login",
              headerTitleStyle: { fontWeight: "bold", textAlign: "center" },
            }}
          />
          <Stack.Screen
            name="Register"
            component={Register}
            options={{ title: "Cadastre-se" }}
          />
          <Stack.Screen
            name="HomeMenuBottomTab"
            component={HomeMenuBottomTab}
            options={({ navigation, route }) => ({
              headerTitle: getHeaderTitle(route),
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      "Atenção!",

                      "Deseja sair do aplicativo?",

                      [
                        {
                          text: "Sim",
                          onPress: () => navigation.replace("Login"),
                        },
                        {
                          text: "Não",
                          onPress: () => console.log("Cancel Pressed"),
                          style: "cancel",
                        },
                      ],

                      { cancelable: false }
                    );
                  }}
                  style={{ padding: 10 }}
                >
                  <Text style={{ color: "#FFF", fontWeight: "bold" }}>
                    Sair
                  </Text>
                  <MaterialCommunityIcons
                    name="exit-run"
                    color="#FFF"
                    size={26}
                  />
                </TouchableOpacity>
              ),
              headerTitleStyle: { fontWeight: "bold", textAlign: "center" },
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}
