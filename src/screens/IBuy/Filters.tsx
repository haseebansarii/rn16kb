import i18next from 'i18next';
import React from 'react';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import {TextSemiBold} from '../../components';
import {useTheme} from '../../hooks';
import {FixedPriceOfferFilters, AutomotiveFilters} from '../../utils/dummyData';
import {useSelector} from 'react-redux';

type Props = {
  selected: number;
  setSelected: CallableFunction;
  setShowBottomSheet: CallableFunction;
  isAutomotiveCategory?: boolean;
  selectedMake?: string;
  selectedModel?: string;
  selectedYearFrom?: string;
  selectedYearTo?: string;
  selectedPriceFrom?: string;
  selectedPriceTo?: string;
  selectedBodyStyles?: string[];
  selectedFuelTypes?: string[];
  selectedOdometerFrom?: string;
  selectedOdometerTo?: string;
  selectedTransmission?: string;
  selectedDoors?: string;
  selectedSeats?: string;
  selectedLocation?: string;
  filterSearch?: number;
  itemTypeData?: Array<{id: number; title: string}>;
};

const Filters = ({
  selected,
  setShowBottomSheet,
  setSelected,
  isAutomotiveCategory = false,
  selectedMake,
  selectedModel,
  selectedYearFrom,
  selectedYearTo,
  selectedPriceFrom,
  selectedPriceTo,
  selectedBodyStyles,
  selectedFuelTypes,
  selectedOdometerFrom,
  selectedOdometerTo,
  selectedTransmission,
  selectedDoors,
  selectedSeats,
  selectedLocation,
  filterSearch,
  itemTypeData,
}: Props) => {
  const {Colors, Fonts, Gutters, Images, Layout} = useTheme();

  const listFilters = useSelector((state: any) => state?.list?.listFilters);
  const showFilter = key => {
    let v = listFilters?.some(item => item.key === key);
    return v;
  };

  // Use automotive filters if it's automotive category, otherwise use regular filters
  const filtersToShow = isAutomotiveCategory
    ? AutomotiveFilters
    : FixedPriceOfferFilters;

  // Function to get display text for automotive filters
  const getFilterDisplayText = (filterKey: string) => {
    switch (filterKey) {
      case 'make':
        return selectedMake || 'Make';
      case 'model':
        return selectedModel || 'Model';
      case 'year':
        if (selectedYearFrom && selectedYearTo) {
          return `${selectedYearFrom}-${selectedYearTo}`;
        } else if (selectedYearFrom) {
          return `From ${selectedYearFrom}`;
        } else if (selectedYearTo) {
          return `To ${selectedYearTo}`;
        }
        return 'Year';
      case 'price':
        if (selectedPriceFrom && selectedPriceTo) {
          const fromDisplay =
            selectedPriceFrom === 'Any'
              ? 'Any'
              : `${
                  Number(selectedPriceFrom) >= 1000
                    ? Number(selectedPriceFrom) / 1000 + 'k'
                    : selectedPriceFrom
                }`;
          const toDisplay =
            selectedPriceTo === 'Any'
              ? 'Any'
              : `${
                  Number(selectedPriceTo) >= 1000
                    ? Number(selectedPriceTo) / 1000 + 'k'
                    : selectedPriceTo
                }`;
          return `${fromDisplay}-${toDisplay}`;
        } else if (selectedPriceFrom) {
          const fromDisplay =
            selectedPriceFrom === 'Any'
              ? 'Any'
              : `${
                  Number(selectedPriceFrom) >= 1000
                    ? Number(selectedPriceFrom) / 1000 + 'k'
                    : selectedPriceFrom
                }`;
          return `From ${fromDisplay}`;
        } else if (selectedPriceTo) {
          const toDisplay =
            selectedPriceTo === 'Any'
              ? 'Any'
              : `${
                  Number(selectedPriceTo) >= 1000
                    ? Number(selectedPriceTo) / 1000 + 'k'
                    : selectedPriceTo
                }`;
          return `To ${toDisplay}`;
        }
        return 'Price';
      case 'body_style':
        if (selectedBodyStyles && selectedBodyStyles.length > 0) {
          return selectedBodyStyles.length === 1
            ? selectedBodyStyles[0]
            : `${selectedBodyStyles.length} styles`;
        }
        return 'Body Style';
      case 'fuel_type':
        if (selectedFuelTypes && selectedFuelTypes.length > 0) {
          return selectedFuelTypes.length === 1
            ? selectedFuelTypes[0]
            : `${selectedFuelTypes.length} types`;
        }
        return 'Fuel Type';
      case 'odometer':
        if (selectedOdometerFrom && selectedOdometerTo) {
          const fromDisplay =
            Number(selectedOdometerFrom).toLocaleString() + ' km';
          const toDisplay = Number(selectedOdometerTo).toLocaleString() + ' km';
          return `${fromDisplay}-${toDisplay}`;
        } else if (selectedOdometerFrom) {
          const fromDisplay =
            Number(selectedOdometerFrom).toLocaleString() + ' km';
          return `From ${fromDisplay}`;
        } else if (selectedOdometerTo) {
          const toDisplay = Number(selectedOdometerTo).toLocaleString() + ' km';
          return `To ${toDisplay}`;
        }
        return 'Odometer';
      case 'transmission':
        return selectedTransmission || 'Transmission';
      case 'number_of_doors':
        return selectedDoors && selectedDoors !== 'Any'
          ? `${selectedDoors} ${selectedDoors === '1' ? 'door' : 'doors'}`
          : 'Number of Doors';
      case 'number_of_seats':
        return selectedSeats && selectedSeats !== 'Any'
          ? `${selectedSeats} ${selectedSeats === '1' ? 'seat' : 'seats'}`
          : 'Number of Seats';
      case 'location':
        return selectedLocation || 'Location';
      case 'filter_search':
        if (filterSearch !== undefined && itemTypeData) {
          const selectedOption = itemTypeData.find(
            item => item.id === filterSearch,
          );
          return selectedOption && selectedOption.title !== 'All'
            ? selectedOption.title
            : 'Buy Type';
        }
        return 'Buy Type';
      default:
        return '';
    }
  };

  return (
    <View style={[Gutters.xTinyVMargin, {marginRight: '3%', marginLeft: '3%'}]}>
      <View
        style={[
          i18next.language !== 'en' ? Layout.row : Layout.rowReverse,
          Layout.alignItemsCenter,
          Layout.justifyContentBetween,
          Layout.fullWidth,
        ]}>
        <ScrollView showsHorizontalScrollIndicator={false} horizontal>
          {filtersToShow?.map((item, index) => {
            const {title, key} = item;
            // console.log(
            //   '>>>showFilter(item?.key) ',
            //   item,
            //   showFilter(item?.key),
            // );

            if (showFilter(item?.key)) {
              // Get display text for filters; fall back to title when not applicable
              const displayText = getFilterDisplayText(key) || title;

              return (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    setSelected(item?.key), setShowBottomSheet(true);
                  }}
                  key={index}
                  style={[
                    Layout.center,
                    index !== 0 && Gutters.tinyLMargin,
                    Gutters.xxtinyHPadding,
                    {
                      borderRadius: 4,
                      paddingVertical: 4,
                      borderWidth: 1,
                      borderColor: Colors.green_06975E,
                      backgroundColor:
                        selected === index
                          ? Colors.green_06975E
                          : Colors.lightGreen_DBF5EC,
                    },
                  ]}>
                  <TextSemiBold
                    text={displayText}
                    textStyle={[
                      Fonts.poppinSemiBold16,
                      {
                        color:
                          selected === index
                            ? Colors.white
                            : Colors.green_06975E,
                      },
                    ]}
                  />
                </TouchableOpacity>
              );
            } else {
              null;
            }
          })}
        </ScrollView>
      </View>
    </View>
  );
};

export default Filters;
