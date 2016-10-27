package com.inphoodrn;

import com.facebook.react.ReactActivity;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import io.branch.rnbranch.RNBranchPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;

// From: https://dev.branch.io/getting-started/sdk-integration-guide/guide/react/#android-configure-manifest
import io.branch.rnbranch.*;
import android.content.Intent;


public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName()
    {
        return "inPhoodRN";
    }

    @Override
    protected void onStart()
    {
        super.onStart();
        RNBranchModule.initSession(this.getIntent().getData(), this);
    }

    @Override
    public void onNewIntent(Intent intent)
    {
        this.setIntent(intent);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data)
    {
        super.onActivityResult(requestCode, resultCode, data);

        MainApplication.getmCallbackManager().onActivityResult(requestCode, resultCode, data);
    }
}
