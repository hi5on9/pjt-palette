import React, {useState,useEffect} from 'react';
import {View, StyleSheet,TouchableOpacity,Text,Alert,ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Voice from 'react-native-voice'
import axios from 'axios';
import {AuthContext} from '../src/context'
import {RNCamera} from 'react-native-camera'


export default function CameraScreen(props) {

  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [camera, setCamera] = useState(false);
  const ENDPOINT = 'http://k3d102.p.ssafy.io:8000/emotion/save/';

  // const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isRecord,setIsRecord] = useState(false);
  const buttonLabel = isRecord ? '끝내기' : '말하기';
  let [userToken, setUserToken] = useState(null);
  let getuserId = null;
  let [Qnum, setNum] = useState(1);
  let [errormsg, setError] = useState('');
  let [questions, setQuestions] = useState(`최근에는 어떠한 기분을 가지고 생활하셨는지${'\n'} 상세하게 설명해주세요`);
  let answer = '';
  let num = 1;
  const {goResult} = React.useContext(AuthContext);

  const voiceLabel = isRecord
    ? '이야기를 듣는 중입니다' // say something 
    : errormsg; //press start button
    

  const _onSpeechStart = () => {
    console.log('--녹음 시작--');
    console.log(getuserId)
    setError('')
  };

  const _onSpeechEnd = () => {
    console.log('--녹음 끝--');
  };

  const _onSpeechResults = (event) => {
    console.log(event)
    console.log('결과????')
    setLoading(true)
    num = num +1;
    if(num>3){
      goResult();
    }
    console.log('--녹음 결과--');
    answer = event.value[0]
    console.log(answer);

    var sendnum = num;
    console.log('질문'+sendnum+'유저아이디'+getuserId)
    axios.post("http://k3d102.p.ssafy.io:8000/emotion/text/",{
      text : answer,
      username : getuserId,
      questionNo : sendnum
    })
    .then(res =>{
        console.log(res.data.que)
        setQuestions(res.data.que)
        setNum(num)
        setLoading(false)

    }).catch(err =>{
        console.log(err)
    })
  };

  const _onSpeechError = (event) => {
    console.log('_onSpeechError');
    console.log(event.error.message);
    setError('다시 한번 녹음을 해주세요!')    
  }

  const _onRecordVoice = () => {
    console.log("voice");
    _startRecording()
    if (isRecord) { 
      Voice.stop(); 
    } 
    else { 
      Voice.start('ko-KR');
    }
    setIsRecord(!isRecord);
  };

  const _startRecording = async () => {
    console.log("camera " + userToken);
    if (recording) {
      camera.stopRecording();
      setRecording(false);
      return;
    }

    setRecording(true);
    const { uri, codec = "mp4" } = await camera.recordAsync();
    console.log(uri);
    setRecording(false);


    setProcessing(true);

    const type = `video/${codec}`;
    const data = new FormData();

    data.append("video", {
      name: "mobile",
      type,
      uri,
    });
    data.append("username", userToken)
    

    try {
      await fetch(ENDPOINT, {
        method: "post",
        body: data,
      });
    } catch (e) {
        console.error(e);
    }

    console.log(data._parts[0][1]);
  
    setProcessing(false);
  }

  useEffect(() => {
    AsyncStorage.getItem('userId', (err, userId) => {
      userToken = setUserToken(userId);
    });

    if(getuserId==null){
    setTimeout(async() => {
      try {
        getuserId = await AsyncStorage.getItem('userId');
        console.log('카메라 페이지:'+getuserId)
        // setUserId(getuserId)
      } catch(e) {
        console.log(e);
      }
    }, 1000);
    }

    Voice.onSpeechStart = _onSpeechStart;
    Voice.onSpeechEnd = _onSpeechEnd;
    Voice.onSpeechResults = _onSpeechResults;
    Voice.onSpeechError = _onSpeechError;
    
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);
  return (
    <View style={styles.root}>
      <View style={styles.camera}>
        <RNCamera
          ref={ref => {
            setCamera(ref)
          }}
          style={{ width: 370, height: '100%'}}
          type={RNCamera.Constants.Type.front}
          flashMode={RNCamera.Constants.FlashMode.on} 
          captureAudio={false}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
        />
      </View>

      <View style={styles.message}>

        {
          loading?
          (
            <>
            <ActivityIndicator size="large"/>
            </>
          ):
          (
            <>
            <View style={styles.btns}>
              <Text style={styles.txt}>Q{Qnum}.</Text>
              <Text style={styles.txt}>{questions}</Text>
            </View>
            <View style={styles.btns}>
              <TouchableOpacity 
              style={styles.nextBtn}
              onPress={_onRecordVoice}
              >
              <Text style={styles.txt2}>{buttonLabel}</Text>
              </TouchableOpacity>
            </View>
          </>
          )
        }

        <Text style={styles.txt}>{voiceLabel}</Text>

      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera : {
    flex :4,
    width: 370,
    marginTop:20,
    marginBottom:10,
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden'
  },
  message :{
    flex:1,
    width: 370,
    marginBottom:10,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(256,256,256,0.7)',
    borderRadius: 20,
  },
  btns:{
    flexDirection:'row',
    justifyContent: 'center',
    width: 300,
  },  
  nextBtn:{
    width:70,
    textAlign:'center',
    backgroundColor:"#c6c1db",
    borderRadius:50,
    height:30,
    marginTop:10,
    marginBottom:10,
    alignItems:"center",
    justifyContent:"center",
  },
  txt:{
    color:"black",
    fontFamily : 'Cafe24Oneprettynight',
  },
  txt2: {
    color: "white",
    fontFamily : 'Cafe24Oneprettynight',
  }
});
