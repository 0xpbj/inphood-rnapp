package com.inphoodrn;

import android.app.Application;
import android.util.Log;

import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.appevents.AppEventsLogger;
import com.facebook.reactnative.androidsdk.FBSDKPackage;

import com.facebook.react.ReactApplication;
import com.chirag.RNMail.RNMail;
import com.imagepicker.ImagePickerPackage;
import fr.bamlab.rncameraroll.CameraRollPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import java.util.Arrays;
import java.util.List;

// import Branch and RNBRANCH
import io.branch.rnbranch.*;
import io.branch.referral.Branch;

// import react-native-fetch-blob
import com.RNFetchBlob.*;

// import react-native-camera
import com.lwansbrough.RCTCamera.*;

// import React Native Vector Icons
import com.oblador.vectoricons.*;

// import React Native FS (FileSystem)
import com.rnfs.RNFSPackage;

// import React Native Push Notifications
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;

public class MainApplication extends Application implements ReactApplication {

  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  protected static CallbackManager getmCallbackManager() {
    return mCallbackManager;
  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          new RNMail(),
          new ReactNativePushNotificationPackage(),
          new ImagePickerPackage(),
          new RNFSPackage(),
          new FBSDKPackage(mCallbackManager),
          new RNBranchPackage(),
          new RNFetchBlobPackage(),
          new RCTCameraPackage(),
          new VectorIconsPackage(),
          new CameraRollPackage()
      );
    }
  };

  @Override
  public void onCreate() {
    super.onCreate();

    FacebookSdk.sdkInitialize(getApplicationContext());
    // If we want to use AppEventsLogger to log events:
    // AppEventsLogger.activateApp(this);

    Branch.getAutoInstance(this);
  }

  @Override
  public ReactNativeHost getReactNativeHost() {
      return mReactNativeHost;
  }
}
