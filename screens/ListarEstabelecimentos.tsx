import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from 'react';
import { auth, firestore } from '../firebase';
import { FlatList, View, TextInput, TouchableOpacity, Text, ActivityIndicator, Image } from "react-native";
import styles from '../styles';
import { Estabelecimento } from '../model/Estabelecimento';
import { SafeAreaView } from "react-native-safe-area-context";

const ListarEstabelecimentos = () => {
    const [loading, setLoading] = useState(true);
    const [atualizar, setAtualizar] = useState(true);
    const [estabelecimento, setEstabelecimento] = useState<Estabelecimento[]>([]); // Array em branco

    const navigation = useNavigation();

    const irParaListarAlimento = () => {
        navigation.navigate("ListarAlimentos")
    }

    const refEstabelecimento = firestore.collection("Estabelecimento")
    //FLATLIST
    useEffect(() => {
        if (loading){
            listarTodos();
        }
    }, [estabelecimento]);

    const listarTodos = () => {
        const subscriber = refEstabelecimento
        .onSnapshot((querySnapshot) => {
            const estabelecimento = [];
            querySnapshot.forEach((documentSnapshot) => {
                estabelecimento.push({
                    ...documentSnapshot.data(),
                    key: documentSnapshot.id
                });
            });
            setEstabelecimento(estabelecimento);
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


    const renderItem = ({ item }) => <Item item={item} />
    const Item = ({ item }) => (
        <View style={styles.containerPerfil}>
            <TouchableOpacity style={styles.item} onPress={irParaListarAlimento}>
            <Image source={{ uri: item.imagem }} style={styles.imagem}/>
            <Text style={styles.titulo}>Nome: {item.nome}</Text>
            <Text style={styles.titulo}>Endereço: {item.endereco}</Text>
            </TouchableOpacity>
        </View>
    )

    return (
        <View style={styles.container}>
            <FlatList 
                data={estabelecimento}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                refreshing={atualizar}
                onRefresh={ () => listarTodos() }
            />
        </View>
    )



}
export default ListarEstabelecimentos;