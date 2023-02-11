package com.gohappyclient;


import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import com.facebook.react.ReactActivity;
import android.provider.Settings;
public class MainActivity extends ReactActivity {
@Override
protected String getMainComponentName() {
return "GoHappyClient";
}
@Override
protected void onCreate(Bundle savedInstanceState) {
super.onCreate(null);
if (!checkAlarmsRemindersPermission()) { // && checkAlarmsRemindersPermission()

//!checkNotificationPermission() && 
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
showNotificationPermissionDialog();
}
}
}
// private boolean checkNotificationPermission() {
// String notificationAccessEnabled = Settings.Secure.getString(
// getContentResolver(),
// "enabled_notification_listeners"
// );
// return notificationAccessEnabled != null && notificationAccessEnabled.contains(getPackageName());
// }


private boolean checkAlarmsRemindersPermission() {
String alarmRemindersEnabled = Settings.Secure.getString(
getContentResolver(),
"enabled_alarm_reminders"
);
return alarmRemindersEnabled != null && alarmRemindersEnabled.contains(getPackageName());
}

private void showNotificationPermissionDialog() {
AlertDialog.Builder builder = new AlertDialog.Builder(this);
builder.setTitle("Allow Alarms & Reminders");
builder.setMessage("Allow GoHHappyClub to remind you of ongoing events?");
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



