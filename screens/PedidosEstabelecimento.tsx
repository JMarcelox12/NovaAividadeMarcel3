import { useEffect, useState } from "react";
import { firestore } from "../firebase";
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
import styles from "../styles";

const PedidosEstabelecimento = ({ estabelecimentoId }) => {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);

    const aceitar = (item) => {
        item.status = "Em Andamento";
        firestore.collection("Pedidos").doc(item.id).update({ status: "Em Andamento" });
    };

    const finalizar = (item) => {
        item.status = "Concluída";
        firestore.collection("Pedidos").doc(item.id).update({ status: "Concluída" });
    };

    useEffect(() => {
        const refPedidos = firestore
            .collection("Pedidos")
            .where("estabelecimentoId", "==", estabelecimentoId)
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
    }, [estabelecimentoId]);

    if (loading) {
        return <ActivityIndicator size="large" color="#0782F9" style={styles.center} />;
    }

    if (pedidos.length === 0) {
        return <Text style={styles.text}>Não há pedidos para este estabelecimento.</Text>;
    }

    const renderPedido = ({ item }) => (
        <View style={[styles.item]}>
            <Text>Pedido: {item.id}</Text>
            <Text>Cliente: {item.userId}</Text>
            <Text>Total: R$ {item.total.toFixed(2)}</Text>
            <Text>Status: {item.status}</Text>
            <Text>Data: {new Date(item.dataCriacao).toLocaleString()}</Text>
            
            <Text style={styles.titulo}>Itens:</Text>
            {item.itens.map((produto, index) => (
                <View key={index} style={styles.item}>
                    <Text>{produto.nome} - R$ {produto.preco.toFixed(2)} x {produto.quantidade}</Text>
                </View>
            ))}
            item.status === "Pendente" ? (
                <TouchableOpacity style={[styles.button, { width: "90%" }]} onPress={() => aceitar(item)}>
                    <Text style={styles.buttonText}>Aceitar</Text>
                </TouchableOpacity>
            ) : item.status === "Em Andamento" ? (
                <TouchableOpacity style={[styles.button, { width: "90%" }]} onPress={() => finalizar(item)}>
                    <Text style={styles.buttonText}>Finalizar</Text>
                </TouchableOpacity>
            ) : null
        </View>
    );

    return (
        <View style={[styles.containerItem,{height: "100%", width: "100%"}]}>
            {pedidos.length === 0 ?(
                <Text style={styles.text}>Ainda não há pedidos feitos </Text>
            ) : (
        <FlatList 
            data={pedidos}
            renderItem={renderPedido}
            keyExtractor={(item) => item.id}
        />
            )}
        </View>
    );
};

export default PedidosEstabelecimento;
