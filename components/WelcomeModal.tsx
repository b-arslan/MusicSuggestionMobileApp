import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/index';

interface WelcomeModalProps {
    welcomeTitle: string;
    welcomeDescription: string;
    step1: string;
    step2: string;
    step3: string;
    step4: string;
    dontShowAgain: string;
    getStarted: string;
}

export default function WelcomeModal({
    welcomeTitle,
    welcomeDescription,
    step1,
    step2,
    step3,
    step4,
    dontShowAgain,
    getStarted,
}: WelcomeModalProps) {
    const [showWelcomeModal, setShowWelcomeModal] = useState(true);
    const [dontShowWelcome, setDontShowWelcome] = useState(false);

    const loadWelcomePreference = async () => {
        try {
            const saved = await AsyncStorage.getItem('dontShowWelcome');
            if (saved !== null) {
                const dont = JSON.parse(saved);
                setDontShowWelcome(dont);
                setShowWelcomeModal(!dont);
            }
        } catch {}
    };

    useEffect(() => {
        loadWelcomePreference();
    }, []);

    const saveWelcomePreference = async (dontShow: boolean) => {
        try {
            await AsyncStorage.setItem('dontShowWelcome', JSON.stringify(dontShow));
        } catch {}
    };

    const handleWelcomeClose = async () => {
        setShowWelcomeModal(false);
        if (dontShowWelcome) await saveWelcomePreference(true);
    };

    return (
        <Modal visible={showWelcomeModal} transparent animationType="fade">
            <View style={styles.modalOverlay}>
                <View style={styles.welcomeModal}>
                    <View style={styles.welcomeHeader}>
                        <Sparkles size={32} color="#dc2626" />
                        <Text style={styles.welcomeTitle}>{welcomeTitle}</Text>
                    </View>

                    <Text style={styles.welcomeDescription}>{welcomeDescription}</Text>

                    <View style={styles.stepsContainer}>
                        <Text style={styles.stepText}>{step1}</Text>
                        <Text style={styles.stepText}>{step2}</Text>
                        <Text style={styles.stepText}>{step3}</Text>
                        <Text style={styles.stepText}>{step4}</Text>
                    </View>

                    <View style={styles.welcomeCheckboxContainer}>
                        <TouchableOpacity
                            style={styles.welcomeCheckbox}
                            onPress={() => setDontShowWelcome((p) => !p)}
                        >
                            <View
                                style={{
                                    ...styles.welcomeCheckboxBox,
                                    ...(dontShowWelcome && styles.welcomeCheckboxBoxChecked),
                                }}
                            >
                                {dontShowWelcome && (
                                    <Text style={styles.welcomeCheckmark}>✓</Text>
                                )}
                            </View>
                            <Text style={styles.welcomeCheckboxText}>{dontShowAgain}</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.getStartedButton} onPress={handleWelcomeClose}>
                        <Text style={styles.getStartedText}>{getStarted}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}
