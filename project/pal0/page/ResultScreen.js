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
    console.log('????????????~?')

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
      
      } //?????? ??? ?????????
      else setIsreceived(true) //?????? ?????????
      setModal(!isModal);
    }).catch(err =>{
      console.log(err)
    })
    setModal(!isModal);
  }    // qr?????? ?????? ~~~~
 
  const colorarr = [
  require('../assets/img/color1.png'), //??????
  require('../assets/img/color2.png'), //??????
  require('../assets/img/color3.png'), //?????????
  require('../assets/img/color4.png'), //??????
  require('../assets/img/color5_2.png'), //??????
  require('../assets/img/color6_3.png'), //??????
  require('../assets/img/color7_2.png'),] //??????
  

  const goHome = () => {
      exitResult()
  }


  const getResult = () =>{
    console.log('?????? ?????????')
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
              emocolorarr.push("??????")
              break;
            case 1 :
              threecolorsrc.push(colorarr[1])
              emocolorarr.push("??????")
              break;
            case 2 :
              threecolorsrc.push(colorarr[2])
              emocolorarr.push("?????????")
              break;
            case 3 :
              threecolorsrc.push(colorarr[3])
              emocolorarr.push("??????")
              break;
            case 4 :
              threecolorsrc.push(colorarr[4])
              emocolorarr.push("??????")
              break;
            case 5 :
              threecolorsrc.push(colorarr[5])
              emocolorarr.push("??????")
              break;
            case 6 :
              threecolorsrc.push(colorarr[6])
              emocolorarr.push("??????")
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
          setGender("??????")
        }else setGender("??????")
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
          console.log('?????? result:'+userToken)
          setuserid(userToken)
          getResult()
        } catch(e) {
          console.log(e);
        }
      }, 1000);
    } 
    // console.log('?????? ?????????: '+userId)
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
          <Text style={styles.txt}>????????? ????????? ?????? ?????? ????????????.</Text>
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
          <Text style={styles.close}>??????</Text>
      </TouchableOpacity>
{/* --------------????????????------------------------------ */}
        <View style={styles.top}>
        <Text style={styles.toptxt}>?????? ?????????</Text>
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
{/* ------------?????? ??????------------------------------- */}
        <View style={styles.decswrap}>
        <View style={styles.decs}> 
          <Text style={styles.decstitle}>{totalMood}</Text>
          <Text style={styles.decscontent}>
            {moodComment}{'\n'}
          </Text>
        </View>
{/* ------------?????? ?????????-------------------------- */}
        <View style={styles.decs}>
        <Text style={styles.decstitle}>????????? ?????? ???????????????</Text>
          

          <Text style={styles.decscontent}>
            ????????? ????????? ????????? ???????????????!{'\n'}
            ?????? ????????? ?????? ????????????, ?????? ????????? ??? ???????????? ??????????????? ????????? ????????? ??? ????????? ??????????????????{'\n'}
          </Text>

          <Text
            style={styles.musictxt}
            onPress={() => Linking.openURL('https://www.youtube.com/results?search_query='+music[0][0]+' '+music[0][1])}
          >???? {music[0][0]} - {music[0][1]}{'\n'}</Text>
          <Text
            style={styles.musictxt}
            onPress={() => Linking.openURL('https://www.youtube.com/results?search_query='+music[1][0]+' '+music[1][1])}
          >???? {music[1][0]} - {music[1][1]}{'\n'}</Text>
          <Text
            style={styles.musictxt}
            onPress={() => Linking.openURL('https://www.youtube.com/results?search_query='+music[2][0]+' '+music[2][1])}
          >???? {music[2][0]} - {music[2][1]}{'\n\n'}</Text>

          <Text style={{textAlign:'right',color:'gray',fontFamily:'Cafe24Oneprettynight',fontSize:11,width:'100%'}}>
          {'<'}????????? ???????????? ?????? ????????????{'>\n'}</Text>

          <Text style={styles.decscontent}>
            {'\n'}
            {reco}</Text>
          

        </View>

        
{/* ------------??????,?????????,????????? ?????? ??????-------------------------- */}
        <Text style={styles.avgtitle}>{nowtime}???, {age}0??? {gender}?????? ??????????</Text>
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
            ????????? ?????? ????????? ?????? ????????? ???????????????.</Text>
          <Text style={styles.presenttxt}>
            ????????? ????????? ???????????? ????????? ?????? ????????? ??????????????????.
          </Text>

          <TouchableOpacity 
            style={styles.qrbtn}
            onPress={toggleModal}
          >
          <Text style={styles.btntxt}>?????????? ??????????</Text>

          
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
                    <Text style={styles.qrtxt}>????????? ????????? ????????? ???????????????!</Text>
                    </View>
                  ) : (
                    <View style={styles.qrmodal}>
                      <View>
                        <QRCode
                          value={qrvalue}
                        />
                      </View>
                    <Text style={styles.qrtitle}>????????? ????????? ???????????? ?????? ???????????????!</Text>
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
