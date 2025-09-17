import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import config from '../config';
import { useNotifications } from './notificationContext';
export default function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [user, setUser] = useState(null);
  const  [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const { refreshUnread } = useNotifications();
    const [refreshing, setRefreshing] = useState(false);

    const refreshNotifications = async () => {
        setRefreshing(true);
        try {
            let userToken = await AsyncStorage.getItem('userToken');
            userToken = JSON.parse(userToken || '{}');

            const response = await axios.get(`${config.apiBaseUrl}/notifications`, {
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${userToken}`
              }
            });
            setNotifications(response.data.data || []);
        } catch (error) {
            console.error('Error refreshing notifications:', error);
        }
        setRefreshing(false);
    };
  // Fetch user and notifications
  useEffect(() => {
  const fetchData = async () => {
    let userToken = await AsyncStorage.getItem('userToken');
    let userData = await AsyncStorage.getItem('user');
    userToken = JSON.parse(userToken || '{}');
    userData = JSON.parse(userData || '{}');
    setUser(userData);
    setToken(userToken);

    const response = await axios.get(`${config.apiBaseUrl}/notifications`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      }
    });
    setNotifications(response.data.data || []);
    setLoading(false);
  };
  fetchData();
}, []);


  const onNotificationPress = async (notification: any) => {
    setSelectedNotif(notification);
    setModalVisible(true);

    if (user && !notification.seen_by?.includes(user.id)) {
      try {
        await axios.get(`${config.apiBaseUrl}/notifications/${notification.id}/seen`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        setNotifications((prev:any) =>
          prev.map((n:any) =>
            n.id === notification.id
              ? { ...n, seen_by: [...(n.seen_by || []), user.id] }
              : n
          )
        );
        await refreshUnread();
      } catch (error) {
        console.error('Error marking as seen:', error);
      }
    }
  };


    const renderItem = ({ item }: any) => {
        const isSeen = user && item.seen_by?.includes(user?.id);

        const createdDate = new Date(item.created_at);
        const formattedTime = createdDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const fontWeightStyle:any = { fontWeight: isSeen ? 'normal' : 'bold' };
        // console.log(fontWeightStyle);
        return (
            <TouchableOpacity onPress={() => onNotificationPress(item)}>
            <View style={styles.rowContainer}>
                <Text style={[styles.notificationTitle, fontWeightStyle]}>
                {item.title}
                </Text>
                <Text style={[styles.notificationMessage, fontWeightStyle]} numberOfLines={1} ellipsizeMode="tail">
                {item.message || ''}
                </Text>
                <Text style={[styles.timeText, fontWeightStyle]}>
                    {formattedTime}
                </Text>
            </View>
            </TouchableOpacity>
        );
    };



  if (loading) {
    return <ActivityIndicator style={{flex: 1, justifyContent: 'center'}} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#C2DFD6', paddingTop: 45 }}>
      {/* <Text style={{ fontSize: 18, fontWeight: 'bold', alignSelf: 'center', marginBottom: 10 }}>NOTIFICATIONS</Text> */}
      <View style={{ backgroundColor: '#fff', flex: 1, padding: 5 }}>
        {notifications.length === 0 ? (
          <Text style={[styles.notificationText, { textAlign: 'center' }]}>No notifications</Text>
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={item => item?.id.toString()}
            renderItem={renderItem}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={refreshNotifications} />
            }
            />
        )}
      </View>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>
              {selectedNotif?.title}
            </Text>
            <Text style={{ fontSize: 14, marginBottom: 15 }}>{selectedNotif?.message || ''}</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={{ fontWeight: 'bold', color: '#fff' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center'
  },
  notificationText: {
    flex: 1,
    fontSize: 15,
    color: '#333'
  },
  timeText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer: {
    backgroundColor: '#fff',
    width: '85%',
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 7
  },
  closeButton: {
    backgroundColor: '#5a9',
    borderRadius: 7,
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 35
  },
  rowContainer: {
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  notificationTitle: {
    fontSize: 16,
    color: '#333',
  },
  notificationMessage: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  
});
