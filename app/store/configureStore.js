import { createStore, applyMiddleware } from 'redux'
import rootReducer from '../reducers'
import createSagaMiddleware from 'redux-saga'
import {
  watchLoginFlow,
  watchLogoutFlow,
  watchAWSCameraCall,
  watchAWSLibraryCall,
  watchFirebaseDataFlow
  // watchCameraData,
  // watchAppendCameraData
} from '../sagas/sagas'

// create the saga middleware
const sagaMiddleware = createSagaMiddleware()

export default function configureStore () {
  const store = createStore(
    rootReducer,
    applyMiddleware(sagaMiddleware)
  )

  // then run the saga
  sagaMiddleware.run(watchLoginFlow)
  sagaMiddleware.run(watchLogoutFlow)
  sagaMiddleware.run(watchAWSCameraCall)
  sagaMiddleware.run(watchAWSLibraryCall)
  sagaMiddleware.run(watchFirebaseDataFlow)
  // sagaMiddleware.run(watchCameraData)
  // sagaMiddleware.run(watchAppendCameraData)

  if (module.hot) {
    module.hot.accept(() => {
      const nextRootReducer = require('../reducers/index').default
      store.replaceReducer(nextRootReducer)
    })
  }
  return store
}
