import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import {AuthContext} from '../src/context'

export default function CameraScreen(props)  {
  const Dots = ({selected}) => {
    let backgroundColor;
    
    backgroundColor = selected ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.3)';
    
    return (
      <View 
          style={{
              width:6,
              height: 6,
              borderRadius:30,
              marginHorizontal: 3,
              backgroundColor
          }}
      />
    );
  }
    
    const Skip = ({...props}) => (
        <TouchableOpacity
            style={{marginHorizontal:20}}
            {...props}
        >
            <Text style={styles.bottombtn}>Skip</Text>
        </TouchableOpacity>
    );
    
    const Next = ({...props}) => (
        <TouchableOpacity
            style={{marginHorizontal:20}}
            {...props}
        >
            <Text style={styles.bottombtn}>Next</Text>
        </TouchableOpacity>
    );
    
    const Done = ({...props}) => (
        <TouchableOpacity
            style={{marginHorizontal:20}}
            {...props}
        >
            <Text style={styles.bottombtn}>Done</Text>
        </TouchableOpacity>
    );
    
    
    const {welcome} = React.useContext(AuthContext);
 
    return (
        <Onboarding
        SkipButtonComponent={Skip}
        NextButtonComponent={Next}
        DoneButtonComponent={Done}
        DotComponent={Dots}
        onSkip={welcome}
        onDone={welcome}
        pages={[
          {
            backgroundColor: '#353d52',
            image: <Image source={require('../assets/img/boarder1.png')} style={styles.imgcontainer} />,
            title: '팔레트에 오신것을 환영합니다!',
            subtitle: 
            '쉼 없이 달려가는 바쁜 일상 속, \n지친 내 감정은 잘 있나요?'
          },
          {
            backgroundColor: '#4b4766',
            image: <Image source={require('../assets/img/boarder2.png')} style={styles.imgcontainer} />,
            title: '자신의 감정을 측정해보세요!',
            subtitle: 
            '카메라와 음성을 통해 감정을 측정하고 \n결과를 받아볼 수 있어요!'
          },
          {
            backgroundColor: '#625e66',
            image: <Image source={require('../assets/img/boarder3.png')}  style={styles.imgcontainer}/>,
            title: '같이 색칠해볼까요?',
            subtitle: "바쁘다는 핑계로 \n무심히 지나치곤 했던 사소한 감정들.\n\n하나하나 다시 깨워서\n 물에 녹여보는 건 어떨까요.",
          },
        ]}
        containerStyles={styles.container}
        titleStyles={styles.title}
        subTitleStyles={styles.subtitle}
        bottomBarHighlight={false}
        bottomBarHeight={50}
      />
    );
};



const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  imgcontainer:{
    width:350,
    height:350,
    resizeMode:'stretch',
    paddingBottom:0,
    marginTop:-50,
  },
  title:{
      fontFamily:'Cafe24Oneprettynight',
      marginTop:-80,
      color: 'white',
      fontSize: 24,
  },
  subtitle:{
    fontFamily:'Cafe24Oneprettynight',
    color: 'white'
  },
  bottombtn:{
    fontSize:13,
    fontFamily:'Cafe24Oneprettynight',
    color: 'white',
  }
});