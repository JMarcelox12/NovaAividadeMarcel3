import { useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from 'react';
import { auth, firestore } from '../firebase';
import { FlatList, View, Text, ActivityIndicator, Image } from "react-native";
import styles from '../styles';

const ListarAlimento = () => {
    const [alimentos, setAlimentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const route = useRoute();
    const { estabelecimentoId } = route.params; // ID do estabelecimento passado pela navegação

    // Referência para os alimentos do estabelecimento específico
    const refAlimento = firestore
        .collection("Estabelecimento")
        .doc(estabelecimentoId)  // Usando o ID do estabelecimento
        .collection("Alimento");

    // Carregar os alimentos ao montar o componente
    useEffect(() => {
        const unsubscribe = refAlimento.onSnapshot((querySnapshot) => {
            const alimentosList = [];
            querySnapshot.forEach((doc) => {
                alimentosList.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });
            setAlimentos(alimentosList);  // Atualiza o estado com os alimentos encontrados
            setLoading(false);  // Desliga o estado de loading
        });

        // Limpeza (unsubscribe) quando o componente for desmontado
        return () => unsubscribe();
    }, [estabelecimentoId]); // Recarrega se o ID do estabelecimento mudar

    if (loading) {
        return <ActivityIndicator size="large" color="#0782F9" style={styles.center} />;
    }

    // Componente para renderizar cada item (alimento)
    const renderItem = ({ item }) => (
        <View style={styles.center}>
            <View style={styles.item}>
                <Image source={{ uri: item.imagem }} style={styles.imagem} />
                <Text style={styles.titulo}>Nome: {item.nome}</Text>
                <Text style={styles.titulo}>Descrição: {item.descricao}</Text>
                <Text style={styles.titulo}>Preço: R${item.preco}</Text>
            </View>
        </View>
    );

    return (
        <FlatList 
            data={alimentos}
            renderItem={renderItem}
            keyExtractor={(item) => item.id} // Chave única para cada alimento
            onRefresh={() => {
                setLoading(true); // Resetando o loading antes de refazer a consulta
                setAlimentos([]);  // Limpando a lista de alimentos enquanto carrega novos dados
            }}
            refreshing={loading}  // Indicador de carregamento enquanto a atualização acontece
        />
    );
};

export default ListarAlimento;
