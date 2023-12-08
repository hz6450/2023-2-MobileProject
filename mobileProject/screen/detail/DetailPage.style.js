import { StyleSheet } from "react-native";
import { COLORS } from "../../styles";

const styles = StyleSheet.create({
  //사용자 정보 관련
  userInfoContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: 'center',
    marginVertical: 20, //marginBottom: 20, top: 20
  },
  //사용자 정보관련
  userInfoTextContainer: {
    flexDirection: "column",
    width: "70%",
    alignItems: 'center',
    backgroundColor: "#cccccc",
    padding: 10,
    borderRadius: 10,
  },
  //사용자 정보 row container
  userInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
    width: '55%',

  },
  //사용자 정보 label
  userInfoLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  //사용자 정보 data
  userInfoData: {
    fontSize: 16,
  },
  //전공 교양 / 전체 필수 선택 버튼
  typeBtn:{
    flex:1, 
    padding: 8, 
    justifyContent:'center',
    alignItems:'center',
    borderWidth: 2, 
    borderRadius: 5,
    borderColor: COLORS.wineRed,
  },
  //전공 교양 / 전체 필수 선택 버튼 text
  typeText:{
    fontSize:23, 
  },
  //전공 교양 / 전체 필수 선택 버튼 container
  typeContainer:{
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    flex: 1,
  },

})

export default styles;