import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from 'react';
import { auth, firestore } from '../firebase';
import { FlatList, View, Text, ActivityIndicator, Image, TouchableOpacity } from "react-native";
import styles from '../styles';

const ListarEstabelecimentosUsuario = () => {
    const [loading, setLoading] = useState(true);
    const [estabelecimentos, setEstabelecimentos] = useState([]);

    const navigation = useNavigation();

    const refEstabelecimento = firestore.collection("Estabelecimento");

    useEffect(() => {
        const unsubscribe = refEstabelecimento.onSnapshot((querySnapshot) => {
            const estList = [];
            querySnapshot.forEach((doc) => {
                estList.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });
            setEstabelecimentos(estList);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const irParaVenderAlimento = (estabelecimentoId) => {
        navigation.navigate('VenderAlimento', { estabelecimentoId });
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0782F9" style={styles.center} />;
    }

    const renderItem = ({ item }) => <Item item={item} />
    const Item = ({ item }) => (
        <View style={styles.containerItem}>
            <TouchableOpacity style={styles.item} onPress={() => irParaVenderAlimento(item.id)}>
            <Image source={{ uri: item.imagem }} style={styles.imagem}/>
            <Text style={styles.titulo}>Nome: {item.nome}</Text>
            <Text style={styles.titulo}>Endereço: {item.endereco}</Text>        
            </TouchableOpacity>
        </View>
    )

    return (
        <FlatList 
            data={estabelecimentos}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            refreshing={loading}
            onRefresh={() => {
                setLoading(true);
                setEstabelecimentos([]);
            }}
        />
    );
};

export default ListarEstabelecimentosUsuario;