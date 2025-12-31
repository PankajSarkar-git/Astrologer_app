import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { verticalScale } from '../../utils/sizer';

type Mode = 'date' | 'time';

interface Props {
  label?: string;
  value?: Date;
  onChange: (date: Date) => void;
  mode?: Mode;
  placeholder?: string;
  showError?: boolean;
  errorMessage?: string;
}

const CustomDateTimePicker: React.FC<Props> = ({
  label,
  value,
  onChange,
  mode = 'date',
  placeholder = 'Select',
  showError = false,
  errorMessage,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowPicker(false);

    if (event.type === 'set' && selectedDate) {
      onChange(selectedDate);
    }
  };

  const formattedValue = () => {
    if (!value) return placeholder;

    if (mode === 'time') {
      return value.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    }

    return value.toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity
        style={styles.inputWrapper}
        onPress={() => setShowPicker(true)}
        activeOpacity={0.8}
      >
        <Text style={[styles.input, { color: value ? '#000' : '#888' }]}>
          {formattedValue()}
        </Text>
      </TouchableOpacity>

      {showError && errorMessage && (
        <Text style={styles.error}>{errorMessage}</Text>
      )}

      {showPicker && (
        <DateTimePicker
          value={value || new Date()}
          mode={mode}
          is24Hour
          display="default"
          onChange={handleChange}
        />
      )}
    </View>
  );
};

export default CustomDateTimePicker;

const styles = StyleSheet.create({
  container: {
    marginVertical: verticalScale(12),
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: '500',
    color: '#000',
  },
  inputWrapper: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: verticalScale(12),
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderColor: '#ccc',
  },
  input: {
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginTop: 4,
    fontSize: 12,
  },
});
