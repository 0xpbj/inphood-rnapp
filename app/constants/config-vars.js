// An issue in react-native-config is preventing our Android build from working properly,
// see issue https://github.com/luggit/react-native-config/issues/32
//
// Consequently, I've created this file of constants to use until that problem is fixed.
//

module.exports = {
  AWS_BUCKET: 'inphoodimagescdn',
  AWS_BUCKET_REGION: 'us-west-2',
  AWS_CONFIG_KEY: 'AKIAI25XHNISG4KDDM3Q',
  AWS_SECRET_KEY: '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',
  AWS_CDN_IMG_URL: 'http://dqh688v4tjben.cloudfront.net/data/',
  AWS_CDN_THU_URL: 'http://d31kecquuyeb7i.cloudfront.net/resized-data/',

  FIREBASE_API_KEY: 'AIzaSyBmW9xYOdOWcasrKN102p9RCoWhG97hMeY',
  FIREBASE_AUTH_DOMAIN: 'inphooddb-e0dfd.firebaseio.com',
  FIREBASE_DATABASE_URL: 'https://inphooddb-e0dfd.firebaseio.com',
  FIREBASE_STORAGE_BUCKET: 'inphooddb-e0dfd.appspot.com',

  CLARIFAI_CLIENT_ID: 'Gk0xpb23IWIY4vRMbHlgQdUxSjlUPBcySEd_gbXN',
  CLARIFAI_CLIENT_SECRET: 'MwkyjpQgC30xwvW6wzext0FyqXle32BcuGX3ZUEe'
};