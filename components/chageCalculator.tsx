import React, { useEffect, useRef, useState } from 'react';
import { Linking, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';

const DEFAULT_RATE = 1.95583;
const NUMBER_REGEX = /^\d*([.,]\d*)?$/;

const toCents = (value: number) => Math.round(value * 100);
const fromCents = (cents: number) => (cents / 100).toFixed(2);


export default function ChangeCalculator() {
  const [dueBGN, setDueBGN] = useState('');
  const [dueEUR, setDueEUR] = useState('');
  const [paid, setPaid] = useState('');
  const [changeBGN, setChangeBGN] = useState('0.00');
  const [changeEUR, setChangeEUR] = useState('0.00');

  const [rate, setRate] = useState(String(DEFAULT_RATE));


  const [currency, setCurrency] = useState<'BGN' | 'EUR'>('BGN'); // дължима
  const [paymentCurrency, setPaymentCurrency] = useState<'BGN' | 'EUR'>('BGN'); // плащане

  const abortRef = useRef<number | null>(null);

  

  const systemScheme = useColorScheme(); // 'light' | 'dark'
const [theme, setTheme] = useState<'light' | 'dark'>(systemScheme || 'light');

const themeColors = colors[theme];

// const numericRate = Number(rate) || DEFAULT_RATE;

const numericRate =
  rate.trim() === '' ? DEFAULT_RATE : Number(rate);


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
        : Number(dueEUR || 0) * numericRate;
    
    const paidInBGN =
      paymentCurrency === 'BGN'
        ? Number(paid || 0)
        : Number(paid || 0) * numericRate;
    
    // работим в стотинки
    const dueCents = toCents(dueInBGN);
    const paidCents = toCents(paidInBGN);
    
    const changeCents = paidCents - dueCents;

    //const safeChangeCents = Math.abs(changeCents) < 1 ? 0 : changeCents;

      // const change = paidInBGN - dueInBGN;

      // setChangeBGN(change > 0 ? change.toFixed(2) : '0.00');
      // setChangeEUR(change > 0 ? (change / RATE).toFixed(2) : '0.00');

      
      //const change = paidInBGN - dueInBGN;

      if (changeCents < 0) {
        setError('Платената сума е по-малка от дължимата');
      
        const missing = Math.abs(changeCents);
      
        setChangeBGN(fromCents(missing));
        setChangeEUR((missing / 100 / numericRate).toFixed(2));
      } else {
        setError('');
      
        setChangeBGN(fromCents(changeCents));
        setChangeEUR((changeCents / 100 / numericRate).toFixed(2));
      }
      
      
    }, 200);

    return () => {
      if (abortRef.current !== null) clearTimeout(abortRef.current);
    };
  }, [dueBGN, dueEUR, paid, currency, paymentCurrency,rate]);

  const handleClear = () => {
    if (abortRef.current !== null) clearTimeout(abortRef.current);
    setDueBGN('');
    setDueEUR('');
    setPaid('');
    setChangeBGN('0.00');
    setChangeEUR('0.00');
    setRate(String(DEFAULT_RATE));
    setError('');
  };

  // const handleNumericInput = (
  //   value: string,
  //   setter: (v: string) => void
  // ) => {
  //   if (value === '' || NUMBER_REGEX.test(value)) {
  //     setError('');
  //     setter(value.replace(',', '.')); // уеднаквяваме , -> .
  //   } else {
  //     setError('Моля, въведете валидно число');
  //   }
  // };
  

  return (
    <View style={[styles.container, { backgroundColor:themeColors.bg}]}>
    <ScrollView
    contentContainerStyle={styles.scrollContainer}
    showsVerticalScrollIndicator={false}
    keyboardShouldPersistTaps="handled"
    keyboardDismissMode="on-drag"
  >
      <Text style={[styles.title, { color: themeColors.text}]}>Калкулатор за ресто</Text>

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
      <Text style={{ color: themeColors.text,marginBottom:4 }}>
  Дължима сума ({currency})
</Text>

        <TextInput
        
          style={[styles.input,{backgroundColor: themeColors.card, color: themeColors.text, borderColor: themeColors.inputBorder,},]}
          keyboardType="numeric"
          value={currency === 'BGN' ? dueBGN : dueEUR}
          onChangeText={text => {
            if (!NUMBER_REGEX.test(text) && text !== '') {
              setError('Позволени са само числа и една точка или запетайка');
              return;
            }
          
            const normalized = text.replace(',', '.');
            setError('');
          
            if (currency === 'BGN') {
              setDueBGN(normalized);
              setDueEUR(normalized ? (Number(normalized) / numericRate).toFixed(2) : '');
            } else {
              setDueEUR(normalized);
              setDueBGN(normalized ? (Number(normalized) * numericRate).toFixed(2) : '');
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
      

        <Text style={{ color: themeColors.text,marginBottom:4 }}>Платена сума ({paymentCurrency})</Text>
        <TextInput
          style={[styles.input,{backgroundColor:themeColors.card,color:themeColors.text,borderColor: themeColors.inputBorder,},]}
          keyboardType="numeric"
          value={paid}
          onChangeText={text => {
            if (text === '' || NUMBER_REGEX.test(text)) {
              setError('');
              setPaid(text.replace(',', '.'));
            } else {
              setError('Позволени са само числа и една точка или запетайка');
            }
          }}
          
          
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

      {/* Курс */}
<View style={styles.rateWrapper}>
  <Text style={{ color: themeColors.text, marginBottom: 4 }}>
     1EUR
  </Text>

  <TextInput
    style={[
      styles.input,
      {
        backgroundColor: themeColors.card,
        color: themeColors.text,
        borderColor: themeColors.inputBorder,
      },
    ]}
    keyboardType="numeric"
    value={rate}
    onChangeText={text => {
      if (text === '' || NUMBER_REGEX.test(text)) {
        setError('');
        setRate(text.replace(',', '.'));
      } else {
        setError('Курсът трябва да е число');
      }
    }}
    onBlur={() => {
      if (!rate) setRate(String(DEFAULT_RATE));
    }}
  />

  <Text style={{ color: themeColors.secondary, fontSize: 12 }}>
     BGN {DEFAULT_RATE}
  </Text>
 
</View>

      <AppFooter />
      </ScrollView>
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
  
  // rateWrapper: {
  //   alignSelf: 'center',   
  //   marginBottom: 10,
  // },
  

  rateWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 14,
  },

  rateInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    minWidth: 110,         // да не стане много тясно
    textAlign: 'center',   // числото да стои красиво
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

  footer: { marginTop: 24, alignItems: 'center' ,paddingBottom: 30},
  footerText: { fontSize: 12, color: '#6b7280' },
  footerLink: { marginTop: 4, fontSize: 12, color: '#06b6d4' },
  scrollContainer: {
    flexGrow: 1,           
    justifyContent: 'center', 
    paddingTop: 40,
    paddingBottom: 30,     
  },
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

