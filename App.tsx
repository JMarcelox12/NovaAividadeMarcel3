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



export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Login' component={Login}/>
        <Stack.Screen name="RegistroUsuario" component={RegistroUsuario}/>
        <Stack.Screen name="HomeUsuario" component={HomeUsuario}/>
        <Stack.Screen name="RegistroEstabelecimento" component={RegistroEstabelecimento}/>
        <Stack.Screen name="Registro" component={Registro}/>
        <Stack.Screen name="HomeEstabelecimento" component={HomeEstabelecimento}/>
        <Stack.Screen name="ListarAlimentos" component={ListarAlimentos}/>
        <Stack.Screen name="ManterAlimento" component={ManterAlimento}/>
        <Stack.Screen name="RegistroAlimento" component={RegistroAlimento}/>
      </Stack.Navigator>    
    </NavigationContainer>
  );
}