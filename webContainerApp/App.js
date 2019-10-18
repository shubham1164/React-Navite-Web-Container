/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Alert, Clipboard } from 'react-native';
import { WebView } from 'react-native-webview';
import type firebase from 'react-native-firebase';

type Props = {};
export default class App extends Component<Props> {

  componentDidMount(){
    this.getFirebaseToken();
  }

  getFirebaseToken = () => {

    try {
      const enabled = await firebase.messaging().hasPermission();
      if (enabled) {
          // user has permissions
          await firebase.messaging().requestPermission();
          const fcmToken = await firebase.messaging().getToken();
          // get the token from here and send to the Application server and store it permanently in the db 
          console.log('Token: ', fcmToken)
      } else {
          // user doesn't have permission
          alert('No permission')
      }
    } catch (e) {
        // User has rejected permissions
        console.log('err: ', e.message)
    }
  }

  onMessage = (event) => {
    const {title, message} = JSON.parse(event.nativeEvent.data)
    Alert.alert(
      title,
      message,
      [],
      { cancelable: true }
    );
  }

  render() {
    const params = 'platform='+Platform.OS;
    const requestHeader = '"custom-app-header": "react-native-'+Platform.OS+'-app"';
    const sourceUri = 'http://romimate.com';
    console.log("requestHeader - "+requestHeader);
    return (
      <View style={styles.container}>
        <WebView
          source={{
            uri: sourceUri,
            headers: {requestHeader}
          }}
          useWebKit={true}
          style={{ marginTop: 50 }}
          javaScriptEnabled={true}
          originWhitelist={['*']}
          onMessage={this.onMessage}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
