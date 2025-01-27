import {
  BackHandler,
  Dimensions,
  NativeModules,
  Platform,
  View,
} from 'react-native';
import type { OrderInterface } from './interfaces/Order.interface';
import RestService from './services/rest.service';
import React, { useEffect, useState } from 'react';
import type { WebViewMessageEvent } from 'react-native-webview';
import * as Web from 'react-native-webview';

const LINKING_ERROR =
  `The package 'react-native-paytring' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Pay = NativeModules.Paytring
  ? NativeModules.Paytring
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export async function createOrder(
  data: OrderInterface
): Promise<
  Partial<{ order_id: string; status: string; url: string }> | undefined
> {
  const rest = new RestService();
  return await rest.createOrder(data);
}

export default function Paytring({
  success,
  failure,
  init,
}: {
  success: () => void;
  failure: () => void;
  init: (args: { open: (value: string) => void }) => void;
}) {
  const webview = React.useRef<any>();
  const deviceHeight = Dimensions.get('window').height;
  const deviceWidth = Dimensions.get('window').width;
  const [OrderId, setOrderId] = useState('');
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    init({ open: setOrderId });
  }, []);

  const messageHandler = (event: WebViewMessageEvent) => {
    console.log(event);
    console.log(event.nativeEvent);
    const message = event.nativeEvent.data;
    console.log(message);
    if (message === 'payment.success') {
      success?.();
      setOrderId('');
    } else if (message === 'payment.failed') {
      failure?.();
      setOrderId('');
    } else if (message === 'payment.close') {
      failure?.();
      setOrderId('');
    } else {
      failure?.();
      setOrderId('');
    }
  };

  BackHandler.addEventListener('hardwareBackPress', () => {
    if (webview.current) {
      try {
        if (canGoBack) {
          webview.current.goBack();
        }
        failure?.();
        setOrderId('');
        return true;
      } catch (e) {
        setOrderId('');
      }
      return true;
    }
    return false;
  });

  return OrderId ? (
    <View style={{ position: 'absolute', top: 0, left: 0, zIndex: 9999 }}>
      <Web.WebView
        ref={webview}
        scalesPageToFit={true}
        source={{
          html: `<!DOCTYPE html><html><head><title>Mobile View</title></head><body><script>document.write('<meta name="viewport" content="width=device-width, initial-scale=1">');</script><style>body { margin: 0; } iframe { width: 100vw; height: 100vh; border: none; }</style><iframe src='${`https://api.paytring.com/pay/token/${OrderId}`}' style='min-width: 100vw; min-height: 100vh; border: 0;'></iframe></body></html>`,
        }}
        javaScriptEnabled={true}
        onMessage={messageHandler}
        onLoadProgress={(navState) => {
          // Keep track of going back navigation within component
          // @ts-ignore
          if (webview.current && !navState.nativeEvent.canGoBack) {
            setCanGoBack(false);
          } else {
            setCanGoBack(true);
          }
        }}
        userAgent={
          'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'
        }
        injectedJavaScript={`
          window.addEventListener('message', (e) => {
            console.log(e.data);
            if (e.data.eventname === 'Transaction_Status') {
                window.ReactNativeWebView.postMessage("payment." + e.data.data);
            }
          });
        `}
        style={{
          width: deviceWidth,
          height: deviceHeight,
          zIndex: 999999,
        }}
      />
    </View>
  ) : null;
}

export * from './interfaces/Order.interface';
export * from './helpers/hash.helper';
