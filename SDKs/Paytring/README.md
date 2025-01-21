# Paytring React Native SDK

Paytring react native sdk provides simple to use API for integrating paytring platform with any of the platform that
accepts payments using the Paytring SDK.

### Methods Available

1. **createOrder** : Method is used for generating order using the key and secret of production of the paytring
   platform.
   Data must be provided to the SDK in order to generate an order.
2. **generateHash** : Method is used for generating hash of the payload that is getting sent further to the create order
   method for order creation.

### Types Available

1. **OrderInterface** : Data that needs to be passed to the create order method must be created in this type format.

### Usage

- Import the following from SDK

```typescript
import type { OrderInterface } from 'react-native-paytring';
import Paytring, { createOrder, generateHash } from 'react-native-paytring';
```

1. First we need to take all the required inputs from the user of the application according to the **OrderInterface**
   provided in the SDK

```typescript
  const secret = useRef('{{Your Secret}}');

// Use the OrderInterface as the type of the state to get type hinting for the order fields
const [data, setData] = useState<OrderInterface>({
  amount: '100', // Amount in paisa
  receipt_id: `${Math.floor(Math.random() * 90000) + 10000}`, // Unique random id
  cname: 'shubham',
  phone: '123456789',
  email: 'someuser@example.com',
  key: '{{Your Key}}',
  callback_url: 'https://httpbin.org/post',
  hash: '', // Generated hash
});
```

2. Generate hash of the payload created above and then set it to the `hash` field in the payload json.

```typescript
  useEffect(() => {
  setData({
    ...data,
    hash: generateHash(data, secret.current) as string,
    // This hash needs to be regenerated if any of the data is changed otherwise hash will fail verification.
  });
}, []);
```

3. Generate an order using the payload with the hash (included in the payload itself)

```typescript
  const response = await createOrder(data);
```

4. Add the Paytring component in the app that will later trigger the payment checkout in the app

```typescript jsx
  <Paytring
  init={(args) => { // Init prop returns an object with a single method named `open` which we will later use to open the checkout UI using the order_id
    setPaytring(args); // Save this returned object in state we will need it later
  }}
  failure={() => console.log('Failure')} // This callback fires if and when a payment is failed
  success={() => console.log('Success')} // This callback fires if and when a payment is sucessful
/>;
```

5. Now trigger the payment using the open method returned and stored in the state earlier

```typescript
  const response = await createOrder(data);
paytring.open(response?.order_id); // This will open up the checkout UI in the app for payment
```

> **Note :** If the user press the back button on the phone while the checkout UI is open then the Check UI will simply
> close without any event or notification.
6. Once the payment is done successfully and failure then the respective callbacks are triggered in order to inform the app if the payment was successful or failed.
