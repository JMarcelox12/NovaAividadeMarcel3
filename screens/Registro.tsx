import { Text, TouchableOpacity, View } from "react-native";
import styles from "../styles";
import { useNavigation } from "@react-navigation/native";


const Registro = () => {

    const navigation = useNavigation();

    const irParaUsuario = () =>{
        navigation.replace("RegistroUsuario");
    }

    const irParaEstabelecimento = () => {
        navigation.replace("RegistroEstabelecimento");
    }

    return(
        <View style={[styles.buttonContainer, {height: '100%'}]}>
            <View style={styles.areaLateral}>
                <Text style={styles.text}>Você é um ... </Text>
            </View>
        <View style={[styles.areaLateral,{flexDirection: "column", width: "100%"}]}>
            <TouchableOpacity style={styles.boxOne} onPress={irParaUsuario}>
                <Text style={styles.text}>Cliente </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.boxOne} onPress={irParaEstabelecimento}>
                <Text style={styles.text}>Perceiro </Text>
            </TouchableOpacity>
        </View>
        </View>
    );
}

export default Registro;