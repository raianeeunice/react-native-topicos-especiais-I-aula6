import * as React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import Separator from "../components/Separator";
import firebase, { db } from "../config/firebase";

export default function Register({ navigation }) {
  const [state, setState] = React.useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [passwordConfirm, setPasswordConfirm] = React.useState("");
  const [passwordSecured, setPasswordSecured] = React.useState(true);
  const [passwordConfirmSecured, setPasswordConfirmSecured] =
    React.useState(true);
  const [statusRegisterError, setStatusRegisterError] = React.useState(false);
  const [messageRegisterError, setMessageRegisterError] = React.useState("");

  const handleChangeText = (key, value) => {
    if (statusRegisterError) {
      setStatusRegisterError(false);
    }
    setState({ ...state, [key]: value });
  };

  function requiredFields() {
    if (
      !state.name ||
      !state.phone ||
      !state.email ||
      !state.password ||
      !passwordConfirm
    )
      return false;
    else return true;
  }

  function validPassword() {
    if (state.password !== passwordConfirm) return false;
    else return true;
  }

  function registerFirebase() {
    if (!requiredFields()) {
      setMessageRegisterError(
        "Todos os campos são de \npreenchimento obrigatório!"
      );
      setStatusRegisterError(true);
    } else {
      if (!validPassword()) {
        setMessageRegisterError(
          'Os campos "Senha" e "Confirma Senha" \nnão coincidem!'
        );
        setStatusRegisterError(true);
      } else {
        firebase
          .auth()
          .createUserWithEmailAndPassword(state.email, state.password)
          .then((userCredential) => {
            let userName = state.name,
              userEmail = state.email;

            userCredential.user.updateProfile({
              displayName: state.name,
            });

            db.collection("Perfis").doc(userCredential.user.uid).set({
              displayName: state.name,
              email: state.email,
              phoneNumber: state.phone,
              tipoUsuario: "cliente",
            });

            setState({ name: "", email: "", phone: "", password: "" });
            setPasswordConfirm("");
            navigation.replace("HomeMenuBottomTab", {
              screen: "Home",
              params: {
                uid: userCredential.user.uid,
                name: userName,
                email: userEmail,
              },
            });
          })
          .catch((error) => {
            if (error.code === "auth/email-already-in-use")
              setMessageRegisterError('"E-mail" (Usuário) já cadastrado!');
            else
              setMessageRegisterError(
                '"E-mail" e/ou "Senha" inválidos!\n(Senha com mínimo de 6 caracteres)'
              );
            setStatusRegisterError(true);
          });
      }
    }
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Text style={styles.titleText}>Dados do Usuário</Text>
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
        <FontAwesome name="user" size={24} color="#005689" />
        <TextInput
          style={styles.input}
          value={state.name}
          onChangeText={(value) => handleChangeText("name", value)}
          placeholder={"Nome"}
        />
      </View>
      <View style={styles.inputView}>
        <MaterialIcons name="phone" size={24} color="#005689" />
        <TextInput
          style={styles.input}
          value={state.phone}
          onChangeText={(value) => handleChangeText("phone", value)}
          placeholder={"Telefone"}
          keyboardType="numeric"
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
      <View style={styles.inputView}>
        <FontAwesome name="lock" size={24} color="#005689" />
        <TextInput
          style={styles.input}
          value={passwordConfirm}
          secureTextEntry={passwordConfirmSecured}
          placeholder={"Confirma Senha"}
          textContentType="password"
          autoCapitalize="none"
          onChangeText={(value) => setPasswordConfirm(value)}
        />
        <TouchableOpacity
          style={styles.touchableIcon}
          onPress={() => setPasswordConfirmSecured(!passwordConfirmSecured)}
        >
          {passwordConfirmSecured ? (
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
      {statusRegisterError === true ? (
        <View style={styles.contentAlert}>
          <MaterialIcons name="mood-bad" size={24} color="black" />
          <Text style={styles.warningAlert}>{messageRegisterError}</Text>
        </View>
      ) : (
        <View></View>
      )}
      <Separator marginVertical={10} />
      <TouchableOpacity style={styles.saveButton} onPress={registerFirebase}>
        <Text style={styles.saveButtonText}>Salvar</Text>
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
    fontSize: 30,
    color: "#005689",
    marginBottom: 20,
    textAlign: "center",
  },
  saveButton: {
    width: "50%",
    height: 40,
    backgroundColor: "#5e87b8",
    padding: 5,
    borderRadius: 5,
  },
  saveButtonText: {
    fontSize: 20,
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
