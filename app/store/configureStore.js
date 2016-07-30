import { createStore, applyMiddleware } from 'redux'
import rootReducer from '../reducers'
import createSagaMiddleware from 'redux-saga'
import {watchLoginFlow, watchLogoutFlow, watchCameraData, watchAWSCameraCall, watchAWSLibraryCall, watchFirebaseDataFlow} from '../sagas/sagas'

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
  sagaMiddleware.run(watchCameraData)
  sagaMiddleware.run(watchAWSCameraCall)
  sagaMiddleware.run(watchAWSLibraryCall)
  sagaMiddleware.run(watchFirebaseDataFlow)

  if (module.hot) {
    module.hot.accept(() => {
      const nextRootReducer = require('../reducers/index').default
      store.replaceReducer(nextRootReducer)
    })
  }
  return store
}
