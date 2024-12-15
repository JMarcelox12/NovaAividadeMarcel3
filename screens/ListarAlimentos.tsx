import { View, Text, ActivityIndicator, Image, ScrollView, FlatList, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { auth, firestore } from "../firebase";
import { Alimento } from "../model/Alimento";
import styles from "../styles";

const Listar = () => {
    const [loading, setLoading] = useState(true);
    const [alimento, setAlimento] = useState<Alimento[]>([]);
    const [atualizar, setAtualizar] = useState(true);

    const refAlimento = firestore.collection("Estabelecimento").doc(auth.currentUser?.uid).collection("Alimento");

    useEffect(() => {
        refAlimento.onSnapshot((querySnapshot) => {
            const alimento: any[] = [];
            querySnapshot.forEach((documentSnapshot) => {
                alimento.push({
                    ...documentSnapshot.data(),
                    key: documentSnapshot.id,
                });
            });
            setAlimento(alimento);
            setLoading(false);
        });
    });

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

    const renderItem = ({ item }) => <Item item={item} />
    const Item = ({ item }) => (
        <View style={styles.containerItem}>
            <View style={styles.item}>
            <Image source={{ uri: item.imagem }} style={styles.imagem}/>
            <Text style={styles.titulo}>Nome: {item.nome}</Text>
            <Text style={styles.titulo}>Descrição: {item.descricao}</Text>
            <Text style={styles.titulo}>Preço: {item.preco}</Text>           
            </View>
        </View>
    )

    return (
        <FlatList 
            data={alimento}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            refreshing={atualizar}
            onRefresh={ () => listarTodos() }
        />
    );
};
export default Listar;