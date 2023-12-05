import { StyleSheet } from "react-native";
import { COLORS } from "../../styles";

const styles = StyleSheet.create({
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
        backgroundColor: COLORS.lilac,
        flex: 1,
    },
    majortypeContainer:{
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        borderWidth: 1, 
        borderRadius: 1, 
        backgroundColor: COLORS.lavender,
        flex: 1,
    },
})

export default styles;