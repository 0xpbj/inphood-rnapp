import {
  INIT_CLIENTS_DATA,
  LOAD_CLIENTS_LIST,
  LOAD_CLIENTS_PHOTOS,
  LOAD_CLIENTS_DATA_ERROR
} from '../constants/ActionTypes'

import {call, cancel, cps, fork, put, select, take} from 'redux-saga/effects'

export const getData = (client, photos) => {
  let messagesRef = []
  for (let i = 0; i < photos.length; i++) {
    messagesRef[i] = firebase.database().ref('/global/' + client + '/userData/' + photos[i].key + '/messages')
    messagesRef[i].on('value', function(dataSnapshot){
      let messages = []
      dataSnapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val()
        messages.push(item)
      })
      if (messages.length)
        console.log(messages)
    })
  }
}

export const getPhotos = (clients) => {
  let clientsRef = []
  for (let i = 0; i < clients.length; i++) {
    clientsRef[i] = firebase.database().ref('/global/' + clients[i] + '/userData')
    clientsRef[i].on('value', function(dataSnapshot){
      let photos = []
      dataSnapshot.forEach(function(childSnapshot) {
        var item = childSnapshot
        photos.push(item)
      })
      getData(clients[i], photos)
    })
  }
}

export function* getClients() {
  try {
    let uid = firebase.auth().currentUser.uid
    let trainerRef = firebase.database().ref('/global/' + uid + '/trainerInfo/clientId')
    trainerRef.on('value', function(dataSnapshot) {
      let clients = []
      dataSnapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val()
        item['.key'] = childSnapshot.key
        clients.push(item)
      })
      getPhotos(clients)
    })
  }
  catch(error) {
    console.log(error)
    yield put ({type: LOAD_CLIENTS_DATA_ERROR, error})
  }
}

export function* watchClients() {
  while (true) {
    yield take(INIT_CLIENTS_DATA)
    // yield call(getClients)
  }
}
