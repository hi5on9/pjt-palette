import React from 'react';
import { View, StyleSheet,Image } from 'react-native';
import { Drawer, } from 'react-native-paper';
import {AuthContext} from '../src/context'
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';

export function DrawerContent(props) {
  const {signOut} = React.useContext(AuthContext);

  return(
    <View style={{flex:1}}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <Image
              style={styles.coverimg}
              source={require('../assets/img/pic1.png')}>  
            </Image>
          </View>
            
          <Drawer.Section style={styles.drawerSection}>
            <DrawerItem 
              label="다이어리"
              labelStyle={styles.drawerItem}
              onPress={() => {props.navigation.navigate('Home')}}/>
           
            <DrawerItem 
                label="감정 측정"
                labelStyle={styles.drawerItem}
                onPress={() => {props.navigation.navigate('Camera')}}/>
           
            <DrawerItem 
                label="통계"
                labelStyle={styles.drawerItem}
                onPress={() => {props.navigation.navigate('Chart')}}/>
          </Drawer.Section>
        </View>
      </DrawerContentScrollView>


      <Drawer.Section style={styles.bottomDrawerSection}>
        <DrawerItem 
          label="로그아웃"
          labelStyle={styles.drawerLastItem}
          onPress={() => {signOut()}}/>
      </Drawer.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  coverimg:{
    width:220,
    height:220,
    resizeMode:'contain',
    marginTop:0,
    marginLeft:20,
  },
  drawerSection: {
    marginTop: -15,
  },
  drawerItem: {
    fontFamily:'Cafe24Oneprettynight',
    fontSize:20,
  },
  drawerLastItem: {
    fontFamily:'Cafe24Oneprettynight',
    fontSize:15,
    color: "#AAAAAA"
  }
});