import * as React from "react";
import {
  View,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
  Platform,
} from "react-native";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import Separator from "../components/Separator";
import firebase from "../config/firebase";

export default function Login({ navigation, route }) {
  const [state, setState] = React.useState({
    email: "",
    password: "",
  });
  const [passwordSecured, setPasswordSecured] = React.useState(true);
  const [statusLoginError, setStatusLoginError] = React.useState(false);
  const [messageLoginError, setMessageLoginError] = React.useState("");

  const handleChangeText = (key, value) => {
    if (statusLoginError) {
      setStatusLoginError(false);
    }
    setState({ ...state, [key]: value });
  };

  function handleRegister() {
    setState({ email: "", senha: "" });
    navigation.navigate("Register");
  }

  function requiredFields() {
    if (!state.email || !state.password) {
      return false;
    } else return true;
  }

  function loginFirebase() {
    if (!requiredFields()) {
      setMessageLoginError(
        "Todos os campos são de \npreenchimento obrigatório!"
      );
      setStatusLoginError(true);
    } else {
      firebase
        .auth()
        .signInWithEmailAndPassword(state.email, state.password)
        .then((userCredential) => {
          setState({ email: "", senha: "" });
          navigation.replace("HomeMenuBottomTab", {
            screen: "Home",
            params: {
              uid: userCredential.user.uid,
              name: userCredential.user.displayName,
              email: userCredential.user.email,
            },
          });
        })
        .catch((error) => {
          switch (error.code) {
            case "auth/wrong-password":
              setMessageLoginError('"Senha" inválida!');
              break;
            case "auth/user-not-found":
              setMessageLoginError('"E-mail" (Usuário) não cadastrado!');
              break;
            case "auth/too-many-requests":
              setMessageLoginError(
                "Bloqueio temporário. Várias tentativas\ncom senha inválida. Tente mais tarde!"
              );
              break;
            case "auth/user-disabled":
              setMessageLoginError(
                "Conta de e-mail desativada. Contacte\no administrador do sistema!"
              );
              break;
            default:
              setMessageLoginError('"Email" e/ou "Senha" inválidos!');
          }
          setStatusLoginError(true);
        });
    }
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Text style={styles.titleText}>Lava a Jato G&G</Text>
      <Image
        style={styles.imgLogo}
        source={require("../../assets/car_washing.png")}
      />
      <View style={styles.inputView}>
        <MaterialIcons name="email" size={24} color="#005689" />
        <TextInput
          style={styles.input}
          value={state.email}
          onChangeText={(value) => handleChangeText("email", value)}
          placeholder={"E-mail"}
          keyboardType="email-address"
          textContentType="emailAddress"
          autoCapitalize="none"
        />
      </View>
      <View style={styles.inputView}>
        <FontAwesome name="lock" size={24} color="#005689" />
        <TextInput
          style={styles.input}
          value={state.password}
          secureTextEntry={passwordSecured}
          placeholder={"Senha"}
          textContentType="password"
          autoCapitalize="none"
          onChangeText={(value) => handleChangeText("password", value)}
        />
        <TouchableOpacity
          style={styles.touchableIcon}
          onPress={() => setPasswordSecured(!passwordSecured)}
        >
          {passwordSecured ? (
            <FontAwesome
              name="eye"
              type="font-awesome"
              size={20}
              color="#005689"
            />
          ) : (
            <FontAwesome
              name="eye-slash"
              type="font-awesome"
              size={20}
              color="#005689"
            />
          )}
        </TouchableOpacity>
      </View>
      {statusLoginError === true ? (
        <View style={styles.contentAlert}>
          <MaterialIcons name="mood-bad" size={24} color="black" />
          <Text style={styles.warningAlert}>{messageLoginError}</Text>
        </View>
      ) : (
        <View></View>
      )}
      <Separator marginVertical={10} />
      <TouchableOpacity style={styles.loginButton} onPress={loginFirebase}>
        <Text style={styles.loginButtonText}>Entrar</Text>
      </TouchableOpacity>
      <Separator marginVertical={15} />
      <Text style={styles.textSimple}>É novo por aqui?</Text>
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Cadastre-se</Text>
      </TouchableOpacity>
      <Separator marginVertical={30} />
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#cadefc",
  },
  titleText: {
    fontWeight: "bold",
    fontSize: 40,
    color: "#005689",
    textAlign: "center",
    fontStyle: "italic",
  },
  button: {
    width: "50%",
    height: 40,
    backgroundColor: "#5e87b8",
    padding: 5,
    borderRadius: 5,
    margin: 5
  },
  loginButton: {
    width: "50%",
    height: 40,
    backgroundColor: "#5e87b8",
    padding: 5,
    borderRadius: 5,
  },
  loginButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#005689",
    textAlign: "center",
  },
  buttonText: {
    fontWeight: "bold",
    color: "#005689",
    textAlign: "center",
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  inputView: {
    marginTop: 20,
    width: "95%",
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#005689",
    paddingHorizontal: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  touchableIcon: {
    padding: 4,
  },
  textSimple: {
    color: "#005689",
  },
  textSimpleJustify: {
    color: "#005689",
    width: "95%",
    textAlign: "justify",
  },
  imgLogo: {
    marginBottom: 10,
  },
  warningAlert: {
    paddingLeft: 2,
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
  contentAlert: {
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
