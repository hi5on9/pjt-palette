import React, { useState } from 'react';
import { Text, View, StyleSheet,TouchableOpacity,Alert,ImageBackground,ScrollView } from 'react-native';
import { TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import {AuthContext} from '../src/context'

export default function LoginScreen(props) {
  
  let [userId, setUserId] = useState('');
  let [userPw, setUserPw] = useState('');

  const {signIn} = React.useContext(AuthContext);
    const goLogin = () =>{
      console.log('로그인 버튼 !!')
        if(userId==''){ Alert.alert('아이디를 입력하세요') }
        else if(userPw==''){ Alert.alert('비밀번호를 입력하세요') }
        else { 
          axios.post("http://k3d102.p.ssafy.io:8000/accounts/checked/",{ 
            username : userId 
          }).then(res => {
            axios.post("http://k3d102.p.ssafy.io:8000/accounts/user/login/",{
              username : userId,
              password : userPw
            }).then(res =>{
              console.log(res)
              setLogin(userId);
            }).catch(err =>{
              console.log(err)
              Alert.alert('비밀번호를 확인하세요')
            })
          }).catch(err=>{
            console.log(err)
            Alert.alert('존재하지 않는 아이디 입니다.');
        })
      }
    }
    const goSignup = () =>{ props.navigation.push('Join'); }
    const setLogin = async (userId) =>{
      try {
        await AsyncStorage.setItem('userId', userId)
        signIn(userId)
        console.log('유저아이디' + userId)
      } catch (e) {
        console.log(e)
    }
  }

  return (
    <ScrollView style={styles.root}>
          
        <View style={{flex:1,width:'100%',justifyContent:'center',alignItems:'center'}}>
        <Text style={styles.logo}>Palette</Text>
        <Text style={{
          fontSize:15,
          fontFamily:"Cafe24Oneprettynight",
          marginLeft: 150,
          marginBottom: 130,
        }}>:너의 마음이 보여</Text>
        </View>

        <View style={{flex:1,width:'100%',justifyContent:'center',alignItems:'center'}}>
        <View style={styles.inputView} >
          <TextInput  
            style={styles.inputText}
            placeholder="Id..." 
            underlineColor='#ECEBF2'
            placeholderTextColor="#003f5c"
            onChangeText={userId => setUserId(userId)}/>
        </View>
        <View style={styles.inputView} >
          <TextInput  
            secureTextEntry
            style={styles.inputText}
            placeholder="Pw..." 
            underlineColor='#ECEBF2'
            placeholderTextColor="#003f5c"
            onChangeText={userPw => setUserPw(userPw)}/>
        </View>
        </View>

        <View style={{flex:1,width:'100%',justifyContent:'center',alignItems:'center'}}>
        <TouchableOpacity 
        style={styles.loginBtn}
        onPress={goLogin}
        >
          <Text style={styles.loginText}>로그인</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text 
          style={styles.forgot}
          onPress={goSignup}
          >회원가입</Text>
        </TouchableOpacity>
        </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content :{
    flex: 1,
    width: '100%',
    height : '100%',
    alignItems: "center",
  },
  logo:{
    fontFamily : "Gellatio Regular",
    fontSize:50,
    height: 100,
    marginTop:50,
  },
  inputView:{
    width:"80%",
    backgroundColor:"#ECEBF2",
    borderRadius:25,
    height:50,
    marginBottom:20,
    justifyContent:"center",
    padding:20
  },
  inputText:{
    height:50,
    color:"gray",
    backgroundColor:'transparent',
  },
  forgot:{
    height:30,
    width:50,
    color:"gray",
    fontSize:13,
    marginTop:10,
    fontFamily : 'Cafe24Oneprettynight',
    marginBottom:100,
  },
  loginBtn:{
    width:"70%",
    backgroundColor:"#C8B6E5",
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:40,
    marginBottom:10
  },
  loginText:{
    color:"white",
    fontFamily : 'Cafe24Oneprettynight'
  }
});
