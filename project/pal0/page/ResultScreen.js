import React, {useState,useEffect} from 'react';
import {View, StyleSheet, ImageBackground,TouchableOpacity,Text,Image,Alert,ScrollView ,NativeModules, Linking} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import {AuthContext} from '../src/context'
import LottieView from 'lottie-react-native';
import Modal from 'react-native-modal'
import {BarChart} from 'react-native-chart-kit'
import { color, min } from 'react-native-reanimated';
import QRCode from 'react-native-qrcode-svg'

export default function ResultScreen(props) {
  let userToken = null;
  const [userId,setuserid] = useState(null)
  const [loading, setLoading] = useState(true);
  const [isModal,setModal] = useState(false);
  const [isreceived,setIsreceived] = useState(false);
  const [threeEmo,setThreeEmo] = useState([]);
  const [threeColor,setThreecolor] = useState([]);
  const [totalMood,setTotalMood] = useState(null);
  const [moodComment,setMoodComment] = useState(null);
  const [music,setMusic] = useState([])
  const [chartdata,setchartData] = useState([[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]]);
  const [age,setAge] = useState(0);
  const [gender,setGender] = useState(0);
  const [time,setTime] = useState(0);
  const [pharse,setPharse] = useState([]);
  const [reco,setRecom] = useState(null);
  const [nowtime,setnowtime] = useState(0);
  const {exitResult} = React.useContext(AuthContext);
  let [qrvalue,setqrvalue] = useState("qr")

  let data = {
    labels: [ chartdata[0][0], chartdata[1][0],chartdata[2][0],chartdata[3][0],chartdata[4][0],chartdata[5][0],chartdata[6][0],chartdata[7][0],chartdata[8][0],chartdata[9][0],],
    datasets: [
      {
        data: [chartdata[0][1],chartdata[1][1],chartdata[2][1],chartdata[3][1],chartdata[4][1],chartdata[5][1],chartdata[6][1],chartdata[7][1],chartdata[8][1],chartdata[9][1],],
        strokeWidth: 2, // optional
        
      }
    ],
  };


  const chartConfig = {
    // backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    // backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0,
    color: () => ('#835EBE'), 
    // labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.3,
    propsForLabels : { 
      fontSize : '10' , 
      fontWeight:'bold'
    } , 
    fillShadowGradient: '#835EBE', // THIS
    fillShadowGradientOpacity: 1, // THIS
  };


  const toggleModal = () => {
    console.log('큐알코드~?')

    var qrstring = (
      ""+userId+
      "/"+(new Date().toISOString().slice(0,10))+
      "/"+totalMood
    )

    // setqrvalue(qrstring)

    console.log(qrstring)
    axios.get(`http://k3d102.p.ssafy.io:8000/emotion/qr/?username=${userId}`)
    .then(res =>{
      console.log(res.data)
      if(res.data.check!="") {
        setIsreceived(false)
        setqrvalue(res.data.check)
      
      } //선물 안 받은거
      else setIsreceived(true) //선물 받았음
      setModal(!isModal);
    }).catch(err =>{
      console.log(err)
    })
    setModal(!isModal);
  }    // qr코드 모달 ~~~~
 
  const colorarr = [
  require('../assets/img/color1.png'), //분노
  require('../assets/img/color2.png'), //혐오
  require('../assets/img/color3.png'), //두려움
  require('../assets/img/color4.png'), //행복
  require('../assets/img/color5_2.png'), //슬픔
  require('../assets/img/color6_3.png'), //놀람
  require('../assets/img/color7_2.png'),] //퍙범
  

  const goHome = () => {
      exitResult()
  }


  const getResult = () =>{
    console.log('결과 주세요')
      axios.get(`http://k3d102.p.ssafy.io:8000/emotion/result/?username=${userToken}`)
      .then(res =>{
        console.log(res.data)
        
        var emocolorarr = [];
        var threecolorsrc = [];
        for(var i=0;i<3;i++){
          console.log(i)
          switch(res.data.emotions[i][0]){
            case 0 :
              threecolorsrc.push(colorarr[0])
              emocolorarr.push("분노")
              break;
            case 1 :
              threecolorsrc.push(colorarr[1])
              emocolorarr.push("혐오")
              break;
            case 2 :
              threecolorsrc.push(colorarr[2])
              emocolorarr.push("두려움")
              break;
            case 3 :
              threecolorsrc.push(colorarr[3])
              emocolorarr.push("행복")
              break;
            case 4 :
              threecolorsrc.push(colorarr[4])
              emocolorarr.push("슬픔")
              break;
            case 5 :
              threecolorsrc.push(colorarr[5])
              emocolorarr.push("놀람")
              break;
            case 6 :
              threecolorsrc.push(colorarr[6])
              emocolorarr.push("평범")
              break;
              
          }
        }
        // console.log(emocolorarr)
        setThreeEmo(emocolorarr)
        setThreecolor(threecolorsrc)
        setTotalMood(res.data.finalEmotion)         
        setMoodComment(res.data.comment)
        setchartData(res.data.statistic.idx)
        setAge(res.data.statistic.age)
        setMusic(res.data.music)
        setRecom(res.data.reco)


        
        setnowtime(new Date().getHours())

        if(res.data.statistic.gender == 1) {
          setGender("남성")
        }else setGender("여성")
        setTime(res.data.statistic.time)
        setPharse(res.data.text)

        

        setLoading(false)
      }).catch(err =>{
          console.log(err)
      })
  }
  
  useEffect(() => {
    if(userToken==null){
      setTimeout(async() => {
        try {
          userToken = await AsyncStorage.getItem('userId');
          console.log('여긴 result:'+userToken)
          setuserid(userToken)
          getResult()
        } catch(e) {
          console.log(e);
        }
      }, 1000);
    } 
    // console.log('결과 페이지: '+userId)
  }, []);

  if(loading) {
    return (
      <ImageBackground
      style={styles.content}
      source={require("../assets/img/bg4.jpg")}
      resizeMode="stretch"
      >
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        {/* <ActivityIndicator size ="large"/> */}      
        <View style={styles.content}>
          <Text style={styles.txt}>당신의 상태를 확인 하는 중입니다.</Text>
          <LottieView 
          style={styles.loader}
          source={require('../assets/img/loader3.json')} autoPlay roof/>
        </View>
      </View>
      </ImageBackground>
    );
  }

  return (
    <ScrollView  style={styles.root}>
      
      <ImageBackground
        style={styles.content}
        source={require("../assets/img/bg4.jpg")}
        resizeMode="stretch"
      >
        <TouchableOpacity 
        onPress={goHome}
        style={{width:'100%', }}
        >
          <Text style={styles.close}>닫기</Text>
      </TouchableOpacity>
{/* --------------감정색깔------------------------------ */}
        <View style={styles.top}>
        <Text style={styles.toptxt}>마음 팔레트</Text>
        </View>
        <View style={styles.emotioncolor}>
            <View style={styles.maincolor}>
              <ImageBackground
              style={styles.imgs}
              source={threeColor[0]} >
                <Text style={styles.colortxt}>{threeEmo[0]}</Text>
              </ImageBackground>
            </View>

            <View style={styles.anothercolor}>
              <View style={styles.color}>
              <ImageBackground
                style={styles.imgs}
                source={threeColor[1]} >
                  <Text style={styles.colortxt}>{threeEmo[1]}</Text>
                </ImageBackground>
              </View>
              <View style={styles.color}>
              <ImageBackground
                style={styles.imgs}
                source={threeColor[2]} >
                  <Text style={styles.colortxt}>{threeEmo[2]}</Text>
                </ImageBackground>
              </View>
            </View>
        </View>
{/* ------------감정 설명------------------------------- */}
        <View style={styles.decswrap}>
        <View style={styles.decs}> 
          <Text style={styles.decstitle}>{totalMood}</Text>
          <Text style={styles.decscontent}>
            {moodComment}{'\n'}
          </Text>
        </View>
{/* ------------추천 리스트-------------------------- */}
        <View style={styles.decs}>
        <Text style={styles.decstitle}>당신을 위한 추천리스트</Text>
          

          <Text style={styles.decscontent}>
            저희가 추천한 노래를 들어보세요!{'\n'}
            바쁜 일상을 잠시 내려놓고, 나의 감정에 귀 기울이고 다독여주는 시간을 찾으실 수 있으면 좋겠습니다♡{'\n'}
          </Text>

          <Text
            style={styles.musictxt}
            onPress={() => Linking.openURL('https://www.youtube.com/results?search_query='+music[0][0]+' '+music[0][1])}
          >🎧 {music[0][0]} - {music[0][1]}{'\n'}</Text>
          <Text
            style={styles.musictxt}
            onPress={() => Linking.openURL('https://www.youtube.com/results?search_query='+music[1][0]+' '+music[1][1])}
          >🎧 {music[1][0]} - {music[1][1]}{'\n'}</Text>
          <Text
            style={styles.musictxt}
            onPress={() => Linking.openURL('https://www.youtube.com/results?search_query='+music[2][0]+' '+music[2][1])}
          >🎧 {music[2][0]} - {music[2][1]}{'\n\n'}</Text>

          <Text style={{textAlign:'right',color:'gray',fontFamily:'Cafe24Oneprettynight',fontSize:11,width:'100%'}}>
          {'<'}노래를 클릭해서 감상 해보세요{'>\n'}</Text>

          <Text style={styles.decscontent}>
            {'\n'}
            {reco}</Text>
          

        </View>

        
{/* ------------성별,시간대,연령에 맞는 통계-------------------------- */}
        <Text style={styles.avgtitle}>{nowtime}시, {age}0대 {gender}들의 결과는?</Text>
          <View style={styles.avgresult}>
          <View style={styles.avgchart}>
          <BarChart
          data={data}
          width={350}
          height={220}
          chartConfig={chartConfig}
          withInnerLines={false}
          fromZero={true}

          showValuesOnTopOfBars={true}
          withHorizontalLabels={false}
          style={{marginLeft:-35,}}
          />
          </View>
          </View>
        

        <View style={styles.present}>
          <Text style={styles.presenttxt}>
            당신을 위해 저희가 작은 선물을 준비했어요.</Text>
          <Text style={styles.presenttxt}>
            근처에 팔레트 자판기가 있다면 아래 버튼을 클릭해주세요.
          </Text>

          <TouchableOpacity 
            style={styles.qrbtn}
            onPress={toggleModal}
          >
          <Text style={styles.btntxt}>🎁선물 받기🎁</Text>

          
          <Modal isVisible={isModal}
            onBackdropPress={()=>setModal(false)}
          >
            <View style={styles.qr}>
              
                {
                  isreceived? (
                    <View style={styles.qrreceived}>
                      <LottieView 
                      style={{width:80,height:80,marginBottom:20,}}
                      source={require('../assets/img/sad.json')} autoPlay roof/>
                    <Text style={styles.qrtxt}>선물은 하루에 한번만 제공됩니다!</Text>
                    </View>
                  ) : (
                    <View style={styles.qrmodal}>
                      <View>
                        <QRCode
                          value={qrvalue}
                        />
                      </View>
                    <Text style={styles.qrtitle}>코드를 팔레트 자판기에 인식 시켜주세요!</Text>
                    </View>
                  )
                }
            </View>
          </Modal>
          </TouchableOpacity>


          <View style={styles.pharsebox}>
            <Text style={styles.pharsetxt}>
              "{pharse[0]}"{'\n'} 
            </Text>
            <Text style={styles.pharsetxt}>
              - {pharse[1]} - 
            </Text>
          </View>


        </View>
        </View>
        </ImageBackground>
    </ScrollView >
  );
}

const styles = StyleSheet.create({
  close:{
    fontFamily : 'Cafe24Oneprettynight',
    fontSize:18,
    textAlign: "right",
    padding:15,
    color:'gray'
    
  },
  pharsebox: {
    padding:30,
    width:300,
    marginTop:60,
    borderTopColor:'#c9cdd2',
    borderBottomColor:'#c9cdd2',
    borderRightColor:'transparent',
    borderLeftColor:'transparent',
    borderWidth:0.2
  },
  pharsetxt: {
    fontFamily : 'Cafe24Oneprettynight',
    fontSize:13,
    textAlign: "center"
  },
  top : {
    alignItems:"center",
    justifyContent:"center",
  },
  toptxt: {
    fontFamily : 'Cafe24Oneprettynight',
    fontSize:35,
    marginBottom:40,
    marginTop:20,
  },
  qrtitle :{
    fontFamily : 'Cafe24Oneprettynight',
    fontSize:15,
    marginTop:20,
  },
  qrtxt:{
    fontFamily : 'Cafe24Oneprettynight',
    fontSize:16,
  },
  qrreceived:{
    backgroundColor:'white',
    height:180,
    width:330,
    alignItems:"center",
    justifyContent:"center",
    borderRadius:10,
  },
  qrmodal:{
    backgroundColor:'white',
    height:300,
    width:330,
    alignItems:"center",
    justifyContent:"center",
    borderRadius:10,

  },
  qr : {
    flex:1,
    alignItems:"center",
    justifyContent:"center",
  },
  qrbtn:{
    width:250,
    backgroundColor:"#C8B6E5",
    borderRadius:60,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:20,

  },
  btntxt :{
    color:"white",
    fontFamily : 'Cafe24Oneprettynight'
  },
  present : {
    marginTop:30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  presenttxt : {
    fontSize:12,
    fontFamily : 'Cafe24Oneprettynight',
  },  
  decswrap: {
    width:'100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom:50,
  },
  avgresult:{
    marginBottom:20,
  },
  avgchart:{
    borderWidth:1,
    borderRadius:25,
    height:230,
    width:330,
    borderColor:'#dbdde1',
    paddingTop:10,
  },
  avgtitle:{
    fontFamily : 'Cafe24Oneprettynight',
    fontSize:13,
    fontWeight:'bold',
    marginBottom:18,
    marginTop:40,

  },
  decstitle:{
    width:260,
    fontFamily : 'Cafe24Oneprettynight',
    fontSize:15,
    fontWeight:'bold',
    marginBottom:7,
  },  
  decs:{
    width:260,  
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:10,
    // backgroundColor:'red',
  },
  musictxt:{
    fontFamily : 'Cafe24Oneprettynight',
    fontSize:13,
    width:'100%'
  },
  decscontent:{
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily : 'Cafe24Oneprettynight',
    fontSize:13,
    lineHeight:18,
    marginBottom:10,
    width:'100%',
  },
  root: {
    flex: 1,
    width: '100%',
    flexDirection: 'column'
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  content :{
    width: '100%',
    height : '100%',
    alignItems: "center",
  },
  emotioncolor:{
    width:'100%',
    alignItems:"center",
    justifyContent: 'center',
    // backgroundColor:'red'
  },
  color:{
    width:120,
    alignItems:"center",
    justifyContent: 'center',
    // backgroundColor:'red'
  },
  maincolor:{
    width:250,
    alignItems:"center",
    justifyContent: 'center',
    marginBottom:-35,
  },
  anothercolor:{
    flexDirection:'row',
  } ,
  imgs:{
    width:150,
    height:140,
    resizeMode:'stretch',
    alignItems:"center",
    justifyContent:"center",
  }, 
  content:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader:{
    marginTop:40,
  },
  colortxt:{
    color:'white',
    fontSize:22,
    // fontWeight:'bold',
    fontFamily : 'Cafe24Oneprettynight'
  },
  txt:{
    fontFamily : 'Cafe24Oneprettynight',
    fontSize:17,
  }
});
