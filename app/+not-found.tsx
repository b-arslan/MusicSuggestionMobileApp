import React, { useEffect, useState } from 'react';
import { Link, Stack } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from '../styles/index';

import en from '../locales/en.json';
import tr from '../locales/tr.json';
import es from '../locales/es.json';
import de from '../locales/de.json';
import fr from '../locales/fr.json';
import pt from '../locales/pt.json';
import ru from '../locales/ru.json';
import it from '../locales/it.json';
import nl from '../locales/nl.json';

type Lang = 'en' | 'tr' | 'es' | 'de' | 'fr' | 'pt' | 'ru' | 'it' | 'nl';
const translations: Record<Lang, any> = { en, tr, es, de, fr, pt, ru, it, nl };

export default function NotFoundScreen() {
    const [language, setLanguage] = useState<Lang>('en');
    const t = translations[language];

    useEffect(() => {
        (async () => {
            try {
                const saved = await AsyncStorage.getItem('appLanguage');
                if (saved && (saved as Lang) in translations) {
                    setLanguage(saved as Lang);
                }
            } catch {}
        })();
    }, []);

    return (
        <>
            <Stack.Screen options={{ title: t.oops ?? 'Oops' }} />
            <SafeAreaView style={styles.container}>
                <LinearGradient
                    colors={['#000000', '#1a1a1a', '#2a2a2a']}
                    style={styles.gradient}
                >
                    <View style={localStyles.center}>
                        <Text style={styles.recommendationsTitle}>
                            {t.oops ?? 'Oops'}
                        </Text>
                        <Text style={styles.welcomeDescription}>
                            {t.notFoundMessage ?? "This screen doesn't exist."}
                        </Text>
                        <Link href="/" asChild>
                            <View
                                style={[
                                    styles.recommendButton,
                                    localStyles.button,
                                ]}
                            >
                                <Text style={styles.buttonText}>
                                    {t.goHome ?? 'Go to home screen!'}
                                </Text>
                            </View>
                        </Link>
                    </View>
                </LinearGradient>
            </SafeAreaView>
        </>
    );
}

const localStyles = StyleSheet.create({
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    button: {
        marginTop: 24,
    },
});
