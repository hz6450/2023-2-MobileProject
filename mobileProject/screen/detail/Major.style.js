import { StyleSheet } from "react-native";
import { COLORS } from "../../styles";

const styles = StyleSheet.create({
    printhead:{
        flexDirection:'row',       
        fontWeight: 'bold',
        margin: 5,
        borderWidth: 1,
        alignItems:'center',
        height: 35,

    },
    printbody:{
        flexDirection:'row',
        padding: 5,

    },


    typehead:{
        flex:1,
        fontSize: 20,
        textAlign:'center',
        fontWeight: 'bold',
        borderRightWidth: 1,
    },
    titlehead:{
        flex:5,
        fontSize: 20,
        textAlign:'center',
        fontWeight: 'bold',
        borderRightWidth: 1,

    },
    credithead:{
        flex:1,
        fontSize: 20,
        textAlign:'center',
        fontWeight: 'bold',
        borderRightWidth: 1,

    },
    scorehead:{
        flex:1,
        fontSize: 20,
        textAlign:'center',
        fontWeight: 'bold',
        borderRightWidth: 0,

    },

    typebody:{
        flex:1,
        fontSize: 15,
        textAlign:'center',
        borderRightWidth: 1,

    },
    titlebody:{
        flex:5,
        fontSize: 15,
        borderRightWidth: 1,

    },
    creditbody:{
        flex:1,
        fontSize: 15,
        textAlign:'center',
        borderRightWidth: 1,

    },
    scorebody:{
        flex:1,
        fontSize: 15,
        textAlign:'center',
        borderRightWidth: 0,

    },
});
export default styles;