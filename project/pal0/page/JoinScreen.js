import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity ,Text,Alert,ImageBackground,Image,ScrollView } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Button,RadioButton,TextInput} from 'react-native-paper';
import { Picker } from "@react-native-community/picker";
import axios from 'axios';
import {AuthContext} from '../src/context'
import * as Animatable from 'react-native-animatable';
import Feather from 'react-native-vector-icons/Feather';

export default function JoinScreen(props) {
    const {signIn} = React.useContext(AuthContext);
    const [loading, setLoading] = useState(false);  
    const [secureTextEntry,setSecure] = useState(true)
    let [pk, setPk] = useState(0);
    let [userId, setUserId] = useState('');
    let [userPw, setUserPw] = useState('');
    let [age, setAge] = React.useState(0);
    let [checked, setChecked] = React.useState(0);

    let pknum = 0;

    const updateSecureTextEntry = () =>{ setSecure(!secureTextEntry) }


    const checkJoin = () => {
        console.log('-- 가입 정보 체크 -- ')
        console.log(userId)
        console.log(userPw)
        console.log(age) 
        console.log(checked) 

        if(userId==''){
            Alert.alert('닉네임을 입력하세요')
        }else if(userPw==''){
            Alert.alert('비밀번호를 입력하세요')
        }else if(age==0){
            Alert.alert('연령대를 선택해 주세요')
        }else if(checked==0){
            Alert.alert('성별을 선택해주세요')
        }else if(!/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/.test(userPw)){
            Alert.alert("비밀번호는 8~20자 이상의 숫자+영문자+특수문자입니다");
        }else {
            console.log('-- axios test --')
            setUserId(userId)
            setUserPw(userPw)
            // 이메일 중복 체크 then 회원가입 cath alert 
            axios.post("http://k3d102.p.ssafy.io:8000/accounts/checked/",{
                username : userId
            })
            .then( res =>{
                console.log(res)
                Alert.alert('이미 존재하는 아이디 입니다!');
            }).catch(err=>{
                join()
                console.log(pk)
                
            })
        
        }
    
    };

    const join = async () =>{
        await  axios.post("http://k3d102.p.ssafy.io:8000/accounts/signup/",{
            username : userId,
            password1: userPw,
            password2: userPw,

            })
            .then(res=>{
                console.log(res.data.user);
                pknum = res.data.user.pk
                setPk(pknum)
                console.log(pknum)
                setLogin(userId);
                initinfo()
            }).catch(err=>{
                console.log(err)
                Alert.alert('회원가입 중 문제가 발생했습니다.');
            })
    }

    const initinfo = async () =>{
        console.log(pknum)
        await axios.post(`http://k3d102.p.ssafy.io:8000/accounts/initinfo/${pknum}/`,{
            gender : checked,
            age : age
            })
            .then(res=>{
                console.log(res);
                // props.navigation.push('Home');
            }).catch(err=>{
                console.log(err)
                Alert.alert('회원가입 중 문제가 발생했습니다.');
            })
    }

    const setLogin = async (userId) =>{
        console.log('로그인 유지 시키깅...');
        try {
        await AsyncStorage.setItem('userId', userId)
        signIn(userId)
        } catch (e) {
        console.log(e)
        }
        }


  return (



    <ScrollView style={styles.root}>
        <View
            style={styles.content}
            >


        <Text style={styles.welcometxt}>Welcome</Text>

        <View style={styles.select}>
            <TouchableOpacity style={styles.sex}
             onPress = {() => {
                setChecked(1)
            }}>
                <View>
                <Image
                   style={checked==1 ? styles.selectsex : styles.notselect}
                    source={require('../assets/img/man.png')}
                />
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sex}
                onPress = {() => {
                    setChecked(2)
                }}>
            <View>
                <Image
                   style={checked==2 ? styles.selectsex : styles.notselect}
                    source={require('../assets/img/woman.png')}
                />
            </View>
            </TouchableOpacity>

        </View>

        <View style={styles.inputView} >
            <Text style={styles.labels}>닉네임</Text>
          <TextInput  
            style={styles.inputText}
            placeholderTextColor="#003f5c"
            autoCapitalize="none"
            onChangeText={userId => setUserId(userId)}/>
            <View style={{width:30}}>
            {userId ? 
                <Animatable.View
                    animation="bounceIn"
                >
                    <Feather 
                        name="check-circle"
                        color="#C8B6E5"
                        size={20}
                    />
                </Animatable.View>
                : null}
                </View>
        </View>

        <View style={styles.inputView} >
            <Text style={styles.labels}>비밀번호</Text>
            <TextInput  
                style={styles.inputText}
                secureTextEntry={secureTextEntry ? true : false}
                autoCapitalize="none"
                placeholderTextColor="#003f5c"
                onChangeText={userPw => setUserPw(userPw)}/>
                 <TouchableOpacity
                    onPress={updateSecureTextEntry}
                    style={{width:30}}
                >
                    {secureTextEntry ? 
                    <Feather 
                        name="eye-off"
                        color="grey"
                        size={20}
                    />
                    :
                    <Feather 
                        name="eye"
                        color="grey"
                        size={20}
                    />
                    }
                </TouchableOpacity>
        </View>


        <View style={styles.select}>
            <View style={styles.pickerset}>
              <Text style={styles.labels}>나이</Text>
              <Picker
                style={styles.picker} //스타일 지정
                selectedValue={age} //제일 위 선택란에 누른 아이템이 표시된다
                onValueChange={(v) => setAge(v)}
                >            
                <Picker.Item label="나이를 선택하세요" value="0" />
                <Picker.Item label="10대" value="1" />
                <Picker.Item label="20대" value="2" />
                <Picker.Item label="30대" value="3" />
                <Picker.Item label="40대" value="4" />
                <Picker.Item label="50대 이상" value="5" />      
            </Picker>
            </View>
        </View>
       
 

        <TouchableOpacity 
        onPress={checkJoin}
        loading={loading}
        style={styles.nextbtn}
        >
        <Text style={styles.loginText}>가입하기</Text>
        </TouchableOpacity>
        
        </View>
    </ScrollView >
  );
}

const styles = StyleSheet.create({
    selectsex:{
        width:120,
        height:120,
        borderRadius:200,
        backgroundColor:'#ECEBFa',
    },  
    notselect:{
        width:120,
        height:120,
        borderRadius:200,
        backgroundColor:'white'
    },
    root: {
        width: '100%',
        flexDirection: 'column'
    },
    content: {
        width: '100%',
        height: '100%',
        alignItems: "center"
    },
welcometxt:{
    fontFamily : "Gellatio Regular",
    fontSize:30,
    marginTop:40,
    marginBottom:40,
},
inputView: {
    justifyContent: "center",
    flexDirection: 'row',
    marginTop: 10,
    marginLeft:20,
    marginRight:10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
},

inputText: {
    height: 50,
    color: "gray",
    flex: 1,
    paddingLeft: 10,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    backgroundColor: "transparent"
},
nextbtn: {
    width: "70%",
    backgroundColor: "#C8B6E5",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 100
},
loginText: {
    color: "white",
    fontFamily: 'Cafe24Oneprettynight',
},
labels: {
    fontFamily : 'Cafe24Oneprettynight',
    fontSize:16,
    marginRight:10,
    width:60,
},
select : {
    flexDirection: 'row',
    alignItems: "center",
    width:'100%',
    justifyContent: 'center',
    marginLeft:20,
    marginRight:10,
    marginBottom:30,
},
sex:{
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flex:1,
    marginRight:5,
    marginLeft:5,
},
pickerset :{
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width:'100%'
},
picker : {
    width:'70%',
    // marginTop: 10,
    marginBottom: 10,

},
pickertxt :{
    width: '10%',
    fontFamily : 'Cafe24Oneprettynight',
    fontSize:16
}
});
