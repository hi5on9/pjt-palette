import React, { useEffect, useState } from 'react';
import {View, StyleSheet, ImageBackground,TouchableOpacity,Text,Image} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {AuthContext} from './src/context'
import LottieView from 'lottie-react-native';


import MainScreen from './page/MainScreen';  // 메인 로그인 버튼 1
import LoginScreen from './page/LoginScreen';  // 로그인
import JoinScreen from './page/JoinScreen';  // 닉네임 성별 나이 기입 
import HomeScreen from './page/HomeScreen';  // Home
import CameraScreen from './page/CameraScreen'; // 영상 & 음성
import ResultScreen from './page/ResultScreen'; // 결과 페이지
import OnboardingScreen from './page/OnboardingScreen'; 
import ChartScreen from './page/ChartScreen'; 
import {DrawerContent} from './page/DrawerContent'



const userStack  = createDrawerNavigator();
const UserStackScreen = () => (
<userStack.Navigator drawerContent={props => <DrawerContent {...props}/>}>
        {/* <userStack.Screen name="Main" component={MainScreen} options={{headerShown: false}} /> */}
        <userStack.Screen name="Home" component={HomeScreen} options={{headerShown: false}}/>
        <userStack.Screen name="Camera" component={CameraScreen} options={{headerShown: false}}/>
        <userStack.Screen name="Chart" component={ChartScreen} options={{headerShown: false}}/>
      
        <userStack.Screen name="Onboard" component={OnboardingScreen} options={{headerShown: false}} />
        <userStack.Screen name="Result" component={ResultScreen} options={{headerShown: false}}/>
    </userStack.Navigator>
);

const boardStack = createStackNavigator();
const OnBoardStackScreen = () => (
  <boardStack.Navigator>
        <boardStack.Screen name="Onboard" component={OnboardingScreen} options={{headerShown: false}} />
  </boardStack.Navigator>
)

const loginStack = createStackNavigator();
const LoginStackScreen = () => (
    <loginStack.Navigator>
        {/* <loginStack.Screen name="Main" component={MainScreen} /> */}
        <loginStack.Screen name="Login" component={LoginScreen} options={{headerShown: false}}/>
        <loginStack.Screen name="Join" component={JoinScreen} options={{headerShown: false}}/>
    </loginStack.Navigator>
);

const ResultStack = createStackNavigator();
const ResultStackScreen = () => (
    <ResultStack.Navigator>
        <ResultStack.Screen name="Result" component={ResultScreen} options={{headerShown: false}}/>
    </ResultStack.Navigator>
);

const App = () => {

    const initialLoginState = {
        isLoading: true,
        userName: null,
        userToken: null,
        resultToken : false,
        onBoard: true
      };

      const loginReducer = (prevState, action) => {
        switch( action.type ) {
          case 'RETRIEVE_TOKEN': 
            return {
              ...prevState,
              userToken: action.token,
              isLoading: false,
            };
          case 'LOGIN': 
            return {
              ...prevState,
              userName: action.id,
              userToken: action.token,
              isLoading: false,
            };
          case 'LOGOUT': 
            return {
              ...prevState,
              userName: null,
              userToken: null,
              isLoading: false,
            };
          case 'GO_RESULT' :
            return {
              ...prevState,
              resultToken: true,
            };
          case 'EXIT_RESULT' :
            return {
              ...prevState,
              resultToken: false,
            };
          case 'GETBOARD' :
            return {
              ...prevState,
              isLoading:false
            }
          case 'ONBOARD' : 
          return {
            ...prevState,
            onBoard:false,
          }  
        }
      };

      const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);

      const authContext = React.useMemo(()=>({
        signIn : async (foundUser) =>{
            console.log(foundUser)
            const userToken = foundUser;
            const userName = foundUser

            try {
                await AsyncStorage.setItem('userId', userToken);
                console.log('로그인성공')
              } catch(e) {
                console.log(e);
              }
              // console.log('user token: ', userToken);
              dispatch({ type: 'LOGIN', id: userName, token: userToken });
        },
        signOut : async () =>{
            try {
                await AsyncStorage.removeItem('userId');
                console.log('로그아웃')
              } catch(e) {
                console.log(e);
              }
              dispatch({ type: 'LOGOUT' });
        },
        goResult : () =>{
          console.log('결과 페이지 가기')
          dispatch({ type :'GO_RESULT'})
        },
        exitResult : () => {
          console.log('결과 페이지 나가기')
          dispatch({ type :'EXIT_RESULT'})
        },
        welcome : () => {
          console.log('보드 끄기')
          dispatch({type:'ONBOARD'})
          setTimeout(async() => {
            let userToken =null;
            try {
              userToken = await AsyncStorage.getItem('userId');
              await AsyncStorage.setItem('boardToken','off');
            } catch(e) {
              console.log(e);
            }
            dispatch({ type: 'RETRIEVE_TOKEN', token: userToken });
          console.log('main')
        }, 1000);
        }
    }));

    const getUser = () =>{
      dispatch({type:'ONBOARD'})
        setTimeout(async() => {
          let userToken = null;
          try {
            userToken = await AsyncStorage.getItem('userId');
            console.log('여긴 app3:'+userToken)
          } catch(e) {
            console.log(e);
          }
          dispatch({ type: 'RETRIEVE_TOKEN', token: userToken });
      }, 1000);
    }

    useEffect(() => {
      //  AsyncStorage.setItem('userId', 'iii')
      //  AsyncStorage.removeItem('boardToken');
      let isFirstLaunch = true;
      setTimeout(async() => {
        let boardToken = null;
        try {
        boardToken = await AsyncStorage.getItem('boardToken')
        console.log('보드 토큰'+boardToken)
        boardToken=='off' ? (getUser()) : dispatch({type:'GETBOARD'})
        }catch (e){}
      }, 1000);

    }, []);


    if(loginState.isLoading) {
      return (
        <View style={{flex:1,justifyContetn:'center',alignItems:'center'}}>
          {/* <ActivityIndicator size ="large"/>      
        <LottieView 
        style={{}}
        source={require('./assets/img/loader1.json')} autoPlay roof/> */}
        <ImageBackground 
        style = {{width:'100%',height:'100%',alignItems: "center",}}
        source={require("./assets/img/mainbg.jpg")}
        resizeMode="stretch"
        >
          <View style={{flex:18,alignItems:'center'}}>
          <Text style={{height: 100,
          marginTop:180,
          alignItems: "center",
          fontSize: 50,
          fontFamily : "Gellatio Regular"}}>Palette</Text>

          <Text style={{
            fontSize:15,
            fontFamily:"Cafe24Oneprettynight",
            marginLeft: 150,
          }}>:너의 마음이 보여</Text>
          </View>

          <View style={{flex:1,width:'90%'}}>
            <Text style={{fontFamily:'Cafe24Oneprettynight',textAlign:'right',color:'gray',fontSize:13,}}>갱상도</Text>
          </View>
        </ImageBackground>
        </View>
      );
    }
  
    
    return (
        <AuthContext.Provider value={authContext}>
            <NavigationContainer>
                {
                    loginState.userToken !== null ? (
                        loginState.resultToken ?(<ResultStackScreen/>):(<UserStackScreen/>)
                        ) :
                        (
                          loginState.onBoard? (<OnBoardStackScreen/>): (<LoginStackScreen/>)
                        )
                }
            </NavigationContainer>
        </AuthContext.Provider>
    );

    
}

export default App;