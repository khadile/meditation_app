import { View, Text } from 'react-native';

export default function AuthScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Authentication is currently disabled. You can use the app without logging in.</Text>
    </View>
  );
} 