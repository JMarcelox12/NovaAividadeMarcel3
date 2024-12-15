import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from 'react';
import { auth, firestore } from '../firebase';
import { FlatList, View, Text, ActivityIndicator, Image, TouchableOpacity } from "react-native";
import styles from '../styles';

const VenderAlimento = () => {
    const [alimentos, setAlimentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [carrinho, setCarrinho] = useState([]);
    const [total, setTotal] = useState(0);

    const route = useRoute();
    const { estabelecimentoId } = route.params;

    const navigation = useNavigation();

    const carregarCarrinho = async () => {

        const refCarrinho = firestore.collection("Carrinhos").doc(auth.currentUser?.uid);

        try {
            const carrinhoDoc = await refCarrinho.get();
            if (carrinhoDoc.exists) {
                const carrinhoData = carrinhoDoc.data();
                setCarrinho(carrinhoData.itens || []);
                setTotal(carrinhoData.total || 0);
            } else {
                setCarrinho([]);
                setTotal(0);
            }
        } catch (error) {
            console.error("Erro ao carregar o carrinho:", error);
            alert("Erro ao carregar o carrinho.");
        }
    };

    const adicionarCarrinho = (produto) => {
        const novoItem = {
            produtoId: produto.id,  // Certifique-se de que o ID do produto seja atribuído corretamente
            nome: produto.nome,
            preco: produto.preco,
            quantidade: 1, // Ou o valor desejado
            imagem: produto.imagem,
        };
    
        setCarrinho(prevCarrinho => [...prevCarrinho, novoItem]);
    };
    


    const refAlimento = firestore
        .collection("Estabelecimento")
        .doc(estabelecimentoId)
        .collection("Alimento");

    useEffect(() => {
        const unsubscribe = refAlimento.onSnapshot((querySnapshot) => {
            const alimentosList = [];
            querySnapshot.forEach((doc) => {
                alimentosList.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });
            setAlimentos(alimentosList);
            setLoading(false);
        });

        carregarCarrinho();

        return () => unsubscribe();
    }, [estabelecimentoId]);

    if (loading) {
        return <ActivityIndicator size="large" color="#0782F9" style={styles.center} />;
    }

    const renderItem = ({ item }) => (
        <View style={styles.center}>
            <View style={styles.item}>
                <Image source={{ uri: item.imagem }} style={styles.imagem} />
                <Text style={styles.titulo}>Nome: {item.nome}</Text>
                <Text style={styles.titulo}>Descrição: {item.descricao}</Text>
                <Text style={styles.titulo}>Preço: R${item.preco}</Text>
            </View>
            <TouchableOpacity style={[styles.button, {backgroundColor: "#008000", width:"90%"}]} onPress={() => adicionarCarrinho(item)}>
                <Text style={[styles.buttonText, {fontSize: 20}]}>Adicionar ao carrinho</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <FlatList 
            data={alimentos}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            onRefresh={() => {
                setLoading(true);
                setAlimentos([]);
            }}
            refreshing={loading}
        />
    );
};

export default VenderAlimento;