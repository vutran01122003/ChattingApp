import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { introspectToken } from '../redux/slices/authSlice';
import { ActivityIndicator, View } from 'react-native';

const AuthLoadingScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { is_valid, loading } = useSelector(state => state.authentication);

    useEffect(() => {
        dispatch(introspectToken()).then((result) => {
            if (result.payload?.is_valid) {
              navigation.replace('MainApp');
            } else {
              navigation.replace('Home');
            }
          })
    }, [dispatch]);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" />
        </View>
    );
};

export default AuthLoadingScreen;
