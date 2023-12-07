import { StyleSheet } from "react-native";
import { COLORS } from "../../styles";

const styles = StyleSheet.create({
  userInfoContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: 'center',
    marginVertical: 20, //marginBottom: 20, top: 20
  },
  userInfoTextContainer: {
    flexDirection: "column",
    width: "70%",
    alignItems: 'center',
    backgroundColor: "#cccccc",
    padding: 10,
    borderRadius: 10,
  },
  userInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
    width: '55%',

  },
  userInfoLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  userInfoData: {
    fontSize: 16,
  },
  typeBtn:{
    flex:1, 
    padding: 8, 
    justifyContent:'center',
    alignItems:'center',
    borderWidth: 1, 
  },
  typeText:{
    fontSize:23, 
  },
  typeContainer:{
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    borderWidth: 1, 
    borderRadius: 1, 
    flex: 1,
  },
  majortypeContainer:{
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    borderWidth: 1, 
    borderRadius: 1, 
    flex: 1,
  },

})

export default styles;