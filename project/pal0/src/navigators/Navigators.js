import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import { connect } from 'react-redux';

const navigationPage = createStackNavigator;

class Navigator extends React.Component{
    constructor(props){
        super(props)
    
      }
    render() {
        return navigationPage;
    }
}



const loginStack  = createStackNavigator();
export function LoginStackNavigator(){
    return(
        <loginStack.Navigator>
        <loginStack.Screen name="Main" component={MainScreen} />
        <loginStack.Screen name="Join" component={JoinScreen} options={{headerShown: false}}/>
        <loginStack.Screen name="Login" component={LoginScreen} options={{headerShown: false}}/>
    </loginStack.Navigator>
    )
}

const ResultStack = createStackNavigator();
export function ResultStackNavigator(){
    return(
        <ResultStack.Navigator>
        <ResultStack.Screen name="Result" component={ResultScreen} options={{headerShown: false}}/>
    </ResultStack.Navigator>
    )
}

const userStack  = createStackNavigator();
export function UserStackNavigator(){
    return(
    <userStack.Navigator>
        <userStack.Screen name="Main" component={MainScreen} />
        <userStack.Screen name="Home" component={HomeScreen} options={{headerShown: false}}/>
        <userStack.Screen name="Camera" component={CameraScreen} options={{headerShown: false}}/>
    </userStack.Navigator>
    )
}


const mapStateToProps = (state) =>{
    console.log('Navigator : 유저 로그인 체크 '+state.user)
    navigationPage = (state.user!=null)? UserStackNavigator:LoginStackNavigator;
    return {
        loginState : state.user
    }
}

export default connect(mapStateToProps)(Navigator);