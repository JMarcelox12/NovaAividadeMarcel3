import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from 'react';
import { auth, firestore, storage } from '../firebase';
import { KeyboardAvoidingView, StyleSheet, View, Alert, Text, TextInput, TouchableOpacity, Pressable, Image, FlatList, ActivityIndicator, ScrollView } from "react-native";
import styles from "../styles";
import { Alimento } from "../model/Alimento";
import * as ImagePicker from "expo-image-picker";
import { uploadBytes } from "firebase/storage";

const RegistroAlimento = () => {
    const [formAlimento, setFormAlimento]=
    useState<Partial<Alimento>>({})
    const [loading, setLoading] = useState(true);
    const [alimento, setAlimento] = useState<Alimento[]>([]); // Array em branco
    const [imagePath, setImagePath] = useState('https://cdn-icons-png.flaticon.com/512/3318/3318274.png');

        

    const refAlimento = firestore.collection("Estabelecimento")
        .doc(auth.currentUser?.uid)
        .collection("Alimento")

    const Salvar = () => {
        const refIdAlimento = refAlimento.doc();
        const alimento = new Alimento(formAlimento);
        alimento.id = refIdAlimento.id;        

        refIdAlimento.set(alimento.toFirestore())
        .then(() => {
            alert("Alimento adicionado!");
            Limpar();
        })
        .catch( error => alert(error.message))
    }

    const Limpar = () => {
        setFormAlimento({});
        setImagePath('https://cdn-icons-png.flaticon.com/512/3318/3318274.png');
    }

    // FUNÇÕES FOTO
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
        if (permissao.granted === false){
            alert("Você recusou o acesso à câmera");
            return;
        }
        const foto = await ImagePicker.launchCameraAsync();
        enviaFoto(foto);
    }

    const abrirGaleria = async() => {
        const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissao.granted === false){
            alert("Você recusou o acesso à câmera");
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

        const urlDownload = await storage.ref(
            fbResult.metadata.fullPath
        ).getDownloadURL();

        setFormAlimento({... formAlimento, imagem: urlDownload});        
    }

    //FLATLIST
    useEffect(() => {
        if (loading){
            const subscriber = refAlimento
            .onSnapshot((querySnapshot) => {
                const alimento = [];
                querySnapshot.forEach((documentSnapshot) => {
                    alimento.push({
                        ...documentSnapshot.data(),
                        key: documentSnapshot.id
                    });
                });
                setAlimento(alimento);
                setLoading(false);
            });
            return () => subscriber();
        }
    }, [alimento]);

    return (
        <KeyboardAvoidingView style={styles.container}>
            <ScrollView style={styles.scroll}>
            <View style={styles.buttonContainer}>
                
            <Image source={require('../assets/JaPedeLogo.png')} style={{height: 130, width: "70%", margin: 20,}}/>

                <TouchableOpacity style={[styles.boxAuth]}onPress={selecionaFoto}>
                        {imagePath === '' ? (
                            <Text style={styles.boxAuthText}>Selecionar imagem</Text>
                        ) : (
                            <Text style={[styles.boxAuthText, {alignItems: "center"}]}>imagem(1).png</Text>
                        )}
                </TouchableOpacity>  

                <TextInput 
                    placeholder="Nome" 
                    value={formAlimento.nome}
                    onChangeText={texto => setFormAlimento({
                        ...formAlimento,
                        nome: texto
                    }) }
                    style={styles.boxAuth} 
                />
                <TextInput 
                    placeholder="Descricao" 
                    value={formAlimento.descricao}
                    onChangeText={texto => setFormAlimento({
                        ...formAlimento,
                        descricao: texto
                    }) }
                    style={styles.boxAuth} 
                />
                <TextInput 
                    placeholder="Preço" 
                    value={(formAlimento.preco || 0).toString()}
                    onChangeText={texto => setFormAlimento({
                        ...formAlimento,
                        preco: parseFloat(texto),
                    }) }
                    style={styles.boxAuth} 
                />
                

            </View> 
            <View style={styles.buttonContainer}>
                
                <TouchableOpacity 
                    style={[styles.button]}
                    onPress={Salvar}
                >
                    <Text style={[styles.buttonText]}>Salvar</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.button, styles.buttonOutline]}
                    onPress={Limpar}
                >
                    <Text style={[styles.buttonText, styles.buttonOutlineText]}>Limpar</Text>
                </TouchableOpacity>
                
            </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default RegistroAlimento;

function setImagePath(uri: any) {
    throw new Error("Function not implemented.");
}
