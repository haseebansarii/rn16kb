import React from 'react';
import {
  BiddingComponent,
  BuyingComponent,
  PropertyProductComponent,
  SimpleProductComponent,
  VehicleProductComponent,
} from '.';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store/store';
import OffersComponnet from './Offers/OffersComponnet';

const BottomScreenDetails = () => {
  const buying_type = useSelector(
    (state: RootState) => state.product?.buying_type,
  );
  const selected_product = useSelector(
    (state: RootState) => state.product?.selected_product,
  );

  return (
    <>
      {buying_type == null ? (
        <>
          {selected_product?.listing_type == 'vehicle' ? (
            <VehicleProductComponent />
          ) : selected_product?.listing_type == 'property' ? (
            <PropertyProductComponent />
          ) : (
            <SimpleProductComponent />
          )}
        </>
      ) : buying_type == 'bidding' ? (
        <BiddingComponent />
      ) : buying_type == 'offer' ? (
        <OffersComponnet />
      ) : (
        <BuyingComponent />
      )}
    </>
  );
};

export default BottomScreenDetails;
