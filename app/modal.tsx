import { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ChangeCalculator from '../components/chageCalculator';

export default function MyModal() {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.openBtn}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.btnText}>Open Calculator</Text>
      </TouchableOpacity>

      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <ChangeCalculator />
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setVisible(false)}
            >
              <Text style={styles.btnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  openBtn: { padding: 12, backgroundColor: '#06b6d4', borderRadius: 8 },
  closeBtn: { marginTop: 10, padding: 10, backgroundColor: '#f97316', borderRadius: 8 },
  btnText: { color: '#fff', fontWeight: '600', textAlign: 'center' },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: { width: '90%', backgroundColor: '#fff', padding: 20, borderRadius: 16 },
});
