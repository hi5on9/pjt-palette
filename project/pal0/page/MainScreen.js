import React, {Component, useState} from 'react';
import {connect} from'react-redux';
import ActionCreator from '../src/actions'
import AsyncStorage from '@react-native-community/async-storage';
import {View, StyleSheet, ImageBackground,TouchableOpacity,Text,Image} from 'react-native';

export default function MainScreen(props){
  const checkLogin= ()=>{
    console.log('Main : 로그인 체크')
    getUserId()
  };
  const getUserId = async ()=> {
    console.log('Main: 유저아이디 체크')
    try {
      const id = await AsyncStorage.getItem('userId')
      if(id){
        console.log('Main : 로그인 기록 있음')
        // this.props.setLogin(true)
        // props.navigation.push('Home');
      }else {
        console.log('Main : 로그인 기록 없음');
        // this.props.setLogin(false)
        props.navigation.push('Login');
      }
    } catch (e) {
      console.log(e)
    }
}
    return (
    <View style={styles.root}>
      {/* <ImageBackground 
      style={styles.content}
      source={require("../assets/img/main.png")}
      resizeMode="cover"
      >
        <Text style={styles.logotxt}>Palette</Text>

        <ImageBackground
          style={styles.startbtn}
          source={require("../assets/img/brush1.png")}
        >
        <TouchableOpacity 
          onPress={checkLogin}>
          <Text style={styles.starttxt}>
            시작하기
          </Text>
        </TouchableOpacity>
      </ImageBackground>
      </ImageBackground> */}
    </View>
  );

}


const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    height : '100%',
    alignItems: "center",
  },
  logotxt: {
    height: 70,
    marginTop:40,
    alignItems: "center",
    fontSize: 60,
    fontFamily : "Golden Plains"
  },
  startbtn:{
    position:'absolute',
    bottom:0,
    width:300,
    height:80,
    resizeMode:'stretch',
    alignItems:"center",
    justifyContent:"center",
    marginBottom:30,
  },
  starttxt : {
    color:'white',
    fontSize:18,
    fontFamily : 'BMHANNAAir_ttf'
  }
});




// export default connect(mapStateToProps,mapDispatchToProps)(MainScreen);
// export default MainScreen;