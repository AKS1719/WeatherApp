import {
  ActivityIndicator,
  Button,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';

import {debounce} from 'lodash';

// navigation
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';

// mentioning native stack screen props home so that it knows it for home
type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

import {
  CalendarDaysIcon,
  MagnifyingGlassIcon,
} from 'react-native-heroicons/outline';
import {MapPinIcon} from 'react-native-heroicons/solid';
import {fetchWeatherForecast, fetchWeatherLocation} from '../api/weather';

const Home = ({navigation}: HomeProps) => {
  const [showSearch, setShowSearch] = useState(false);
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(false)

  const handleLocation = (loc: object) => {
    setLoading(true)
    console.log(loc.name);
    setLocations([]);
    setShowSearch(false);
    fetchWeatherForecast({
      cityName: loc.name,
      days: 7,
    }).then(data => {
      setWeather(data);
      // console.log('got forecast', data)
    });
    setLoading(false)
  };

  const handleSearch = (value: string) => {
    if (value.length >= 2) {
      fetchWeatherLocation({cityName: value}).then(data => {
        setLocations(data);
      });
    }
  };
  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);

  const {current, location} = weather;

  const giveDay = (date:string)=>{
    let day = new Date(date)
    console.log(date)
    let days = ["Sunday", "Monday", "Tuesday","Wednesday","Thursday","Friday", "Saturday"]
    return days[day.getDay()]
  }

  const fetchMyData = async()=>{
    setLoading(true)
    fetchWeatherForecast({
      cityName:"Ranchi",
      days:7
    }).then(data=>{
      setWeather(data)
    })
    setLoading(false)
  }

  useEffect(()=>{
    fetchMyData()
  },[])

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'light-content'} />
      <Image
        style={styles.bgImage}
        blurRadius={30}
        source={require('../assets/img/bg.jpg')}
      />
      {
        loading ? (
          <ActivityIndicator/>
        ):
        (
          
      <SafeAreaView style={styles.searchContainer}>
      {/* search section */}
      <View style={styles.searchBar}>
        <View
          style={[
            styles.searchBarInput,
            {
              backgroundColor: showSearch
                ? 'rgba(255,255,255,0.2)'
                : 'transparent',
            },
          ]}>
          {showSearch && (
            <TextInput
              onChangeText={handleTextDebounce}
              placeholder="Search place"
              placeholderTextColor="black"
              style={styles.textInput}
            />
          )}
          <TouchableOpacity
            onPress={() => setShowSearch(!showSearch)}
            style={styles.searchButton}>
            <MagnifyingGlassIcon size="25" color="white" />
          </TouchableOpacity>
        </View>
        {locations.length > 0 && showSearch ? (
          <View style={styles.locationContainer}>
            {locations.map((loc, index) => {
              const showBorder = index + 1 !== locations.length;
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.locationItem,
                    {borderBottomWidth: showBorder ? 1 : 0},
                  ]}
                  onPress={() => handleLocation(loc)}>
                  <MapPinIcon size={24} color={'gray'} />
                  <Text style={styles.locationText}>
                    {loc.name}, {loc?.country}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : null}
      </View>
      <View style={styles.weatherSection}>
        <Text style={styles.cityText}>
          {location?.name}
          <Text style={styles.countryText}>&nbsp;{location?.country}</Text>
        </Text>
        <View style={styles.weatherImageContainer}>
          <Image
            source={{uri: 'https:' + current?.condition?.icon}}
            // source={require('../assets/img/partlycloudy.png')}
            style={styles.weatherImage}
          />
        </View>
        <View style={styles.tempContainer}>
          <Text style={styles.tempText}>{current?.temp_c}&#176;</Text>
          <Text style={styles.weatherConditionText}>
            {current?.condition?.text}
          </Text>
        </View>
        {/* other stats */}
        <View style={styles.statsContainer}>
          <WeatherStat
            icon={require('../assets/img/wind.png')}
            value={current?.wind_kph + ' km'}
          />
          <WeatherStat
            icon={require('../assets/img/drop.png')}
            value={current?.humidity + '%'}
          />
          <WeatherStat
            icon={require('../assets/img/sun.png')}
            value="6:05 AM"
          />
        </View>
      </View>

      {/* forecast  */}
      <View style={styles.forecastContainer}>
        <View style={styles.forecastRow}>
          <CalendarDaysIcon size={22} color={'white'} />
          <Text
            style={{
              color: 'white',
              fontSize: 16,
            }}>
            Daily forecast
          </Text>
        </View>
        <ScrollView
          horizontal
          contentContainerStyle={{paddingHorizontal: 15}}
          showsHorizontalScrollIndicator={false}>
          {weather?.forecast?.forecastday?.map((item, index) => (
            <View
            key={index}
              style={{
                display: 'flex', // Equivalent to flex
                justifyContent: 'center', // Equivalent to justify-center
                alignItems: 'center', // Equivalent to items-center
                width: 96, // Equivalent to w-24 (24 * 4px)
                borderRadius: 20, // Equivalent to rounded-3xl
                paddingVertical: 8, // Equivalent to py-2 (2 * 4px)
                marginRight: 16,
                backgroundColor: 'rgba(255,255,255,0.3)',
                marginVertical: 5,
              }}>
              <Image
                source={{uri:"http:"+item?.day?.condition?.icon}}
                // source={require('../assets/img/heavyrain.png')}
                style={{
                  height: 40,
                  width: 40,
                }}
              />
              <Text
                style={{
                  color: 'white',
                }}>
                {giveDay(String(item?.date))}
              </Text>
              <Text
                style={{
                  color: 'white',
                  fontSize: 25,
                }}>
                {item?.day?.avgtemp_c}&#176;
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
        )
      }
    </View>
  );
};

const WeatherStat = ({icon, value}: {icon: any; value: string}) => {
  return (
    <View style={styles.weatherStat}>
      <Image source={icon} style={styles.statIcon} />
      <Text style={styles.statText}>{value}</Text>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    height: '100%',
  },
  bgImage: {
    height: '100%',
    width: '100%',
    position: 'absolute',
  },
  searchContainer: {
    flex: 1,
  },
  searchBar: {
    height: 60,
    margin: 10,
    position: 'relative',
    zIndex: 50,
  },
  searchBarInput: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderRadius: 100,
  },
  textInput: {
    paddingLeft: 4,
    marginLeft: 20,
    width: '80%',
    color: 'black', // Added to make text visible
  },
  searchButton: {
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 15,
  },
  locationContainer: {
    position: 'absolute',
    top: 65,
    width: '100%',
    backgroundColor: '#dfdfdf',
    borderRadius: 20,
  },
  locationItem: {
    flexDirection: 'row',
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 5,
    marginBottom: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  locationText: {
    fontSize: 16,
    marginLeft: 10,
  },
  weatherSection: {
    marginHorizontal: 4,
    flex: 1,
    justifyContent: 'space-around',
    marginBottom: 2,
  },
  cityText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
  },
  countryText: {
    fontWeight: '400',
    color: '#dfdfdf',
  },
  weatherImageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    // backgroundColor:"red"
  },
  weatherImage: {
    width: 100,
    height: 100,
  },
  tempContainer: {
    marginBottom: 8,
  },
  tempText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
    fontSize: 48,
    marginLeft: 20,
  },
  weatherConditionText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 20,
    letterSpacing: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
  },
  weatherStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  statIcon: {
    height: 20,
    width: 20,
  },
  statText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  forecastContainer: {
    marginBottom: 2,
    marginVertical: 3,
  },
  forecastRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
  },
});
