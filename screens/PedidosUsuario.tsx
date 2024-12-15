import { useEffect, useState } from "react";
import { FlatList, Text, View, ActivityIndicator } from "react-native";
import { auth, firestore } from "../firebase";
import styles from "../styles";

const PedidosUsuario = () => {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const refPedidos = firestore
            .collection("Pedidos")
            .where("usuarioId", "==", auth.currentUser?.uid)
            .orderBy("dataCriacao", "desc");

        const unsubscribe = refPedidos.onSnapshot((querySnapshot) => {
            const pedidosList = [];
            querySnapshot.forEach((doc) => {
                pedidosList.push({ id: doc.id, ...doc.data() });
            });
            setPedidos(pedidosList);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#0782F9" style={styles.center} />;
    }

    if (pedidos.length === 0) {
        return <Text style={styles.text}>Você ainda não fez nenhum pedido.</Text>;
    }

    const renderPedido = ({ item }) => (
        <View style={styles.item}>
            <Text>Pedido: {item.id}</Text>
            <Text>Total: R$ {item.total.toFixed(2)}</Text>
            <Text>Status: {item.status}</Text>
            <Text>Data: {new Date(item.dataCriacao).toLocaleString()}</Text>

            <Text style={styles.titulo}>Itens:</Text>
            {item.itens.map((produto, index) => (
                <View key={index} style={styles.item}>
                    <Text>{produto.nome} - R$ {produto.preco.toFixed(2)} x {produto.quantidade}</Text>
                </View>
            ))}

            <Text style={styles.titulo}>Subtotal por Estabelecimento:</Text>
            {item.estabelecimentos.map((estabelecimento, index) => (
                <View key={index} style={styles.item}>
                    <Text>Estabelecimento: {estabelecimento.nome}</Text>
                    <Text>Subtotal: R$ {estabelecimento.subtotal.toFixed(2)}</Text>
                </View>
            ))}
        </View>
    );

    return(
    <FlatList 
        data={pedidos}
        renderItem={renderPedido}
        keyExtractor={(item) => item.id}
    />
);
};

export default PedidosUsuario;

