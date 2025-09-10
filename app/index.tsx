import React, { useState, useEffect, useMemo } from 'react';
import { Keyboard, Modal, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
    fetchArtists,
    fetchTracks,
    fetchRecommendationsFromGPT,
} from '../api/spotifyService';
import en from '../locales/en.json';
import tr from '../locales/tr.json';
import es from '../locales/es.json';
import de from '../locales/de.json';
import fr from '../locales/fr.json';
import pt from '../locales/pt.json';
import ru from '../locales/ru.json';
import it from '../locales/it.json';
import nl from '../locales/nl.json';
import styles from '../styles/index';
import LanguageModal from '../components/LanguageModal';
import WelcomeModal from '../components/WelcomeModal';
import MoodModal from '../components/MoodModal';
import MainScroll from '../components/MainScroll';
import { openInMusicApps } from '../utils/openInApp';
import { useDebounce } from '../utils/debounce';
import Header from '@/components/Header';

type Lang = 'en' | 'tr' | 'es' | 'de' | 'fr' | 'pt' | 'ru' | 'it' | 'nl';
type PickType = 'track' | 'artist' | 'mood';

interface Song {
    song: string;
    artist: string;
    coverImage: string;
}

const translations: Record<Lang, any> = { en, tr, es, de, fr, pt, ru, it, nl };

export default function MusicRecommendationApp() {
    const [language, setLanguage] = useState<Lang>('en');
    const [selectedType, setSelectedType] = useState<PickType>('track');
    const [lessPopular, setLessPopular] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [autocomplete, setAutocomplete] = useState<string[]>([]);
    const [showAutocomplete, setShowAutocomplete] = useState(false);

    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [showMoodDropdown, setShowMoodDropdown] = useState(false);

    const [recommendations, setRecommendations] = useState<Song[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);

    const [showLanguageModal, setShowLanguageModal] = useState(false);

    const t = translations[language];

    const moods = useMemo(
        () => [
            { label: `${t.chill}`, value: 'chill' },
            { label: `${t.happy}`, value: 'happy' },
            { label: `${t.sad}`, value: 'sad' },
            { label: `${t.sleep}`, value: 'sleep' },
            { label: `${t.party}`, value: 'party' },
            { label: `${t.relax}`, value: 'relax' },
            { label: `${t.romance}`, value: 'romance' },
            { label: `${t.rainyDay}`, value: 'rainy-day' },
            { label: `${t.workOut}`, value: 'work-out' },
            { label: `${t.study}`, value: 'study' },
        ],
        [language]
    );

    useEffect(() => {
        setSelectedItems([]);
        setSearchQuery('');
        setAutocomplete([]);
        setShowAutocomplete(false);
        setRecommendations([]);
        Keyboard.dismiss();
    }, [selectedType]);

    const canAddMore = () =>
        selectedType === 'mood'
            ? selectedItems.length === 0
            : selectedItems.length < 5;

    const handleItemSelect = (item: string) => {
        if (selectedType === 'mood') {
            setSelectedItems([item]);
            setShowMoodDropdown(false);
        } else {
            if (canAddMore() && !selectedItems.includes(item)) {
                setSelectedItems((prev) => [...prev, item]);
                setSearchQuery('');
                setShowAutocomplete(false);
            }
        }
    };

    const removeItem = (item: string) => {
        setSelectedItems((prev) => prev.filter((i) => i !== item));
    };

    const doSearch = useDebounce(async (q: string, type: PickType) => {
        if (type === 'mood') return;

        if (!q || q.trim().length < 2) {
            setAutocomplete([]);
            setSearchLoading(false);
            return;
        }

        try {
            setSearchLoading(true);
            if (type === 'artist') {
                const opts = await fetchArtists(q);
                const labels: string[] = (opts || []).map(
                    (o: any) => o.label ?? o.name ?? o.value ?? ''
                );
                setAutocomplete(labels.filter(Boolean));
            } else {
                const opts = await fetchTracks(q);
                const labels: string[] = (opts || []).map(
                    (o: any) => o.label ?? o.name ?? o.value ?? ''
                );
                setAutocomplete(labels.filter(Boolean));
            }
        } catch (e) {
            setAutocomplete([]);
        } finally {
            setSearchLoading(false);
        }
    }, 400);

    const onChangeQuery = (text: string) => {
        setSearchQuery(text);
        setShowAutocomplete(text.length > 0);
        doSearch(text, selectedType);
    };

    const handleGetRecommendations = async () => {
        if (selectedType !== 'mood' && selectedItems.length === 0) return;
        if (selectedType === 'mood' && selectedItems.length === 0) return;

        setLoading(true);
        try {
            let result: Song[] = [];
            if (selectedType === 'artist') {
                result = await fetchRecommendationsFromGPT({
                    artists: selectedItems,
                    lessPopular,
                });
            } else if (selectedType === 'track') {
                result = await fetchRecommendationsFromGPT({
                    songs: selectedItems,
                    lessPopular,
                });
            } else if (selectedType === 'mood') {
                result = await fetchRecommendationsFromGPT({
                    mood: selectedItems[0],
                    lessPopular,
                });
            }
            setRecommendations(Array.isArray(result) ? result : []);
        } catch (e) {
            setRecommendations([]);
        } finally {
            setLoading(false);
        }
    };

    const placeholder = useMemo(() => {
        if (selectedType === 'artist')
            return t.artistAutocomplete ?? t.searchPlaceholder;
        if (selectedType === 'track')
            return t.trackAutocomplete ?? t.searchPlaceholder;
        return t.searchPlaceholder;
    }, [selectedType, language]);

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={['#000000', '#1a1a1a', '#2a2a2a']}
                style={styles.gradient}
            >
                <Header
                    title="Beatspresso"
                    showLanguageModal={setShowLanguageModal}
                />

                <WelcomeModal
                    welcomeTitle={t.welcomeTitle}
                    welcomeDescription={t.welcomeDescription}
                    step1={t.step1}
                    step2={t.step2}
                    step3={t.step3}
                    step4={t.step4}
                    dontShowAgain={t.dontShowAgain}
                    getStarted={t.getStarted}
                />

                <MainScroll
                    t={t}
                    selectedType={selectedType}
                    onChangeType={(type: PickType) => setSelectedType(type)}
                    lessPopular={lessPopular}
                    onToggleLessPopular={() => setLessPopular((p) => !p)}
                    searchQuery={searchQuery}
                    onChangeQuery={onChangeQuery}
                    onFocusSearch={() =>
                        setShowAutocomplete(searchQuery.length > 0)
                    }
                    autocomplete={autocomplete}
                    autocompleteVisible={showAutocomplete}
                    searchLoading={searchLoading}
                    canAddMore={canAddMore}
                    handleItemSelect={handleItemSelect}
                    selectedItems={selectedItems}
                    removeItem={removeItem}
                    placeholder={placeholder}
                    loading={loading}
                    handleGetRecommendations={handleGetRecommendations}
                    recommendations={recommendations}
                    onOpenMoodModal={() => setShowMoodDropdown(true)}
                    onPlayTrack={(track) =>
                        openInMusicApps({
                            song: track.song,
                            artist: track.artist,
                        })
                    }
                />

                <Modal visible={loading} transparent animationType="fade">
                    <View style={styles.modalOverlay}>
                        <ActivityIndicator size="large" color="#fff" />
                    </View>
                </Modal>

                <MoodModal
                    visible={showMoodDropdown}
                    moods={moods}
                    onSelect={(value: string) => handleItemSelect(value)}
                    onClose={() => setShowMoodDropdown(false)}
                    closeLabel={t.close ?? 'Close'}
                />

                <LanguageModal
                    visible={showLanguageModal}
                    language={language}
                    onLanguageSelect={(lng: Lang) => setLanguage(lng)}
                    onClose={() => setShowLanguageModal(false)}
                    t={t}
                />
            </LinearGradient>
        </SafeAreaView>
    );
}
