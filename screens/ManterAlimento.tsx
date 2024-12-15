import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from 'react';
import { auth, firestore, storage } from '../firebase';
import { KeyboardAvoidingView, StyleSheet, View, Alert, Text, TextInput, TouchableOpacity, Pressable, Image, FlatList, ActivityIndicator, Button, ScrollView } from "react-native";
import styles from "../styles";
import * as ImagePicker from "expo-image-picker";
import { uploadBytes } from "firebase/storage";
import { Alimento } from "../model/Alimento";
import Modal from "react-native-modal";
import Picker from "react-native-picker-select";

const ManterAlimento = () => {
    const [formAlimento, setFormAlimento]=
    useState<Partial<Alimento>>({})
    const [loading, setLoading] = useState(true);
    const [atualizar, setAtualizar] = useState(true);
    const [alimento, setAlimento] = useState<Alimento[]>([]); // Array em branco
    const [ModalEditar, setModalEditar] = useState(false);
    const [imagePath, setImagePath] = useState('https://cdn-icons-png.flaticon.com/512/3318/3318274.png');

    const refAlimento = firestore.collection("Estabelecimento")
        .doc(auth.currentUser?.uid)
        .collection("Alimento")

    const Salvar = async(item) => {
        const alimento = new Alimento(formAlimento);

        if(alimento.id === undefined) {
            const refIdAlimento = refAlimento.doc();
            alimento.id = refIdAlimento.id;        
            
            refIdAlimento.set(alimento.toFirestore())
            .then(() => {
                alert("Alimento adicionado!");
                Limpar();
            })
            .catch( error => alert(error.message))
        } else {
            const refIdAlimento = refAlimento.doc(alimento.id);

            refIdAlimento.update(alimento.toFirestore())
            .then(() =>{
                alert("Alimento atualizado!");
                Limpar();
            })
            .catch( error => alert(error.message))
        }
        setAtualizar(true);
        
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
            listarTodos();
        }
    }, [alimento]);

    const listarTodos = () => {
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
            setAtualizar(false);
        });
        return () => subscriber();
    }



    if (loading){
        return <ActivityIndicator 
                    size="60" 
                    color="#0782F9"
                    styles={styles.item}
                />
    }


    // EXCLUI E EDITAR
    const excluir = async(item) => {
        Alert.alert(
            "Excluir " + item.nome + "?",
            "Alimento não poderá ser recuperado!",
            [
                {
                    text: "Cancelar"
                },
                {
                    text: "Excluir",
                    onPress: async () => {
                        await refAlimento
                            .doc(item.id)
                            .delete()
                            .then( () => {
                                alert("Alimento excluído!");
                                setAtualizar(true);
                            })
                    }
                }
            ]

        )
    }

    const editar = async (item: Alimento) => {
        firestore
            .collection("Estabelecimento")
            .doc(auth.currentUser?.uid)
            .collection("Alimento")
            .doc(item.id)
            .onSnapshot((documentSnapshot) => {
                const alimento = new Alimento(documentSnapshot.data());
                setFormAlimento(alimento);
                setAtualizar(true);
            });
    };



    const renderItem = ({ item }) => <Item item={item} />
    const Item = ({ item }) => (
        <View style={styles.containerItem}>
            <TouchableOpacity style={styles.item}
                    onPress={() => {
                        editar(item);
                    }}
                    onLongPress={() => excluir(item)}
            >
            <Image source={{ uri: item.imagem }} style={styles.imagem}/>
            <Text style={styles.titulo}>Nome: {item.nome}</Text>
            <Text style={styles.titulo}>Descrição: {item.texto}</Text>
            <Text style={styles.titulo}>Preço: {item.preco}</Text>            
            </TouchableOpacity>
        </View>
    )

    return (
        <View style={styles.container}>
        <ScrollView style={styles.scroll}>
            <View style={[ {flexDirection: "column", alignItems: "center", justifyContent: 'center', marginTop: 50 }]}>
                
                <View style={styles.buttonContainer}>
                    <TextInput
                        placeholder="Nome *"
                        value={formAlimento.nome}
                        onChangeText={(texto) =>
                            setFormAlimento({
                                ...formAlimento,
                                nome: texto,
                            })
                        }
                        style={styles.boxAuth}
                    />
                </View>
                <View style={styles.buttonContainer}>
                    <TextInput
                        placeholder="Descrição *"
                        value={formAlimento.descricao}
                        onChangeText={(texto) =>
                            setFormAlimento({
                                ...formAlimento,
                                descricao: texto,
                            })
                        }
                        style={styles.boxAuth}
                    />
                </View>
                <View style={styles.buttonContainer}>
                    <TextInput
                        placeholder="Preço *"
                        value={(formAlimento.preco || 0).toString()}
                        onChangeText={(texto) =>
                            setFormAlimento({
                                ...formAlimento,
                                preco: parseFloat(texto),
                            })
                        }
                        style={styles.boxAuth}
                    />
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, styles.buttonOutline]} onPress={Limpar}>
                    <Text style={[styles.buttonText, styles.buttonOutlineText]}>Limpar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={Salvar}>
                    <Text style={styles.buttonText}>Salvar</Text>
                </TouchableOpacity>
            </View>
            <FlatList 
                            data={alimento}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id}
                            refreshing={atualizar}
                            onRefresh={ () => listarTodos() }
                        />
        </ScrollView>
        </View>
    );
}

export default ManterAlimento;