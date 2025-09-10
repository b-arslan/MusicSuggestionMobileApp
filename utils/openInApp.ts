import { Linking, Platform, Alert } from 'react-native';
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

const language: Lang = 'en';
const t = translations[language];

type TrackLite = { song: string; artist: string };

const makeQuery = (t: TrackLite) => `${t.song} - ${t.artist}`.trim();

async function openOnIOS(t: TrackLite) {
    const qEnc = encodeURIComponent(makeQuery(t));
    const qPlain = makeQuery(t);

    const appleApp = `music://search?term=${qEnc}`;
    const spotifyA = `spotify:search:${qPlain}`;
    const spotifyB = `spotify://search?q=${qEnc}`;
    const appleWeb = `https://music.apple.com/search?term=${qEnc}`;
    const spotifyWeb = `https://open.spotify.com/search/${qEnc}`;

    try {
        await Linking.openURL(appleApp);
        return;
    } catch {}
    try {
        await Linking.openURL(spotifyA);
        return;
    } catch {}
    try {
        await Linking.openURL(spotifyB);
        return;
    } catch {}
    try {
        await Linking.openURL(appleWeb);
        return;
    } catch {}
    await Linking.openURL(spotifyWeb);
}

async function openOnAndroid(t: TrackLite) {
    const qEnc = encodeURIComponent(makeQuery(t));
    const qPlain = makeQuery(t);

    const spotifyA = `spotify:search:${qPlain}`;
    const spotifyB = `spotify://search?q=${qEnc}`;
    const spotifyWeb = `https://open.spotify.com/search/${qEnc}`;
    const appleWeb = `https://music.apple.com/search?term=${qEnc}`;

    try {
        await Linking.openURL(spotifyA);
        return;
    } catch {}
    try {
        await Linking.openURL(spotifyB);
        return;
    } catch {}
    try {
        await Linking.openURL(spotifyWeb);
        return;
    } catch {}
    await Linking.openURL(appleWeb);
}

export async function openInMusicApps(track: TrackLite) {
    try {
        if (Platform.OS === 'ios') {
            await openOnIOS(track);
        } else {
            await openOnAndroid(track);
        }
    } catch (e) {
        Alert.alert(t.oops, t.openSongError);
    }
}
