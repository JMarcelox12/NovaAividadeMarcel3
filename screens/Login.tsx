import { KeyboardAvoidingView, TextInput, View, TouchableOpacity, Text, Image } from "react-native";
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
    };

    const irParaRegistro = () => {
        navigation.navigate("Registro");
    };

    // Função para verificar o tipo de usuário
    const verificaTipoUsuario = async (uid) => {
        try {
            console.log("Verificando tipo de usuário para UID:", uid);
            
            const refUsuario = firestore.collection("Usuario").doc(uid);
            const docUsuario = await refUsuario.get();
            if (docUsuario.exists) {
                const tipoUsuario = docUsuario.data().tipo;
                console.log("Tipo encontrado em Usuario:", tipoUsuario);
                if (tipoUsuario === "usuario") {
                    navigation.replace("HomeUsuario");
                } else {
                    navigation.replace("HomeEstabelecimento");
                }
                return;
            }
    
            const refEstabelecimento = firestore.collection("Estabelecimento").doc(uid);
            const docEstabelecimento = await refEstabelecimento.get();
            if (docEstabelecimento.exists) {
                const tipoEstabelecimento = docEstabelecimento.data().tipo;
                console.log("Tipo encontrado em Estabelecimento:", tipoEstabelecimento);
                if (tipoEstabelecimento === "estabelecimento") {
                    navigation.replace("HomeEstabelecimento");
                }
                return;
            }
    
            alert("Usuário não encontrado em nenhuma tabela!");
        } catch (error) {
            console.error("Erro ao verificar tipo de usuário:", error);
            alert("Erro ao verificar tipo de usuário.");
        }
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                verificaTipoUsuario(user.uid);
            }
        });
        return () => unsubscribe();
    }, [navigation]);

    const handleLogin = () => {
        auth.signInWithEmailAndPassword(email, senha)
            .then(userCredentials => {
                const user = userCredentials.user;
                console.log('Logado como ', user.email);
                verificaTipoUsuario(user.uid);
            })
            .catch(error => {
                console.error("Erro ao fazer login:", error);
                alert("Erro ao fazer login: " + error.message);
            });
    };

    return (
        <KeyboardAvoidingView style={styles.container}>
            <Image source={require('../assets/JaPedeLogo.png')} style={{height: 130, width: "70%", margin: 20,}}/>
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
                        <TouchableOpacity onPress={mudaModal} style={{ height: "105%", width: "100%", alignItems: "center" }}>
                            <Image 
                                source={require('../assets/logo.png')} 
                                style={{ height: '110%', width: '120%' }}
                            />
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View>
        </KeyboardAvoidingView>
    );
};

export default Login;
