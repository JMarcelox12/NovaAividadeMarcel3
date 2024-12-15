import { useEffect, useState } from "react";
import { TouchableOpacity, View, Text, FlatList, Alert, Image } from "react-native";
import styles from "../styles";
import { auth, firestore } from "../firebase";
import { Pedido } from "../model/Pedido";

const Carrinho = () => {
    const [carrinho, setCarrinho] = useState([]);
    const [total, setTotal] = useState(0);

    const carregarCarrinho = async () => {
        const refCarrinho = firestore.collection("Carrinhos").doc(auth.currentUser?.uid);

        try {
            const carrinhoDoc = await refCarrinho.get();
            if (carrinhoDoc.exists) {
                const carrinhoData = carrinhoDoc.data();
                // Verifique se cada item tem id
                carrinhoData.itens.forEach(item => {
                    if (!item.id) {
                        console.error("Item sem id:", item);
                    }
                });
                setCarrinho(carrinhoData.itens || []);
                setTotal(carrinhoData.total || 0);
            } else {
                setCarrinho([]);
                setTotal(0);
            }
        } catch (error) {
            console.error("Erro ao carregar o carrinho:", error);
        }
    };

    const carregarDetalhesProduto = async (id) => {
        const refProduto = firestore.collection("Estabelecimento")
                .doc(auth.currentUser?.uid)
                .collection("Alimento")
                .doc(id);  // Aqui você busca um documento específico

        try {
            const produtoDoc = await refProduto.get();
            if (produtoDoc.exists) {
                const produtoData = produtoDoc.data();
                return produtoData.id;  // Retorna o ID do produto
            } else {
                console.error(`Produto não encontrado: ${id}`);
                return null;
            }
        } catch (error) {
            console.error("Erro ao carregar produto:", error);
            return null;
        }
    };

    useEffect(() => {
        carregarCarrinho();
    }, []);

    const removerCarrinho = async (itemId) => {
        const refCarrinho = firestore.collection("Carrinhos").doc(auth.currentUser?.uid);
        const item = carrinho.find((item) => item.id === itemId);

        if (!item) {
            alert("Item não encontrado no carrinho.");
            return;
        }

        let novosItens = [...carrinho];
        const index = novosItens.findIndex((item) => item.id === itemId);

        if (index !== -1) {
            if (novosItens[index].quantidade > 1) {
                novosItens[index].quantidade -= 1;
            } else {
                novosItens.splice(index, 1);
            }
        }

        const novoTotal = novosItens.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

        try {
            await refCarrinho.update({
                itens: novosItens,
                total: novoTotal,
            });
            setCarrinho(novosItens);
            setTotal(novoTotal);
            console.log("Item removido com sucesso!");
        } catch (error) {
            console.error("Erro ao remover item do carrinho:", error);
            alert("Erro ao remover item do carrinho.");
        }
    };

    const finalizarCompra = async () => {
        const refCarrinho = firestore.collection("Carrinhos").doc(auth.currentUser?.uid);
        const refPedidos = firestore.collection("Pedidos");
        const refItensPedido = firestore.collection("ItensPedido");

        try {
            const carrinhoDoc = await refCarrinho.get();
            if (!carrinhoDoc.exists || !carrinhoDoc.data().itens.length) {
                alert("Carrinho vazio.");
                return;
            }

            const { itens, total } = carrinhoDoc.data();

            // Agrupar itens por estabelecimento
            const pedidosPorEstabelecimento = itens.reduce((acc, item) => {
                if (!acc[item.estabelecimentoId]) {
                    acc[item.estabelecimentoId] = { estabelecimentoId: item.estabelecimentoId, itens: [], subtotal: 0 };
                }
                acc[item.estabelecimentoId].itens.push(item);
                acc[item.estabelecimentoId].subtotal += item.preco * item.quantidade;
                return acc;
            }, {});

            // Criar pedidos para cada estabelecimento
            for (const estabelecimentoId in pedidosPorEstabelecimento) {
                const pedidoData = pedidosPorEstabelecimento[estabelecimentoId];  // Aqui você define a variável pedidoData

                const novoPedido = new Pedido({
                    usuarioId: auth.currentUser?.uid,
                    estabelecimentos: [{
                        estabelecimentoId: estabelecimentoId,
                        itens: pedidoData.itens, // Itens para o estabelecimento
                        subtotal: pedidoData.subtotal,
                    }],
                    total: total,
                    status: "Pendente",
                    dataCriacao: new Date(),
                });

                // Adicionar o pedido à coleção 'Pedidos'
                const pedidoRef = await refPedidos.add(novoPedido.toFirestore());

                // Criar os itens do pedido
                const itensParaPedido = pedidoData.itens.map((item) => {
                    if (!item.id) {
                        console.error("Produto ID ausente para o item:", item);
                        return null;  // Não adiciona o item ao pedido
                    }

                    return {
                        pedidoId: pedidoRef.id,
                        id: item.id,  // Garantir que id esteja presente
                        quantidade: item.quantidade,
                        preco: item.preco,
                    };
                }).filter(item => item !== null);  // Filtra itens inválidos

                if (itensParaPedido.length === 0) {
                    alert("Erro: Algum item do pedido não possui id.");
                    return; // Impede a finalização da compra
                }

                // Adicionar os itens ao Firestore
                for (const item of itensParaPedido) {
                    await refItensPedido.add(item);  // Usando 'add' para adicionar um item de cada vez
                }

                console.log(`Pedido e itens para estabelecimento ${estabelecimentoId} criados com sucesso`);
            }

            // Limpar o carrinho após a finalização da compra
            await refCarrinho.set({ itens: [], total: 0 });
            setCarrinho([]);
            setTotal(0);

            Alert.alert("Compra Finalizada", `Valor total: R$ ${total.toFixed(2)}`);
        } catch (error) {
            console.error("Erro ao finalizar a compra:", error);
            alert("Erro ao finalizar a compra.");
        }
    };

    const renderCarrinhoItem = ({ item }) => (
        <View style={[styles.center, { marginVertical: 20 }]}>
            <View style={[styles.item, { padding: 60 }]}>
                <Image source={{ uri: item.imagem }} style={styles.imagem} />
                <Text style={styles.text}>Nome: {item.nome} </Text>
                <Text>R$ {item.preco.toFixed(2)} x {item.quantidade} </Text>
                <Text>Total: R$ {(item.preco * item.quantidade).toFixed(2)} </Text>
            </View>
            <TouchableOpacity onPress={() => removerCarrinho(item.id)} style={[styles.button, { width: "90%" }]}>
                <Text style={styles.buttonText}>Remover </Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={[styles.containerItem, { height: "100%", width: "100%" }]}>
            {carrinho.length === 0 ? (
                <Text style={styles.text}>O carrinho está vazio </Text>
            ) : (
                <FlatList
                    data={carrinho}
                    renderItem={renderCarrinhoItem}
                    keyExtractor={(item) => item.id}
                />
            )}
            <Text style={styles.text}>Total: R$ {total.toFixed(2)} </Text>
            {carrinho.length > 0 && (
                <TouchableOpacity style={styles.button} onPress={finalizarCompra}>
                    <Text style={styles.text}>Finalizar Compra </Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default Carrinho;