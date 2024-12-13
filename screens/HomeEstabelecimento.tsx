import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native"
import styles from "../styles"
import React from "react"
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../firebase";

const HomeEstabelecimento = () => {

    const navigation = useNavigation();

    //const Drawer = createDrawerNavigator();

    const irParaListarAlimento = () => {
        navigation.navigate("ListarAlimentos");
    }

    const irParaManterAlimento = () => {
        navigation.navigate("ManterAlimento");
    }

    const listarEstabelecimentos = () => {
        navigation.navigate("ListarEstabelecimentos")
    }

    const irParaRegistroAlimento = () => {
        navigation.navigate("RegistroAlimento")
    }

    const handleSignOut = () => {
        auth
            .signOut()
            .then(() => {
                navigation.replace("Login");    
            })
    }
    
    return(
    <View style={styles.container}>
        <ScrollView style={styles.scroll}>
            <Image source={require('../assets/JaPedeLogo.png')} style={{height: 150, width: "100%"}}/>

            <View style={[styles.buttonContainer, {width: "100%"}]}>

                <TouchableOpacity style={styles.boxPerfil}>
                    <View style={[styles.containerPerfil]}>
                        <Text style={styles.text}>Listar pedidos </Text>
                        <Image source={require("../assets/setinha.png")} style={styles.setaPerfil}/>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.boxPerfil} onPress={irParaListarAlimento}>
                <View style={[styles.containerPerfil]}>
                        <Text style={styles.text}>Mostrar Cardápio </Text>
                        <Image source={require("../assets/setinha.png")} style={styles.setaPerfil}/>
                </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.boxPerfil} onPress={irParaRegistroAlimento}>
                <View style={[styles.containerPerfil]}>
                        <Text style={styles.text}>Adicionar Cardápio </Text>
                        <Image source={require("../assets/setinha.png")} style={styles.setaPerfil}/>
                </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.boxPerfil} onPress={irParaManterAlimento}>
                    <View style={[styles.containerPerfil]}>
                        <Text style={styles.text}>Editar Cardápio </Text>
                        <Image source={require("../assets/setinha.png")} style={styles.setaPerfil}/>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.boxPerfil} onPress={listarEstabelecimentos}>
                    <View style={[styles.containerPerfil]}>
                        <Text style={styles.text}>Favoritos </Text>
                        <Image source={require("../assets/setinha.png")} style={styles.setaPerfil}/>
                    </View>
                </TouchableOpacity>
                
                <TouchableOpacity style={[styles.boxPerfil, {height: 90, borderColor: "#d70f0f", borderWidth: 3, marginVertical: 10}]} onPress={handleSignOut}>
                    <View style={[styles.containerPerfil]}>
                        <Text style={[styles.text, {color: "#d70f0f"}]}>Deslogar </Text>
                        <Image source={require("../assets/saida.png")}
                         style={{height: "90%",width: 45,}}/>
                    </View>
                </TouchableOpacity>
            </View>

        </ScrollView>
    </View>
    )
}

export default HomeEstabelecimento;