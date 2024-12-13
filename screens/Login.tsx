import { KeyboardAvoidingView, TextInput, View, TouchableOpacity, Text, Image} from "react-native";
import styles from "../styles";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { auth, firestore } from "../firebase";
import Modal from "react-native-modal";


const Login = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [ModalVisible, setModalVisible] = useState(true);

    const navigation = useNavigation();

    const mudaModal = () => {
        setModalVisible(!ModalVisible); 
    }

    const irParaRegistro=()=>{
        navigation.navigate("Registro");
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                // Verificar primeiro na tabela "Usuarios"
                const refUsuario = firestore.collection("Usuario").doc(user.uid);
                refUsuario.get()
                    .then(doc => {
                        if (doc.exists) {
                            // Usuário encontrado na tabela de "Usuarios"
                            const tipoUsuario = doc.data().tipo;
                            if (tipoUsuario === "usuario") {
                                navigation.replace("HomeUsuario"); // Tela para usuário comum
                            } else if (tipoUsuario === "estabelecimento") {
                                navigation.replace("HomeEstabelecimento"); // Tela para estabelecimento
                            }
                        } else {
                            // Caso não encontre na tabela "Usuarios", verificar na tabela "Estabelecimentos"
                            const refEstabelecimento = firestore.collection("Estabelecimento").doc(user.uid);
                            refEstabelecimento.get()
                                .then(doc => {
                                    if (doc.exists) {
                                        const tipoEstabelecimento = doc.data().tipo;
                                        if (tipoEstabelecimento === "estabelecimento") {
                                            navigation.replace("HomeEstabelecimento"); // Tela para estabelecimento
                                        }
                                    } else {
                                        alert("Usuário não encontrado em nenhuma das tabelas!");
                                    }
                                })
                                .catch(error => {
                                    console.error("Erro ao buscar dados do estabelecimento:", error);
                                    alert("Erro ao buscar dados do estabelecimento.");
                                });
                        }
                    })
                    .catch(error => {
                        console.error("Erro ao buscar dados do usuário:", error);
                        alert("Erro ao buscar dados do usuário.");
                    });
            }
        });
    
        // Função de limpeza
        return () => unsubscribe();
    }, [navigation]); // Passando 'navigation' como dependência

    const handleLogin = () => {

        auth.signInWithEmailAndPassword(email, senha)
            .then(userCredentials => {
                const user = userCredentials.user;
                console.log('Logado como ', user.email);
                
                // Verifica o tipo de usuário no Firestore
                const refUsuario = firestore.collection("Usuarios").doc(user.uid);
                refUsuario.get()
                    .then(doc => {
                        if (doc.exists) {
                            const tipoUsuario = doc.data().tipo; 


                            if (tipoUsuario === "usuario") {
                                navigation.replace("HomeUsuario");
                            } else if (tipoUsuario === "estabelecimento") {
                                navigation.replace("HomeEstabelecimento");
                            } else {
                                alert("Tipo de usuário não reconhecido.");
                            }
                        } else {
                            alert("Usuário não encontrado no banco de dados.");
                        }
                    })
                    .catch(error => alert("Erro ao verificar dados do usuário: " + error.message));
                setModalVisible(false);
            })
            .catch(error => alert("Erro ao fazer login: " + error.message));
    }
    
    return(
        <KeyboardAvoidingView style={styles.container}>
        <View style={styles.buttonContainer}>
            <TextInput 
                placeholder="Email" 
                onChangeText={texto => setEmail(texto)}
                style={styles.boxAuth} 
            />
            <TextInput 
                placeholder="Senha" 
                onChangeText={texto => setSenha(texto)} 
                secureTextEntry
                style={styles.boxAuth} 
            />
        </View> 
        <View style={styles.buttonContainer}>
            <TouchableOpacity 
                style={styles.button}
                onPress={handleLogin}
            >
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={[styles.button, styles.buttonOutline]}
                onPress={irParaRegistro}
            >
                <Text style={[styles.buttonText, styles.buttonOutlineText]}>Registrar</Text>
            </TouchableOpacity>
            <Modal 
        isVisible={ModalVisible}
        animationInTiming={1000}
        animationOut={'bounceOut'}
        animationOutTiming={1000}
        backdropOpacity={0.8}
        >
        <View style={styles.container}>
          <TouchableOpacity onPress={mudaModal} style={{height: "105%", width: "100%", alignItems:"center"}}>
            <Image 
              source={require('../assets/logo.png')} 
              style={{height: '110%', width: '120%'}}
            />
          </TouchableOpacity>
        </View>
      </Modal>
        </View>
    </KeyboardAvoidingView>
    );
}

export default Login;