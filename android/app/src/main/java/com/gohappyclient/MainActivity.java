package com.gohappyclient;

import android.app.AlarmManager;
import android.content.Context;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.content.pm.PackageManager;
import androidx.core.app.ActivityCompat;
import android.Manifest;
import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {
    @Override
    protected String getMainComponentName() {
        return "GoHappyClient";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(null);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            checkAlarmsRemindersPermission();
        }
    }

    private boolean checkAlarmsRemindersPermission() {
        AlarmManager alarmManager = (AlarmManager) getSystemService(Context.ALARM_SERVICE);
        boolean hasPermission = alarmManager.canScheduleExactAlarms();
        if (!hasPermission) {
            showNotificationPermissionDialog();
        }
        return hasPermission;
    }

    private void showNotificationPermissionDialog() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("Allow Alarms & Reminders");
        builder.setMessage("Allow GoHappyClub to remind you of ongoing events?");
        builder.setPositiveButton("Allow", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                Intent intent = new Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM);
                startActivity(intent);
            }
        });
        builder.create().show();
    }
}
