import React, {useEffect, useState} from 'react';
import {View, Button, Text, TouchableOpacity} from 'react-native';
import {
  deepLinkToSubscriptionsIos,
  getAvailablePurchases,
  purchaseUpdatedListener,
  useIAP,
} from 'react-native-iap';

const subscriptionIds = [
  '6705fcbe0e5c133a8c915bbb',
  '6705fcbf0e5c133a8c915bbd',
  '6708a88e121a3d21c8a25c5b',
  '6708a88e121a3d21c8a25c5d',
]; // Replace with your subscription IDs

const InAppPurchaseContainer = () => {
  const [requestInProgress, setRequestInProgress] = useState(false);
  const {
    connected,
    products,
    subscriptions,
    getSubscriptions,
    currentPurchase,
    purchaseHistory,
    finishTransaction,
    requestSubscription,
  } = useIAP();

  useEffect(() => {
    // Fetch the available subscriptions when the component is mounted
    if (connected) {
      if (requestInProgress) return;
      setRequestInProgress(true);
      getSubscriptions({skus: subscriptionIds})
        .then(() => setRequestInProgress(false))
        .catch(() => setRequestInProgress(false));
    }
  }, [connected, getSubscriptions]);

  //   useEffect(() => {
  //     const purchaseListener = purchaseUpdatedListener((purchase: any) => {
  //       console.log(purchase, 'listener is called');
  //     });

  //     return () => {
  //       purchaseListener.remove();
  //     };
  //   }, []);

  // Handle purchase updates
  //   useEffect(() => {
  //     console.log(currentPurchase, 'purchases in useeffect');
  //     if (currentPurchase) {
  //       const receipt = currentPurchase.transactionReceipt;
  //       if (receipt) {
  //         // Validate the receipt with your server
  //         // Finish the transaction after receipt validation
  //         if (requestInProgress) return;
  //         setRequestInProgress(true);
  //         finishTransaction({purchase: currentPurchase, isConsumable: false})
  //           .then(() => setRequestInProgress(false))
  //           .catch(() => setRequestInProgress(false));
  //       }
  //     }
  //   }, [currentPurchase, finishTransaction]);

  //   useEffect(() => {
  //     console.log(purchaseHistory, 'checking purchase history');
  //   }, [purchaseHistory]);

  const fetchSubscriptions = async () => {
    try {
      const purchases = await getAvailablePurchases();
      const validSubscriptions = purchases.filter(purchase =>
        purchase.productId.includes('6705fcbe0e5c133a8c915bbb'),
      );

      console.log(validSubscriptions, 'checking valid subscriptions');
    } catch (err) {
      console.error('Error fetching subscriptions', err);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  return (
    <View style={{marginTop: 20}}>
      {subscriptions.map(subscription => {
        return (
          <TouchableOpacity
            onPress={() => {
              if (connected) {
                console.log(requestInProgress, 'resquest checking');
                if (requestInProgress) return;
                setRequestInProgress(true);
                requestSubscription({sku: subscription.productId})
                  .then(res => {
                    if (res?.transactionReceipt) {
                      deepLinkToSubscriptionsIos();
                    }
                    setRequestInProgress(false);
                  })
                  .catch(err => setRequestInProgress(false));
              }
            }}
            style={{
              width: '90%',
              alignSelf: 'center',
              backgroundColor: 'lightblue',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
              borderWidth: 1,
              marginVertical: 10,
              padding: 20,
            }}
            key={subscription.productId}>
            <View style={{width: '100%'}}>
              <Text
                style={[{marginBottom: 10, fontSize: 14, fontWeight: '700'}]}>
                {subscription.title + ` (${subscription.productId})`}
              </Text>
              <Text style={[{marginVertical: 10}]}>
                {'Duration ' +
                  `${subscription.subscriptionPeriodNumberIOS} ` +
                  `${subscription.subscriptionPeriodUnitIOS}`}
              </Text>
              <Text>
                {'Price in ' + `${subscription.currency} ${subscription.price}`}
              </Text>
              <View
                style={[
                  {
                    width: '100%',
                    alignItems: 'center',
                    marginTop: 20,
                  },
                ]}>
                <Text>{subscription.description}</Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default InAppPurchaseContainer;
