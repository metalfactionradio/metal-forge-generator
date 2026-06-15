package com.syntheticfaction.metalforge;

import com.getcapacitor.BridgeActivity;
import android.webkit.WebView;

public class MainActivity extends BridgeActivity {
    @Override
    public void onStart() {
        super.onStart();
        WebView.setWebContentsDebuggingEnabled(true);
    }
}