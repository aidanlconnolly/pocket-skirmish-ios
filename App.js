import { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { StatusBar } from 'expo-status-bar';

/**
 * Pocket Skirmish — native iOS shell.
 * Loads the self-contained web game (assets/game.html) inside a WebView.
 * The game is pure HTML/Canvas with no network calls, so it runs fully offline.
 */
export default function App() {
  const [html, setHtml] = useState(null);

  useEffect(() => {
    (async () => {
      const asset = Asset.fromModule(require('./assets/game.html'));
      await asset.downloadAsync();
      const content = await FileSystem.readAsStringAsync(asset.localUri || asset.uri);
      setHtml(content);
    })();
  }, []);

  if (!html) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#3b82f6" size="large" />
      </View>
    );
  }

  return (
    <View style={styles.fill}>
      <StatusBar style="light" />
      <WebView
        originWhitelist={['*']}
        source={{ html }}
        style={styles.fill}
        scrollEnabled={false}
        bounces={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        // keep the canvas crisp & the layout locked to the device
        scalesPageToFit={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: '#070d0a' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#070d0a' },
});
