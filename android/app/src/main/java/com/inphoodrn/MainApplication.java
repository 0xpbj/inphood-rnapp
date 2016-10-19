package com.inphoodrn;

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
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

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          new RNBranchPackage(),
          new RNFetchBlobPackage(),
          new RCTCameraPackage(),
          new VectorIconsPackage()
      );
    }
  };

  @Override
  public void onCreate() {
    super.onCreate();
    Branch.getAutoInstance(this);
  }

  @Override
  public ReactNativeHost getReactNativeHost() {
      return mReactNativeHost;
  }
}
