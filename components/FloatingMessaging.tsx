import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Animated,
  PanResponder,
  StyleSheet,
} from 'react-native';
import ChatContent from './messaging/ChatContent'; // ✅ reemplaza Slot

const { width, height } = Dimensions.get('window');

export default function FloatingMessaging({ onClose }: { onClose: () => void }) {
  const [expanded, setExpanded] = useState(true);
  const position = useState(new Animated.ValueXY({ x: width - 90, y: height - 200 }))[0];

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event(
      [null, { dx: position.x, dy: position.y }],
      { useNativeDriver: false }
    ),
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.moveY > height - 100) {
        onClose();
      } else {
        Animated.spring(position, {
          toValue: { x: width - 90, y: height - 200 },
          useNativeDriver: false,
        }).start();
      }
    },
  });

  return expanded ? (
    <View style={styles.expandedWindow}>
      <TouchableOpacity style={styles.minimizeBtn} onPress={() => setExpanded(false)}>
        <Text style={{ color: 'white' }}>Minimizar</Text>
      </TouchableOpacity>
      <ChatContent />
    </View>
  ) : (
    <Animated.View
      {...panResponder.panHandlers}
      style={[styles.bubble, { transform: position.getTranslateTransform() }]}
    >
      <TouchableOpacity onPress={() => setExpanded(true)}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Chat</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  expandedWindow: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    bottom: 50,
    backgroundColor: '#fff',
    borderRadius: 16,
    zIndex: 999,
    overflow: 'hidden',
    elevation: 5,
  },
  minimizeBtn: {
    backgroundColor: '#3C63FF',
    padding: 8,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    alignItems: 'center',
  },
  bubble: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#3C63FF',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
});
