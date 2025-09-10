import React from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList } from 'react-native';
import styles from '../styles/index';

interface MoodOption {
    label: string;
    value: string;
}

interface MoodModalProps {
    visible: boolean;
    moods: MoodOption[];
    onSelect: (value: string) => void;
    onClose: () => void;
    closeLabel: string;
}

export default function MoodModal({
    visible,
    moods,
    onSelect,
    onClose,
    closeLabel,
}: MoodModalProps) {
    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.modalOverlay}>
                <View style={styles.moodModal}>
                    <FlatList
                        data={moods}
                        keyExtractor={(item) => item.value}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.moodItem}
                                onPress={() => onSelect(item.value)}
                            >
                                <Text style={styles.moodItemText}>{item.label}</Text>
                            </TouchableOpacity>
                        )}
                    />
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>{closeLabel}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}


