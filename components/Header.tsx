import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Globe } from 'lucide-react-native';
import styles from '../styles/index';

interface HeaderProps {
    title: string;
    showLanguageModal: (val: boolean) => void;
}

export default function Header({ title, showLanguageModal }: HeaderProps) {
    return (
        <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity
                style={styles.languageButton}
                onPress={() => showLanguageModal(true)}
            >
                <Globe size={24} color="#dc2626" />
            </TouchableOpacity>
        </View>
    );
}
