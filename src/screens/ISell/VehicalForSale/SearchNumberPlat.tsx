import {Formik} from 'formik';
import i18next from 'i18next';
import React, {useCallback, useState} from 'react';
import {TextInput, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  CustomButton,
  CustomLoading,
  TextRegular,
  TextSemiBold,
} from '../../../components';
import {useTheme} from '../../../hooks';
import {setCarJam} from '../../../store/Forms/Forms';
import {VehicalForSale} from '../../../utils/Interface';
import {sHight} from '../../../utils/ScreenDimentions';
import {VehicalForSaleSchema} from '../../../utils/Validation';
import {
  setVehicalData,
  setVehicalDataEpmty,
} from '../../../store/Forms/vehicalForms';
import {RootState} from '../../../store/store';
import {getCarDetailsFromVin} from '../../../services/carJam/carJamApis';
import {toastDangerMessage} from '../../../utils/helpers';

type Props = {};

const SearchNumberPlat = (props: Props) => {
  const {Colors, Images, Fonts, Gutters, Layout} = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const token = useSelector((state: RootState) => state?.auth?.token);
  const vehicalData = useSelector(
    (state): RootState => state.vehicalForms?.vehicalData,
  );

  const dispatch = useDispatch();

  const searchNumberPlat = async v => {
    dispatch(setVehicalDataEpmty({}));
    setIsLoading(true);
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${token}`);
    myHeaders.append('Cookie', 'cjst=3c3nafilfimhd8rav4se7qbgcl');

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };
    // &basic=1&translate=1
    // await fetch(
    //   `${CARJAM_API_URL}api/car/?key=${CARJAM_API_KEY}&f=json&plate=${v?.numberPlat}&basic=1&translate=1`,
    //   requestOptions,
    // )
    getCarDetailsFromVin(v?.numberPlat)
      .then(r => r.data)
      .then(r => {
        if (r?.code == -1) {
          setIsLoading(false);
          toastDangerMessage(r?.message || 'Something went wrong!');
        } else {
          const {vehicle} = r?.hidh;
          let data = {
            make: vehicle?.make,
            model: vehicle?.model,
            model_detail: '',
            import_history: '',
            body: vehicle?.body_style,
            seats: vehicle?.no_of_seats,
            doors: '',
            previosu_owner: '',
            year: vehicle?.year_of_manufacture,
            kilometers: '',
            color: vehicle?.main_colour,
            numberPlat_or_vin:
              vehicle?.vin != '' ? vehicle?.vin : vehicle?.plate,
            images: [{name: '', uri: '', type: ''}],
            title: '',
            category: '',
            subCatagory: '',
            condition: '',
            describe_vehical: '',
            engine_size: vehicle?.cc_rating,
            transmission: 'auto',
            fuel_type: vehicle?.fuel_type,
            cylinders: '',
            // drive_type: '',
            registration_expiry: '',
            wof_expiry: '',
            asking_price: '',
            reserve_price: '',
            start_price: '',
            buy_now_price: '',
            checkbox: '',
            pickup_available: '',
            location: {
              lat: '',
              lng: '',
            },
            paymentOption: '',
            startDate: '',
            endDate: '',
            closingTime: '',
            show_number: '',
          };

          let vehicalDataTemp = {
            // title: '',
            // category: '',
            // sub_category: '',
            make: vehicle?.make,
            model: vehicle?.model,
            // type: 'fixed_price',
            // images: [],
            // condition: '',
            // start_price: null,
            // reserve_price: null,
            // buy_now_price: null,
            // description: '',
            // pickup_available: false,
            // pickup_location: '',
            // pickup_location_coordinates: {
            //   lat: null,
            //   lng: null,
            // },
            // payment_option: 'other',
            // start_date: null,
            // end_date: null,
            // end_time: null,
            // show_phone: false,
            listing_type: 'vehicle',
            year: parseInt(vehicle?.year_of_manufacture || 0),
            model_detail: vehicle?.submodel,
            // import_history: null,
            body: vehicle?.body_style,
            no_of_seats: vehicle?.no_of_seats,
            // no_of_doors: null,
            // previous_owners: null,
            kilometers: parseInt(vehicle?.latest_odometer_reading || 0),
            color: vehicle?.main_colour,
            vin: vehicle?.vin,
            engine_size: vehicle?.cc_rating,
            // transmission: null,
            fuel_type: vehicle?.fuel_type,
            // cylinders: null,
            // drive_type: 'right-hand',
            // registration_expiry: '',
            reported_stolen:
              vehicle?.reported_stolen?.toLowerCase() == 'Yes'?.toLowerCase()
                ? true
                : false,
            wof_expiry: vehicle?.expiry_date_of_last_successful_wof,
            imported_damaged:
              vehicle?.imported_damaged?.toLowerCase() === 'Yes'.toLowerCase()
                ? true
                : false,
            // fixed_price_offer: null,
            // on_road_cost_included: false,
            // make_an_offer: false,
            // shipping: '',
          };
          dispatch(setCarJam(data));
          dispatch(setVehicalData({...vehicalData, ...vehicalDataTemp}));
          setIsLoading(false);
        }
      })
      .catch(error => {
        setIsLoading(false);
        toastDangerMessage(error?.message || 'Something went wrong!');
        console.error('get carJam Api error=======', JSON.stringify(error));
      });
  };

  return (
    <View style={[Gutters.littleTMargin]}>
      <TextSemiBold
        text={t('common:find_your_vehicle_details')}
        textStyle={[Fonts.poppinSemiBold20, {color: Colors.black_232C28}]}
      />
      <Formik
        enableReinitialize
        initialValues={VehicalForSale}
        validationSchema={VehicalForSaleSchema}
        onSubmit={(v, {resetForm}) => {
          searchNumberPlat(v);
        }}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          touched,
          errors,
        }) => {
          const {numberPlat} = values;
          return (
            <>
              <View
                style={[
                  i18next.language === 'en' ? Layout.row : Layout.rowReverse,
                  Layout.alignItemsCenter,
                  Layout.justifyContentBetween,
                  Gutters.littlePadding,
                  Layout.overflow,
                  {borderWidth: 1, borderRadius: 6},
                ]}>
                <TextInput
                  placeholder={t('common:enter_your_number_plate_or_vin')}
                  placeholderTextColor={Colors.dark_gray_676C6A}
                  onChangeText={handleChange('numberPlat')}
                  onBlur={handleBlur('numberPlat')}
                  value={numberPlat}
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect={false}
                  autoFocus={false}
                  style={[
                    Fonts.poppinMed15,

                    {
                      width: '70%',
                      height: '100%',
                      color: Colors.dark_gray_676C6A,
                    },
                  ]}
                />
                <CustomButton
                  onPress={handleSubmit}
                  text={t('common:find')}
                  textStyle={[Fonts.poppinSemiBold20, {color: Colors.white}]}
                  btnStyle={[
                    {
                      backgroundColor: Colors.primary,
                      width: 75,
                      height: 42,
                      borderRadius: 6,
                    },
                  ]}
                />
              </View>
              {touched.numberPlat && errors.numberPlat && (
                <TextRegular
                  text={errors.numberPlat}
                  textStyle={[{color: Colors.red, marginLeft: sHight(1)}]}
                />
              )}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {}}
                style={[Gutters.smallTMargin]}>
                <TextSemiBold
                  text={t('common:or_enter_your_vehicle_detail_manually')}
                  textStyle={[
                    Fonts.poppinSemiBold18,
                    {
                      textDecorationLine: 'underline',
                      textTransform: 'none',
                      color: Colors.green_06975E,
                    },
                  ]}
                />
              </TouchableOpacity>
            </>
          );
        }}
      </Formik>

      <CustomLoading isLoading={isLoading} />
    </View>
  );
};

export default SearchNumberPlat;
