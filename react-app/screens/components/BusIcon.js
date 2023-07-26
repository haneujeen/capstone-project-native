import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faShuttleVan } from '@fortawesome/free-solid-svg-icons';

export default function BusIcon() {
  const bounceValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceValue, {
          toValue: -5,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(bounceValue, {
          toValue: 0,
          duration: 110,
          useNativeDriver: true,
        }),
        Animated.timing(bounceValue, {
          toValue: -5,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(bounceValue, {
          toValue: 0,
          duration: 110,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ translateY: bounceValue }] }}>
      <FontAwesomeIcon
        icon={faShuttleVan}
        size={27}
        style={{ color: 'hsla(9, 8%, 83%, 1)' }}
      />
    </Animated.View>
  );
}
