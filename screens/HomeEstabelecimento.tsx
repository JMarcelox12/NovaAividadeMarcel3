import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native"
import styles from "../styles"
import React from "react"
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../firebase";

const HomeEstabelecimento = () => {

    const navigation = useNavigation();

    const Drawer = createDrawerNavigator();

    const listarAlimento = () => {
        navigation.navigate("ListarAlimento");
    }

    const manterAlimento = () => {
        navigation.navigate("ManterAlimento");
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
        <Drawer.Navigator initialRouteName="Página Inicial">
            <Drawer.Screen name="Página Inicial" component={HomeEstabelecimento}/>
        </Drawer.Navigator>
        <ScrollView style={styles.scroll}>
            <Image source={require('../assets/JaPedeLogo.png')} style={{height: 150, width: "100%"}}/>

            <View style={[styles.buttonContainer, {width: "100%"}]}>

                <TouchableOpacity style={styles.boxPerfil} onPress={listarAlimento}>
                <View style={[styles.containerPerfil]}>
                        <Text style={styles.text}>Mostrar Cardápio </Text>
                        <Image source={require("../assets/setinha.png")} style={styles.setaPerfil}/>
                </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.boxPerfil} onPress={manterAlimento}>
                    <View style={[styles.containerPerfil]}>
                        <Text style={styles.text}>Editar Cardápio </Text>
                        <Image source={require("../assets/setinha.png")} style={styles.setaPerfil}/>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.boxPerfil}>
                    <View style={[styles.containerPerfil]}>
                        <Text style={styles.text}>Dados bancários </Text>
                        <Image source={require("../assets/setinha.png")} style={styles.setaPerfil}/>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.boxPerfil} onPress={listarMotoristas}>
                    <View style={[styles.containerPerfil]}>
                        <Text style={styles.text}>Lista de Motoristas </Text>
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