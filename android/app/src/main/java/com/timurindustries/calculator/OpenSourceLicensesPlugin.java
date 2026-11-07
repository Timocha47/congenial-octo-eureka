package com.timurindustries.calculator;

import android.content.Intent;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.android.gms.oss.licenses.OssLicensesMenuActivity;

@CapacitorPlugin(name = "OpenSourceLicenses")
public class OpenSourceLicensesPlugin extends Plugin {

    @PluginMethod
    public void show(PluginCall call) {
        getBridge().executeOnMainThread(() -> {
            OssLicensesMenuActivity.setActivityTitle(getContext().getString(R.string.open_source_licenses));
            getActivity().startActivity(new Intent(getActivity(), OssLicensesMenuActivity.class));
            call.resolve();
        });
    }
}
