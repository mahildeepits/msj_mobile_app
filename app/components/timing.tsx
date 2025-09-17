import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import config from '../config';

export default function Timing() {
  const [modalVisible, setModalVisible] = useState(false);
  const [weekSchedule, setWeekSchedule] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [currentDay, setCurrentDay] = useState();
  const marqueeAnim = useRef(new Animated.Value(0)).current;

  const screenWidth = Dimensions.get('window').width;
  const containerWidth = screenWidth * 0.8;

  // Store measured width of the scrolling text content
  const [textWidth, setTextWidth] = useState(0);

  useEffect(() => {
    const getShopTimings = async () => {
      // console.log('Fetching shop timings...');
      let token = await AsyncStorage.getItem('userToken');
      token = JSON.parse(token || '{}');
      const response = await axios
        .get(`${config.apiBaseUrl}/shop-timings`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        .catch((error) => console.log(error));
      if (response && response.data.status) {
        // console.log(response.data.data);
        setWeekSchedule(response.data.data);
        setSchedule(getSortedSchedule(response.data.data));
        setCurrentDay(response.data.data[0]);
      }
    };
    getShopTimings();
  }, []);

  const getSortedSchedule = (data:any) => {
    const today = new Date().toISOString().slice(0, 10);
    const todayIdx = data.findIndex((d:any) => d.date === today);
    if (todayIdx === -1) return data;
    return [
      data[todayIdx],
      ...data.slice(0, todayIdx),
      ...data.slice(todayIdx + 1),
    ];
  };

  useEffect(() => {
    if (textWidth === 0) return;

    let isMounted = true;

    const animate = () => {
      marqueeAnim.setValue(containerWidth);

      Animated.timing(marqueeAnim, {
        toValue: -textWidth,
        duration: 7000,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished && isMounted) {
          animate();
        }
      });
    };

    animate();

    return () => {
      isMounted = false;
      marqueeAnim.stopAnimation();
    };
  }, [containerWidth, marqueeAnim, textWidth]);

  return (
    <>
      <View style={styles.timingBar}>
        <View style={{ overflow: 'hidden', width: containerWidth }}>
          <Animated.View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              transform: [{ translateX: marqueeAnim }],
            }}
            onLayout={(e) => {
              setTextWidth(e.nativeEvent.layout.width);
            }}
          >
            <Ionicons name="time-outline" size={18} />
            <Text style={styles.timingText}>
              {currentDay?.time == null
                ? `Closed : ${currentDay?.notes}` :(currentDay?.notes == null? `Our Today's Timing : ${currentDay?.time}` : ` ${currentDay?.notes.toUpperCase()} : ${currentDay?.time}`)}
            </Text>
          </Animated.View>
        </View>

        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={{ paddingLeft: 10, borderLeftWidth: 1, borderLeftColor: 'white' }}
        >
          <Ionicons name="information-circle-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
        style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: 100 }}
      >
        <SafeAreaView style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Shop Weekly Schedule</Text>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, { width: '30%' }]}>Date</Text>
              <Text style={[styles.tableHeaderText, { width: '45%' }]}>Timing</Text>
              <Text style={[styles.tableHeaderText, { width: '25%' }]}>Day</Text>
            </View>
            {schedule.map((item, idx) => {
              const isToday = idx === 0;
              const isClosed = item?.time == null;
              return (
                <View
                  key={item?.date}
                  style={[styles.tableRow, isToday && { backgroundColor: '#cde9d1' }]}
                >
                  <Text
                    style={[
                      styles.tableCell,
                      { width: '30%' },
                      isToday && { color: 'green', fontWeight: 'bold' },
                      isClosed && { color: 'red', fontWeight: 'bold' },
                    ]}
                  >
                    {item?.date}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      { width: '45%' },
                      isToday && { color: 'green', fontWeight: 'bold' },
                      isClosed && { color: 'red', fontWeight: 'bold' },
                    ]}
                  >
                    {item?.time ?? 'Closed'}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      { width: '25%', textTransform: 'capitalize' },
                      isToday && { color: 'green', fontWeight: 'bold' },
                      isClosed && { color: 'red', fontWeight: 'bold' },
                    ]}
                  >
                    {item?.day}
                  </Text>
                </View>
              );
            })}
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  timingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'space-around',
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  timingText: {
    fontSize: 14,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    width: '90%',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableHeader: {
    flexDirection: 'row',
    marginBottom: 6,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingBottom: 3,
  },
  tableHeaderText: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#333',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    marginBottom: 4,
    paddingVertical: 3,
  },
  tableCell: {
    fontSize: 12,
    color: '#222',
    paddingHorizontal: 5,
    textAlign: 'center',
  },
  closeBtn: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignSelf: 'center',
    marginTop: 15,
    borderRadius: 9,
    paddingVertical: 7,
    paddingHorizontal: 25,
  },
});
