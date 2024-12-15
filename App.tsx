import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

import Login from "./screens/Login";
import HomeUsuario from "./screens/HomeUsuario";
import RegistroUsuario from "./screens/RegistroUsuario";
import Registro from "./screens/Registro";
import RegistroEstabelecimento from "./screens/RegistroEstabelecimento";
import HomeEstabelecimento from './screens/HomeEstabelecimento';
import ListarAlimentos from "./screens/ListarAlimentos";
import ManterAlimento from './screens/ManterAlimento';
import RegistroAlimento from "./screens/RegistroAlimento";
import ListarEstabelecimentos from "./screens/ListarEstabelecimentos";
import VenderAlimento from './screens/VenderAlimento';
import ListarEstabelecimentosUsuario from './screens/ListarEstabelecimentoUsuario';
import Carrinho from './screens/Carrinho';
import PedidosUsuario from './screens/PedidosUsuario';
import PedidosEstabelecimento from './screens/PedidosEstabelecimento';


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/*GERAL*/}
        <Stack.Screen name='Login' component={Login}/>
        <Stack.Screen name="Registro" component={Registro}/>
        {/*USUARIO*/}
        <Stack.Screen name="RegistroUsuario" component={RegistroUsuario}/>
        <Stack.Screen name="HomeUsuario" component={HomeUsuario}/>
        <Stack.Screen name="ListarEstabelecimentosUsuario" component={ListarEstabelecimentosUsuario}/>
        <Stack.Screen name="Carrinho" component={Carrinho}/>
        <Stack.Screen name="PedidosUsuario" component={PedidosUsuario}/>
        {/*ESTABELECIMENTO*/}
        <Stack.Screen name="RegistroEstabelecimento" component={RegistroEstabelecimento}/>
        <Stack.Screen name="HomeEstabelecimento" component={HomeEstabelecimento}/>
        <Stack.Screen name="ListarEstabelecimentos" component={ListarEstabelecimentos}/>
        <Stack.Screen name="PedidosEstabelecimento" component={PedidosEstabelecimento}/>
        {/*ALIMENTO*/}
        <Stack.Screen name="RegistroAlimento" component={RegistroAlimento}/>
        <Stack.Screen name="ListarAlimentos" component={ListarAlimentos}/>
        <Stack.Screen name="ManterAlimento" component={ManterAlimento}/>
        <Stack.Screen name="VenderAlimento" component={VenderAlimento}/>
      </Stack.Navigator>    
    </NavigationContainer>
  );
}