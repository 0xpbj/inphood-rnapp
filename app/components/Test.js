'use strict';

import React, { Component } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image
} from "react-native";

var _scrollView: ScrollView;
var example = (
      <View>
        <ScrollView
          automaticallyAdjustContentInsets={false}
          horizontal={true}
          style={[styles.scrollView, styles.horizontalScrollView]}>
          {THUMBS.map(createThumbRow)}
        </ScrollView>
        <TouchableOpacity
          style={styles.button}
          onPress={() => { ScrollView.scrollTo({x: 0}); }}>
          <Text>Scroll to start</Text>
        </TouchableOpacity>
      </View>
    )

var Thumb = React.createClass({
  shouldComponentUpdate: function(nextProps, nextState) {
    return false;
  },
  render: function() {
    return (
      <View style={styles.button}>
        <Image style={styles.img} source={{uri:this.props.uri}} />
      </View>
    );
  }
});

var THUMBS = ['https://fbcdn-dragon-a.akamaihd.net/hphotos-ak-ash3/t39.1997/p128x128/851549_767334479959628_274486868_n.png', 'https://fbcdn-dragon-a.akamaihd.net/hphotos-ak-prn1/t39.1997/p128x128/851561_767334496626293_1958532586_n.png', 'https://fbcdn-dragon-a.akamaihd.net/hphotos-ak-ash3/t39.1997/p128x128/851579_767334503292959_179092627_n.png', 'https://fbcdn-dragon-a.akamaihd.net/hphotos-ak-prn1/t39.1997/p128x128/851589_767334513292958_1747022277_n.png', 'https://fbcdn-dragon-a.akamaihd.net/hphotos-ak-prn1/t39.1997/p128x128/851563_767334559959620_1193692107_n.png', 'https://fbcdn-dragon-a.akamaihd.net/hphotos-ak-prn1/t39.1997/p128x128/851593_767334566626286_1953955109_n.png', 'https://fbcdn-dragon-a.akamaihd.net/hphotos-ak-prn1/t39.1997/p128x128/851591_767334523292957_797560749_n.png', 'https://fbcdn-dragon-a.akamaihd.net/hphotos-ak-prn1/t39.1997/p128x128/851567_767334529959623_843148472_n.png', 'https://fbcdn-dragon-a.akamaihd.net/hphotos-ak-prn1/t39.1997/p128x128/851548_767334489959627_794462220_n.png', 'https://fbcdn-dragon-a.akamaihd.net/hphotos-ak-prn1/t39.1997/p128x128/851575_767334539959622_441598241_n.png', 'https://fbcdn-dragon-a.akamaihd.net/hphotos-ak-ash3/t39.1997/p128x128/851573_767334549959621_534583464_n.png', 'https://fbcdn-dragon-a.akamaihd.net/hphotos-ak-prn1/t39.1997/p128x128/851583_767334573292952_1519550680_n.png'];
THUMBS = THUMBS.concat(THUMBS); // double length of THUMBS
var createThumbRow = (uri, i) => <Thumb key={i} uri={uri} />;

var styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#6A85B1',
    height: 300,
  },
  horizontalScrollView: {
    height: 120,
  },
  containerPage: {
    height: 50,
    width: 50,
    backgroundColor: '#527FE4',
    padding: 5,
  },
  text: {
    fontSize: 20,
    color: '#888888',
    left: 80,
    top: 20,
    height: 40,
  },
  button: {
    margin: 7,
    padding: 5,
    alignItems: 'center',
    backgroundColor: '#eaeaea',
    borderRadius: 3,
  },
  buttonContents: {
    flexDirection: 'row',
    width: 64,
    height: 64,
  },
  img: {
    width: 64,
    height: 64,
  }
});
