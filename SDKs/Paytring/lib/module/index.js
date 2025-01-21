import { BackHandler, Dimensions, NativeModules, Platform, View } from 'react-native';
import RestService from './services/rest.service';
import React, { useEffect, useState } from 'react';
import * as Web from 'react-native-webview';
const LINKING_ERROR = `The package 'react-native-paytring' doesn't seem to be linked. Make sure: \n\n` + Platform.select({
  ios: "- You have run 'pod install'\n",
  default: ''
}) + '- You rebuilt the app after installing the package\n' + '- You are not using Expo Go\n';

// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Pay = NativeModules.Paytring ? NativeModules.Paytring : new Proxy({}, {
  get() {
    throw new Error(LINKING_ERROR);
  }
});
export async function createOrder(data) {
  const rest = new RestService();
  return await rest.createOrder(data);
}
export default function Paytring(_ref) {
  let {
    success,
    failure,
    init
  } = _ref;
  const webview = React.useRef();
  const deviceHeight = Dimensions.get('window').height;
  const deviceWidth = Dimensions.get('window').width;
  const [OrderId, setOrderId] = useState('');
  const [canGoBack, setCanGoBack] = useState(false);
  useEffect(() => {
    init({
      open: setOrderId
    });
  }, []);
  const messageHandler = event => {
    const message = event.nativeEvent.data;
    if (message === 'payment.success') {
      success === null || success === void 0 ? void 0 : success();
      setOrderId('');
    } else if (message === 'payment.failed') {
      failure === null || failure === void 0 ? void 0 : failure();
      setOrderId('');
    } else if (message === 'payment.close') {
      setOrderId('');
    }
  };
  BackHandler.addEventListener('hardwareBackPress', () => {
    if (webview.current) {
      try {
        if (canGoBack) {
          webview.current.goBack();
        } else {
          setOrderId('');
        }
      } catch (e) {
        setOrderId('');
      }
      return true; // Prevent the default back button behavior
    }

    return false;
  });
  return OrderId ? /*#__PURE__*/React.createElement(View, {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 9999
    }
  }, /*#__PURE__*/React.createElement(Web.WebView, {
    ref: webview,
    scalesPageToFit: true,
    source: {
      html: `<!DOCTYPE html><html><head><title>Mobile View</title></head><body><script>document.write('<meta name="viewport" content="width=device-width, initial-scale=1">');</script><style>body { margin: 0; } iframe { width: 100vw; height: 100vh; border: none; }</style><iframe src='${`https://api.paytring.com/pay/token/${OrderId}`}' style='min-width: 100vw; min-height: 100vh; border: 0;'></iframe></body></html>`
    },
    javaScriptEnabled: true,
    onMessage: messageHandler,
    onLoadProgress: navState => {
      // Keep track of going back navigation within component
      // @ts-ignore
      if (webview.current && !navState.nativeEvent.canGoBack) {
        setCanGoBack(false);
      } else {
        setCanGoBack(true);
      }
    },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
    injectedJavaScript: `
          window.addEventListener('message', (e) => {
            console.log(e.data);
            if (e.data.eventname === 'Transaction_Status' && e.data.data === 'success') {
                window.ReactNativeWebView.postMessage("payment.success");
            }
            if (e.data.eventname === 'Transaction_Status' && e.data.data === 'failed') {
                window.ReactNativeWebView.postMessage("payment.failed");
            }
          });
        `,
    style: {
      width: deviceWidth,
      height: deviceHeight,
      zIndex: 999999
    }
  })) : null;
}
export * from './interfaces/Order.interface';
export * from './helpers/hash.helper';
//# sourceMappingURL=index.js.map