//import android.app.AlarmManager;
//import android.content.Context;
//import android.app.AlertDialog;
//import android.content.DialogInterface;
//import android.content.Intent;
//import android.os.Build;
//import android.os.Bundle;
//import android.provider.Settings;
//import android.content.pm.PackageManager;
//import androidx.core.app.ActivityCompat;
//import android.Manifest;
//import com.facebook.react.ReactActivity;
//
//import android.util.Log;
//import android.widget.Toast;
//
//import com.google.firebase.messaging.FirebaseMessaging;
//import com.google.firebase.messaging.RemoteMessage;
//import com.google.android.gms.tasks.OnCompleteListener;
//import com.google.android.gms.tasks.Task;
//
//import androidx.annotation.NonNull;
//
//public class MainActivity extends ReactActivity {
//
//    private static final String TAG = "MainActivity";
//    private static final int NOTIFICATION_REQUEST_CODE = 1234;
//
//    @Override
//    protected String getMainComponentName() {
//        return "GoHappyClient";
//    }
//
//    @Override
//    protected void onCreate(Bundle savedInstanceState) {
//        super.onCreate(null);
//
//        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
//            checkAlarmsRemindersPermission();
//        }
//
//        FirebaseMessaging.getInstance().getToken()
//                .addOnCompleteListener(new OnCompleteListener<String>() {
//                    @Override
//                    public void onComplete(@NonNull Task<String> task) {
//                        if (!task.isSuccessful()) {
//                            Log.w(TAG, "Fetching FCM registration token failed", task.getException());
//                            return;
//                        }
//                        String token = task.getResult();
//                        String msg = token;
//                        Log.d(TAG, msg);
//                        Toast.makeText(MainActivity.this, msg, Toast.LENGTH_LONG).show();
//                    }
//                });
//
//        FirebaseMessaging.getInstance().subscribeToTopic("notifications")
//                .addOnCompleteListener(new OnCompleteListener<Void>() {
//                    @Override
//                    public void onComplete(@NonNull Task<Void> task) {
//                        if (task.isSuccessful()) {
//                            Log.d(TAG, "Subscribed to topic: notifications");
//                        } else {
//                            Log.w(TAG, "Failed to subscribe to topic: notifications", task.getException());
//                        }
//                    }
//                });
//
//        FirebaseMessaging.getInstance().setAutoInitEnabled(true);
//    }
//
//    private boolean checkAlarmsRemindersPermission() {
//        AlarmManager alarmManager = (AlarmManager) getSystemService(Context.ALARM_SERVICE);
//        boolean hasPermission = alarmManager.canScheduleExactAlarms();
//        if (!hasPermission) {
//            showNotificationPermissionDialog();
//        }
//        return hasPermission;
//    }
//
//    private void showNotificationPermissionDialog() {
//        AlertDialog.Builder builder = new AlertDialog.Builder(this);
//        builder.setTitle("Allow Alarms & Reminders");
//        builder.setMessage("Allow GoHappy Club to remind you of ongoing events?");
//        builder.setPositiveButton("Allow", new DialogInterface.OnClickListener() {
//            @Override
//            public void onClick(DialogInterface dialog, int which) {
//                Intent intent = new Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM);
//                startActivity(intent);
//            }
//        });
//        builder.create().show();
//    }
//}












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

import android.util.Log;
import android.widget.Toast;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.RemoteMessage;
import com.google.android.gms.tasks.OnCompleteListener;

import androidx.annotation.RequiresApi;
import com.google.android.gms.tasks.Task;

import androidx.annotation.NonNull;

public class MainActivity extends ReactActivity {

    private static final String TAG = "MainActivity";
    private static final int NOTIFICATION_REQUEST_CODE = 1234;

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

        FirebaseMessaging.getInstance().getToken()
                .addOnCompleteListener(new OnCompleteListener<String>() {
                    @Override
                    public void onComplete(@NonNull Task<String> task) {
                        if (!task.isSuccessful()) {
                            Log.w(TAG, "Fetching FCM registration token failed", task.getException());
                            return;
                        }
                        String token = task.getResult();
                        String msg = token;
                        Log.d(TAG, msg);
                        //Toast.makeText(MainActivity.this, msg, Toast.LENGTH_LONG).show();
                    }
                });
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
        builder.setMessage("Allow GoHappy Club to remind you of ongoing events?");
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

