
package com.facebook.react;

import android.app.Application;
import android.content.Context;
import android.content.res.Resources;

import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainPackageConfig;
import com.facebook.react.shell.MainReactPackage;
import java.util.Arrays;
import java.util.ArrayList;

// @react-native-async-storage/async-storage
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
// @react-native-community/art
import com.reactnativecommunity.art.ARTPackage;
// @react-native-community/clipboard
import com.reactnativecommunity.clipboard.ClipboardPackage;
// @react-native-firebase/app
import io.invertase.firebase.app.ReactNativeFirebaseAppPackage;
// @react-native-firebase/auth
import io.invertase.firebase.auth.ReactNativeFirebaseAuthPackage;
// @react-native-google-signin/google-signin
import co.apptailor.googlesignin.RNGoogleSigninPackage;
// react-native-contacts
import com.rt2zz.reactnativecontacts.ReactNativeContacts;
// react-native-date-picker
import com.henninghall.date_picker.DatePickerPackage;
// react-native-gesture-handler
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
// react-native-linear-gradient
import com.BV.LinearGradient.LinearGradientPackage;
// react-native-lottie-splash-screen
import org.devio.rn.splashscreen.SplashScreenReactPackage;
// react-native-razorpay
import com.razorpay.rn.RazorpayPackage;
// react-native-safe-area-context
import com.th3rdwave.safeareacontext.SafeAreaContextPackage;
// react-native-screens
import com.swmansion.rnscreens.RNScreensPackage;
// react-native-share
import cl.json.RNSharePackage;
// react-native-svg
import com.horcrux.svg.SvgPackage;
// react-native-vector-icons
import com.oblador.vectoricons.VectorIconsPackage;
// react-native-video
import com.brentvatne.react.ReactVideoPackage;
// react-native-webview
import com.reactnativecommunity.webview.RNCWebViewPackage;

public class PackageList {
  private Application application;
  private ReactNativeHost reactNativeHost;
  private MainPackageConfig mConfig;

  public PackageList(ReactNativeHost reactNativeHost) {
    this(reactNativeHost, null);
  }

  public PackageList(Application application) {
    this(application, null);
  }

  public PackageList(ReactNativeHost reactNativeHost, MainPackageConfig config) {
    this.reactNativeHost = reactNativeHost;
    mConfig = config;
  }

  public PackageList(Application application, MainPackageConfig config) {
    this.reactNativeHost = null;
    this.application = application;
    mConfig = config;
  }

  private ReactNativeHost getReactNativeHost() {
    return this.reactNativeHost;
  }

  private Resources getResources() {
    return this.getApplication().getResources();
  }

  private Application getApplication() {
    if (this.reactNativeHost == null) return this.application;
    return this.reactNativeHost.getApplication();
  }

  private Context getApplicationContext() {
    return this.getApplication().getApplicationContext();
  }

  public ArrayList<ReactPackage> getPackages() {
    return new ArrayList<>(Arrays.<ReactPackage>asList(
      new MainReactPackage(mConfig),
      new AsyncStoragePackage(),
      new ARTPackage(),
      new ClipboardPackage(),
      new ReactNativeFirebaseAppPackage(),
      new ReactNativeFirebaseAuthPackage(),
      new RNGoogleSigninPackage(),
      new ReactNativeContacts(),
      new DatePickerPackage(),
      new RNGestureHandlerPackage(),
      new LinearGradientPackage(),
      new SplashScreenReactPackage(),
      new RazorpayPackage(),
      new SafeAreaContextPackage(),
      new RNScreensPackage(),
      new RNSharePackage(),
      new SvgPackage(),
      new VectorIconsPackage(),
      new ReactVideoPackage(),
      new RNCWebViewPackage()
    ));
  }
}
