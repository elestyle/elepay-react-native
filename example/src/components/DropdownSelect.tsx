import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

interface Props<T extends string> {
  selectedValue: T;
  items: T[];
  onValueChange: (value: T) => void;
  disabled?: boolean;
  itemColor?: (value: T) => string;
}

export default function DropdownSelect<T extends string>({
  selectedValue,
  items,
  onValueChange,
  disabled,
  itemColor,
}: Props<T>) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={styles.trigger}
        onPress={() => {
          if (!disabled) setVisible(true);
        }}
        activeOpacity={disabled ? 1 : 0.6}
      >
        <Text style={[styles.triggerText, disabled && styles.triggerTextDisabled]}>
          {selectedValue}
        </Text>
        <Text style={styles.arrow}>{'\u25BC'}</Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="slide">
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <SafeAreaView style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Select</Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Text style={styles.doneButton}>Done</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={items}
              keyExtractor={(item) => item}
              renderItem={({ item }) => {
                const color = itemColor ? itemColor(item) : '#000';
                const isSelected = item === selectedValue;
                return (
                  <TouchableOpacity
                    style={[styles.item, isSelected && styles.itemSelected]}
                    onPress={() => {
                      onValueChange(item);
                      setVisible(false);
                    }}
                  >
                    <Text style={[styles.itemText, { color }]}>{item}</Text>
                    {isSelected && <Text style={styles.checkmark}>{'\u2713'}</Text>}
                  </TouchableOpacity>
                );
              }}
              style={styles.list}
            />
          </SafeAreaView>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  triggerText: {
    fontSize: 15,
    color: '#000',
  },
  triggerTextDisabled: {
    color: '#999',
  },
  arrow: {
    fontSize: 12,
    color: '#999',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '60%',
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  doneButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  list: {
    flexGrow: 0,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  itemSelected: {
    backgroundColor: '#f0f6ff',
  },
  itemText: {
    fontSize: 15,
  },
  checkmark: {
    fontSize: 16,
    color: '#007AFF',
  },
});
