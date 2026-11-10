package com.scstc.kidsboxlearning;

import com.getcapacitor.BridgeActivity;
import android.os.Bundle;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(AppUpdaterPlugin.class);
        registerPlugin(ScreenRecorderPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
