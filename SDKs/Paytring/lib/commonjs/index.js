"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  createOrder: true
};
exports.createOrder = createOrder;
exports.default = Paytring;
var _reactNative = require("react-native");
var _rest = _interopRequireDefault(require("./services/rest.service"));
var _react = _interopRequireWildcard(require("react"));
var Web = _interopRequireWildcard(require("react-native-webview"));
var _Order = require("./interfaces/Order.interface");
Object.keys(_Order).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _Order[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _Order[key];
    }
  });
});
var _hash = require("./helpers/hash.helper");
Object.keys(_hash).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _hash[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _hash[key];
    }
  });
});
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const LINKING_ERROR = `The package 'react-native-paytring' doesn't seem to be linked. Make sure: \n\n` + _reactNative.Platform.select({
  ios: "- You have run 'pod install'\n",
  default: ''
}) + '- You rebuilt the app after installing the package\n' + '- You are not using Expo Go\n';

// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Pay = _reactNative.NativeModules.Paytring ? _reactNative.NativeModules.Paytring : new Proxy({}, {
  get() {
    throw new Error(LINKING_ERROR);
  }
});
async function createOrder(data) {
  const rest = new _rest.default();
  return await rest.createOrder(data);
}
function Paytring(_ref) {
  let {
    success,
    failure,
    init
  } = _ref;
  const webview = _react.default.useRef();
  const deviceHeight = _reactNative.Dimensions.get('window').height;
  const deviceWidth = _reactNative.Dimensions.get('window').width;
  const [OrderId, setOrderId] = (0, _react.useState)('');
  const [canGoBack, setCanGoBack] = (0, _react.useState)(false);
  (0, _react.useEffect)(() => {
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
  _reactNative.BackHandler.addEventListener('hardwareBackPress', () => {
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
  return OrderId ? /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 9999
    }
  }, /*#__PURE__*/_react.default.createElement(Web.WebView, {
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
//# sourceMappingURL=index.js.map