import {
  createStore,
  applyMiddleware,
  compose
} from 'redux'
import rootReducer from '../reducers'
import createSagaMiddleware from 'redux-saga'
import {
  watchLoginFlow,
  watchLogoutFlow
} from '../sagas/loginSagas'
import {
  watchFirebaseCameraCall,
  watchFirebaseLibraryCall,
} from '../sagas/awsSagas'
import {
  watchFirebaseDataFlow,
} from '../sagas/databaseSagas'
import {
  watchOldFirebaseChatFlow,
  watchFirebaseChatFlow,
} from '../sagas/chatSagas'
import {
  watchClients,
} from '../sagas/clientSagas'

// create the saga middleware
const sagaMiddleware = createSagaMiddleware()

export default function configureStore() {
  const store = createStore(
    rootReducer,
    applyMiddleware(sagaMiddleware),
  )

  // then run the saga
  sagaMiddleware.run(watchLoginFlow)
  sagaMiddleware.run(watchLogoutFlow)
  sagaMiddleware.run(watchFirebaseCameraCall)
  sagaMiddleware.run(watchFirebaseLibraryCall)
  sagaMiddleware.run(watchFirebaseDataFlow)
  sagaMiddleware.run(watchOldFirebaseChatFlow)
  sagaMiddleware.run(watchFirebaseChatFlow)
  sagaMiddleware.run(watchClients)

  if (module.hot) {
    module.hot.accept(() => {
      const nextRootReducer = require('../reducers/index').default
      store.replaceReducer(nextRootReducer)
    })
  }
  return store
}
