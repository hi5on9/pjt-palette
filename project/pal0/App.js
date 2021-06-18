import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import { createStore ,combineReducers } from 'redux';
import { Provider ,connect } from 'react-redux';
import store from './src/store'

import MainScreen from './page/MainScreen';  // 메인 로그인 버튼 
import LoginScreen from './page/LoginScreen';  // 로그인
import JoinScreen from './page/JoinScreen';  // 닉네임 성별 나이 기입 
import HomeScreen from './page/HomeScreen';  // Home
import CameraScreen from './page/CameraScreen'; // 영상 & 음성
import ResultScreen from './page/ResultScreen'; // 결과 페이지




const userStack  = createStackNavigator();
const UserStackScreen = () => (
    <userStack.Navigator>
        <userStack.Screen name="Main" component={MainScreen} />
        <userStack.Screen name="Home" component={HomeScreen} options={{headerShown: false}}/>
        <userStack.Screen name="Camera" component={CameraScreen} options={{headerShown: false}}/>
    </userStack.Navigator>
);

const loginStack = createStackNavigator();
const LoginStackScreen = () => (
    <loginStack.Navigator>
        <loginStack.Screen name="Main" component={MainScreen} />
        <loginStack.Screen name="Join" component={JoinScreen} options={{headerShown: false}}/>
        <loginStack.Screen name="Login" component={LoginScreen} options={{headerShown: false}}/>
    </loginStack.Navigator>
);

const ResultStack = createStackNavigator();
const ResultStackScreen = () => (
    <ResultStack.Navigator>
        <ResultStack.Screen name="Result" component={ResultScreen} options={{headerShown: false}}/>
    </ResultStack.Navigator>
);


const mapStateToProps = (state) => {
    console.log("여긴 APP"+state.user)
    return {
      loginstate : state.user.loginState
    }
}



export default() =>{
    const [IsLogin, setIsLogin] = useState(false);
    const [IsResult, setIsResult] = useState(false);

    console.log('hi 여긴 app')

    return (
        <NavigationContainer>
        <Provider store={store()}>
            {IsLogin? (
                IsResult ? (
                    <ResultStackScreen/>
                ) : (
                    <UserStackScreen/>
                )
            ):(
                <LoginStackScreen/>
            )}
        </Provider>
        </NavigationContainer>
    )
}

