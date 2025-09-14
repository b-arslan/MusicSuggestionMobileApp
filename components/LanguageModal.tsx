import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import styles from '../styles';

interface LanguageModalProps {
    visible: boolean;
    language: 'en' | 'tr' | 'es' | 'de' | 'fr' | 'pt' | 'ru' | 'it' | 'nl';
    onLanguageSelect: (
        language: 'en' | 'tr' | 'es' | 'de' | 'fr' | 'pt' | 'ru' | 'it' | 'nl'
    ) => void;
    onClose: () => void;
    t: any;
}

interface LanguageOption {
    code: 'en' | 'tr' | 'es' | 'de' | 'fr' | 'pt' | 'ru' | 'it' | 'nl';
    name: string;
}

const languageOptions: LanguageOption[] = [
    { code: 'en', name: 'English' },
    { code: 'tr', name: 'Türkçe' },
    { code: 'es', name: 'Español' },
    { code: 'de', name: 'Deutsch' },
    { code: 'fr', name: 'Français' },
    { code: 'pt', name: 'Português' },
    { code: 'ru', name: 'Русский' },
    { code: 'it', name: 'Italiano' },
    { code: 'nl', name: 'Nederlands' },
];

export default function LanguageModal({
    visible,
    language,
    onLanguageSelect,
    onClose,
    t,
}: LanguageModalProps) {
    const handleLanguageSelect = (
        selectedLanguage:
            | 'en'
            | 'tr'
            | 'es'
            | 'de'
            | 'fr'
            | 'pt'
            | 'ru'
            | 'it'
            | 'nl'
    ) => {
        onLanguageSelect(selectedLanguage);
        onClose();
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.modalOverlay}>
                <View style={styles.languageModal}>
                    <Text style={styles.languageModalTitle}>{t.language}</Text>

                    {languageOptions.map((option) => (
                        <TouchableOpacity
                            key={option.code}
                            style={{
                                ...styles.languageOption,
                                ...(language === option.code &&
                                    styles.languageOptionSelected),
                            }}
                            onPress={() => handleLanguageSelect(option.code)}
                        >
                            <Text style={styles.languageOptionText}>
                                {option.name}
                            </Text>
                        </TouchableOpacity>
                    ))}

                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={onClose}
                    >
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}
