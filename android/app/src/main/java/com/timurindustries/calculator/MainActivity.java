package com.timurindustries.calculator;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(OpenSourceLicensesPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
