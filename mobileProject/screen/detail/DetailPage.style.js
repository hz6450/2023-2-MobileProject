import { StyleSheet } from "react-native";
import { COLORS } from "../../styles";

const styles = StyleSheet.create({
    typeBtn:{
        flex:1, 
        padding: 8, 
        justifyContent:'center',
        alignItems:'center', 
    },
    typeText:{
        fontSize:25, 
    },
    typeContainer:{
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        borderWidth: 1, 
        borderRadius: 1, 
        backgroundColor: COLORS.lilac
    },
})

export default styles;