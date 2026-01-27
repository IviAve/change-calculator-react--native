import React, { useEffect, useRef, useState } from 'react';
import { Linking, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';


const RATE = 1.95583;

export default function ChangeCalculator() {
  const [dueBGN, setDueBGN] = useState('');
  const [dueEUR, setDueEUR] = useState('');
  const [paid, setPaid] = useState('');
  const [changeBGN, setChangeBGN] = useState('0.00');
  const [changeEUR, setChangeEUR] = useState('0.00');

  const [currency, setCurrency] = useState<'BGN' | 'EUR'>('BGN'); // дължима
  const [paymentCurrency, setPaymentCurrency] = useState<'BGN' | 'EUR'>('BGN'); // плащане

  const abortRef = useRef<number | null>(null);

  const systemScheme = useColorScheme(); // 'light' | 'dark'
const [theme, setTheme] = useState<'light' | 'dark'>(systemScheme || 'light');

const themeColors = colors[theme];

const [error, setError] = useState('');


useEffect(() => {
  setTheme(systemScheme || 'light');
}, [systemScheme]);


  useEffect(() => {
    if (abortRef.current !== null) clearTimeout(abortRef.current);

    abortRef.current = setTimeout(() => {
      const dueInBGN =
        currency === 'BGN'
          ? Number(dueBGN || 0)
          : Number(dueEUR || 0) * RATE;

      const paidInBGN =
        paymentCurrency === 'BGN'
          ? Number(paid || 0)
          : Number(paid || 0) * RATE;

      // const change = paidInBGN - dueInBGN;

      // setChangeBGN(change > 0 ? change.toFixed(2) : '0.00');
      // setChangeEUR(change > 0 ? (change / RATE).toFixed(2) : '0.00');

      
      const change = paidInBGN - dueInBGN;

      if (change < 0) {
        setError('Платената сума е по-малка от дължимата');
        const missing = Math.abs(change);
  setChangeBGN(missing.toFixed(2));
  setChangeEUR((missing / RATE).toFixed(2));
      } else {
        setError('');
      }
      
      setChangeBGN(change.toFixed(2));
      setChangeEUR((change / RATE).toFixed(2));
      
      
    }, 200);

    return () => {
      if (abortRef.current !== null) clearTimeout(abortRef.current);
    };
  }, [dueBGN, dueEUR, paid, currency, paymentCurrency]);

  const handleClear = () => {
    if (abortRef.current !== null) clearTimeout(abortRef.current);
    setDueBGN('');
    setDueEUR('');
    setPaid('');
    setChangeBGN('0.00');
    setChangeEUR('0.00');
  };

  return (
    <View style={[styles.container, { backgroundColor:themeColors.text}]}>
      <Text style={[styles.title, { color: themeColors.bg}]}>Калкулатор за ресто</Text>

      <TouchableOpacity
  onPress={() => setTheme(theme === 'light' ? 'dark' : 'light')}
  style={{ alignSelf: 'center', marginBottom: 12 }}
>
  <Text style={{ color: themeColors.primary }}>
    {theme === 'light' ? '🌙 Тъмна тема' : '☀️ Светла тема'}
  </Text>
</TouchableOpacity>


      {/* Дължима валута */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleBtn, currency === 'BGN' && styles.active]}
          onPress={() => setCurrency('BGN')}
        >
          <Text style={styles.toggleText}>BGN</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, currency === 'EUR' && styles.active]}
          onPress={() => setCurrency('EUR')}
        >
          <Text style={styles.toggleText}>EUR</Text>
        </TouchableOpacity>
      </View>

      

      {/* Дължима сума */}
      <View style={styles.inputGroup}>
        <Text>Дължима сума ({currency})</Text>
        <TextInput
        
          style={styles.input}
          keyboardType="numeric"
          value={currency === 'BGN' ? dueBGN : dueEUR}
          onChangeText={text => {
            if (currency === 'BGN') {
              setDueBGN(text);
              setDueEUR(text ? (Number(text) / RATE).toFixed(2) : '');
            } else {
              setDueEUR(text);
              setDueBGN(text ? (Number(text) * RATE).toFixed(2) : '');
            }
          }}
          
        />
        <Text style={{ color: themeColors.secondary, fontSize: 12, marginTop: 4 }}>
  Моля, въведете сумата, която дължите
</Text>

      </View>

      {/* Платежна валута */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleBtn, paymentCurrency === 'BGN' && styles.active]}
          onPress={() => setPaymentCurrency('BGN')}
        >
          <Text style={styles.toggleText}>Плащане BGN</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, paymentCurrency === 'EUR' && styles.active]}
          onPress={() => setPaymentCurrency('EUR')}
        >
          <Text style={styles.toggleText}>Плащане EUR</Text>
        </TouchableOpacity>
      </View>

      {/* Платена сума */}
      <View style={styles.inputGroup}>
        <Text>Платена сума ({paymentCurrency})</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={paid}
          onChangeText={setPaid}
          
        />
        {error ? (
            <Text style={{ color: themeColors.error, marginTop: 4 }}>
              {error}
            </Text>
          ) : null}
      </View>

      {/* Ресто */}
      <View style={styles.result}>
      <Text style={[
    styles.resultMain,
    { color: error ? themeColors.error : themeColors.primary },
  ]}> { error ? 'Липсваща сума' : 'Ресто' }</Text>
        {paymentCurrency === 'BGN' ? (
          <>
            <Text style={styles.resultMain}>{changeBGN} BGN</Text>
            <Text style={styles.resultSub}>{changeEUR} EUR</Text>
          </>
        ) : (
          <>
            <Text style={styles.resultMain}>{changeEUR} EUR</Text>
            <Text style={styles.resultSub}>{changeBGN} BGN</Text>
          </>
        )}
      </View>

      <TouchableOpacity style={styles.clearBtn} onPress={handleClear}>
        <Text style={styles.clearText}>Clear</Text>
      </TouchableOpacity>

      <AppFooter />
    </View>
  );
}

function AppFooter() {
  const year = new Date().getFullYear();

  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>© {year} IviAve</Text>
      <TouchableOpacity
        onPress={() =>
          Linking.openURL('https://iviave.github.io/privacy-policy/')
        }
      >
        <Text style={styles.footerLink}>Политика за поверителност</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 20, textAlign: 'center' },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
    textAlign: 'center',
  },
  
  toggleContainer: { flexDirection: 'row', marginBottom: 12 },
  toggleBtn: {
    flex: 1,
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
  },
  active: { backgroundColor: '#06b6d4' },
  toggleText: { color: '#0c4a6e', fontWeight: '600' },

  inputGroup: { marginBottom: 15 },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    marginTop: 5,
    backgroundColor: '#fff',
  },

  result: { alignItems: 'center', marginVertical: 20 },
  resultMain: { fontSize: 26, fontWeight: '700', color: '#06b6d4' },
  resultSub: { fontSize: 16, color: '#6b7280' },

  clearBtn: { padding: 12, backgroundColor: '#06b6d4', borderRadius: 8 },
  clearText: { color: '#fff', fontWeight: '600', textAlign: 'center' },

  footer: { marginTop: 24, alignItems: 'center' },
  footerText: { fontSize: 12, color: '#6b7280' },
  footerLink: { marginTop: 4, fontSize: 12, color: '#06b6d4' },
});



const colors = {
  light: {
    bg: '#f3f4f6',
    card: '#ffffff',
    text: '#111',
    primary: '#06b6d4',
    secondary: '#6b7280',
    inputBorder: '#d1d5db',
    error: '#dc2626',
  },
  dark: {
    bg: '#0f172a',
    card: '#1e293b',
    text: '#f8fafc',
    primary: '#38bdf8',
    secondary: '#94a3b8',
    inputBorder: '#334155',
    error: '#f87171',
  },
};
