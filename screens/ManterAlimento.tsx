import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from 'react';
import { auth, firestore, storage } from '../firebase';
import { KeyboardAvoidingView, StyleSheet, View, Alert, Text, TextInput, TouchableOpacity, Pressable, Image, FlatList, ActivityIndicator, Button, ScrollView } from "react-native";
import styles from "../styles";
import * as ImagePicker from "expo-image-picker";
import { uploadBytes } from "firebase/storage";
import { Alimento } from "../model/Alimento";
import Modal from "react-native-modal";

const ManterAlimento = () => {
    const [formAlimento, setFormAlimento]=
    useState<Partial<Alimento>>({})
    const [loading, setLoading] = useState(true);
    const [atualizar, setAtualizar] = useState(true);
    const [alimento, setAlimento] = useState<Alimento[]>([]); // Array em branco
    const [ModalEditar, setModalEditar] = useState(false);
    const [imagePath, setImagePath] = useState('https://cdn-icons-png.flaticon.com/512/3318/3318274.png');

    const refALimento = firestore.collection("Estabelecimento")
        .doc(auth.currentUser?.uid)
        .collection("Alimento")

    const modalEditar = () => {
        setModalEditar(!ModalEditar);
    }

    const Salvar = async() => {
        const alimento = new Alimento(formAlimento);

        if(alimento.id === undefined) {
            const refIdAlimento = refALimento.doc();
            alimento.id = refIdAlimento.id;        
            
            refIdAlimento.set(alimento.toFirestore())
            .then(() => {
                alert("Alimento adicionado!");
                Limpar();
            })
            .catch( error => alert(error.message))
        } else {
            const refIdAlimento = refALimento.doc(alimento.id);

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
        const subscriber = refALimento
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
                    style={styles.item}
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
                        const resultado = await refALimento
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

    const editar = async(item) => {
        const resutado = firestore.collection('Estabelecimento')
            .doc(auth.currentUser?.uid)
            .collection('Alimento')
            .doc(item.id)
            .onSnapshot( documentSnapshot => {
                const alimento = new Alimento(documentSnapshot.data())
                setFormAlimento(alimento);
                
                setImagePath(alimento.imagem);
             })

    }

    const renderItem = ({ item }) => <Item item={item} />
    const Item = ({ item }) => (
        <View style={{flexDirection: "column", alignItems: "center", justifyContent: 'center'}}>
            <TouchableOpacity style={styles.item}>
            <Image source={{ uri: item.imagem }} style={styles.imagem}/>
            <Text style={styles.titulo}>Nome: {item.nome}</Text>
            <Text style={styles.titulo}>Descrição: {item.descricao}</Text>
            <Text style={styles.titulo}>Preço: {item.preco}</Text>            
            </TouchableOpacity>
            <View style={styles.areaLateral}>
                <TouchableOpacity style={[styles.buttonEdit, styles.buttonOutline]} onPress={modalEditar}>
                    <Text style={[styles.buttonText, styles.buttonOutlineText]}>EDITAR </Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.buttonEdit]} onPress={excluir}>
                    <Text style={[styles.buttonText]}>EXCLUIR </Text>
                </TouchableOpacity>
            </View>
        </View>
    )



    return (
        <View style={styles.container}>
            <FlatList 
                data={alimento}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                refreshing={atualizar}
                onRefresh={ () => listarTodos() }
            />
            <Modal
                isVisible={ModalEditar}
            >
        <KeyboardAvoidingView style={styles.containerModal}>
            <ScrollView style={styles.scroll}>
            <View style={[styles.buttonContainer, {marginVertical: 30}]}>

                <Pressable onPress={ () => selecionaFoto() }>
                    <View style={styles.imagemView}>
                        <Image source={{ uri: imagePath }} style={styles.imagem}/>
                    </View>
                </Pressable> 

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
                    value={formAlimento.preco}
                    onChangeText={texto => setFormAlimento({
                        ...formAlimento,
                        preco: texto
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
                    onPress={modalEditar}
                >
                    <Text style={[styles.buttonText, styles.buttonOutlineText]}>Fechar </Text>
                </TouchableOpacity>
            </View>
            </ScrollView>
        </KeyboardAvoidingView>
                </Modal>
        </View>
    );
}

export default ManterAlimento;