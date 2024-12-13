import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  //Universais
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  text: {
    fontSize: 20,
    color: "black",
    marginLeft: 10,
  },
  areaLateral: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: {
    width: "100%",
    height: "120%",
  },
  //Listagem
  //Inicio
  boxOne: {
    height: 70,
    width: "45%",
    backgroundColor: "#d70f0f",
    margin: 8,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "black",
  },
  boxTwo: {
    height: 80,
    width: 170,
    backgroundColor: "#d70f0f",
    marginLeft: 6,
    marginBottom: 5,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginEnd: 5,
    borderWidth: 3,
    borderColor: "black",
  },
  boxTree: {
    height: 110,
    width: 110,
    backgroundColor: "#d70f0f",
    marginLeft: 6,
    marginBottom: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "black",
  },
  //Cadastro
  boxAuth: {
    borderWidth: 3,
    borderColor: "#d70f0f",
    borderRadius: 10,
    height: 50,
    width: "70%",
    backgroundColor: "white",
    margin: 10,
    justifyContent: 'center',
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#d70f0f",
    width: "60%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    margin: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 15,
  },
  buttonOutline: {
    backgroundColor: "white",
    borderColor: "#d70f0f",
    borderWidth: 2,
  },
  buttonOutlineText: {
    color: "#d70f0f",
  },
  boxAuthText: {
    color: "gray",
    fontSize: 15,
    margin: 5,
  },
  //Perfis
  boxPerfil: {
    height: 60,
    width: "105%",
    borderColor: "#d3d3d3",
    borderWidth: 2,
    alignItems: "center",
    marginLeft: 5,
    padding: 5,
  },
  containerPerfil: {
    flexDirection: "row",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  setaPerfil: {
    height: "80%",
    width: 30,
  },

  //FLATLIST
  item: {
    backgroundColor: 'white',
    borderColor: '#d70f0f',
    borderWidth: 2,
    borderRadius: 15, 
    padding: 15,
    marginVertical: 10,
    width: "95%",
    height: 350,
    justifyContent: "center",
    alignItems: "center",
},
titulo: {
    fontSize: 18,
    color: '#d70f0f',
    fontWeight: '500',
    justifyContent: "space-between",
    alignItems: "center",
},
imagem: {
    width: 200,
    height: 200,
    borderRadius: 200/2,
},
imagemView: {
    alignContent: 'center',
    alignItems: 'center',
    marginBottom: 40
},
buttonEdit: {
  backgroundColor: "#d70f0f",
    width: "40%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    margin: 10,
},

//modal
containerModal: {
  height: 300,
  width: "100%",
  flex: 1,
  backgroundColor: '#fff',
  justifyContent :'center',
  alignItems: "center",
},
modalContent: {
  width: "100%",
  height: "50%",
  backgroundColor: "white",
  borderRadius: 10,
  padding: 20,
  alignItems: "center",
  justifyContent: "center",
  marginVertical: 30
},
});

export default styles;