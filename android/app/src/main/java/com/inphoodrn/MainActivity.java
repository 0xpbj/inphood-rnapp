package com.inphoodrn;

import com.facebook.react.ReactActivity;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import io.branch.rnbranch.RNBranchPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.chirag.RNMail.RNMail;
import com.facebook.reactnative.androidsdk.FBSDKPackage;

// AC: had removed these two imports for some reason--not sure why, re-including them for now.
// TODO: remove stupid comment if android works with these, otherwise look into removing these
import com.rnfs.RNFSPackage;
import com.lwansbrough.ReactCamera.ReactCamera;

// From: https://dev.branch.io/getting-started/sdk-integration-guide/guide/react/#android-configure-manifest
import android.content.Intent;
import io.branch.rnbranch.*;

// Needed to do this to get compilation/deployment to work (comment out ReactCamera)--remains to be
// seen if the component will actually work
//import com.lwansbrough.ReactCamera.ReactCamera;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "inPhoodRN";
    }

    @Override
    protected void onStart() {
        super.onStart();
        RNBranchModule.initSession(this.getIntent().getData(), this);
    }

    @Override
    protected void onStop() {
        super.onStop();
        // The following is recommended, but onStop is not defined in RNBranchModule, commenting out
        // for now.  (See: https://dev.branch.io/getting-started/sdk-integration-guide/guide/react/#start-a-branch-session)
//        RNBranchModule.onStop();
    }

    @Override
    public void onNewIntent(Intent intent) {
        this.setIntent(intent);
    }
}
