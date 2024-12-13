import styles from "../styles";
import { Usuario } from "../model/Usuario";
import { Estabelecimento } from "../model/Estabelecimento";
import { auth, firestore, storage } from "../firebase";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, TextInput, TouchableOpacity, View, Text, Alert, Image} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "react-native-modal-datetime-picker";
import { uploadBytes } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";



const RegistroEstabelecimento = () => {
    const [formEstabelecimento, setFormEstabelecimento]=
    useState<Partial<Estabelecimento>>({})
    const [dataFinal, setDataFinal] = useState ('');
    const [imagePath, setImagePath] = useState('');
    const [PickerVisible, setPickerVisible] = useState (false);

    const navigation = useNavigation();

    const refUsuario=firestore.collection("Estabelecimento");

    const handleInputChange = (key, value) => {
        setFormEstabelecimento({
            ...formEstabelecimento
,
            [key]: value,
        });
    };

    useEffect(() => {
        const logout = auth.onAuthStateChanged(user => {
            if (user) navigation.replace("HomeEstabelecimento");
        })
    })

    const handleSignUp = () => {
        auth
            .createUserWithEmailAndPassword(formEstabelecimento
    .email, formEstabelecimento
    .senha)
            .then(userCredentials => {
                const user = userCredentials.user;
                console.log('Registrado como ', user.email);

                const refIdUsuario = refUsuario.doc(auth.currentUser.uid);
                refIdUsuario.set({
                    id: auth.currentUser.uid,
                    nome: formEstabelecimento
        .nome,
                    email: formEstabelecimento
        .email,
                    senha: formEstabelecimento
        .senha,
                    imagem: imagePath,
                    endereco: formEstabelecimento
        .endereco,
                    tipo: "estabelecimento",
                })

            })
            .catch(error => alert(error.message))
    }



    const selecionaFoto = () => {
        Alert.alert(
            "Selecionar Foto",
            "Escolha uma alternativa:",
            [
                {
                    text: "Câmera",
                    onPress: () => abrirCamera()
                },
                {
                    text: "Abrir Galeria",
                    onPress: () => abrirGaleria()
                }
            ]
        );
    }

    const abrirCamera = async () => {
        const permissao = await ImagePicker.requestCameraPermissionsAsync();
        if (permissao.granted === false) {
            alert("Você recusou o acesso à câmera");
            return;
        }
        const foto = await ImagePicker.launchCameraAsync();
        enviaFoto(foto);
    }

    const abrirGaleria = async () => {
        const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissao.granted === false) {
            alert("Você recusou o acesso à galeria");
            return;
        }
        const foto = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1
        });
        enviaFoto(foto);
    }

    const enviaFoto = async (foto) => {
        setImagePath(foto.assets[0].uri);
        const filename = foto.assets[0].fileName;
        const ref = storage.ref(`imagens/${filename}`);

        const img = await fetch(foto.assets[0].uri);
        const bytes = await img.blob();
        const fbResult = await uploadBytes(ref, bytes);

        const urlDownload = await storage.ref(fbResult.metadata.fullPath).getDownloadURL();

        setFormEstabelecimento({...formEstabelecimento
, imagem: urlDownload});
    }


    return(
        <KeyboardAvoidingView style={styles.container}>
            <View style={styles.buttonContainer}>

            <Image source={require('../assets/JaPedeLogo.png')} style={{height: 130, width: "70%", margin: 20,}}/>

                <TextInput 
                    placeholder="Nome" 
                    onChangeText={(texto) => handleInputChange("nome", texto)}
                    style={styles.boxAuth} 
                />
                <TextInput 
                    placeholder="Email" 
                    onChangeText={(texto) => handleInputChange("email", texto)}
                    style={styles.boxAuth} 
                />
                <TextInput 
                    placeholder="Senha" 
                    onChangeText={(texto) => handleInputChange("senha", texto)}
                    style={styles.boxAuth} 
                />
                <TextInput 
                    placeholder="Endereço" 
                    onChangeText={(texto) => handleInputChange("endereco", texto)}
                    style={styles.boxAuth} 
                />

                <TouchableOpacity style={[styles.boxAuth]}onPress={selecionaFoto}>
                        {imagePath === '' ? (
                            <Text style={styles.boxAuthText}>Selecionar imagem</Text>
                        ) : (
                            <Text style={[styles.boxAuthText, {alignItems: "center"}]}>imagem(1).png</Text>
                        )}
                </TouchableOpacity>     

            </View> 
            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                    style={[styles.button, styles.buttonOutline]}
                    onPress={handleSignUp}
                >
                    <Text style={[styles.buttonText, styles.buttonOutlineText]}>Registrar</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}

export default RegistroEstabelecimento;