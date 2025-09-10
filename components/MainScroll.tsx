import React from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image,
    ActivityIndicator,
} from 'react-native';
import { Search, X, Music, User, Heart, Play } from 'lucide-react-native';
import styles from '../styles/index';

type PickType = 'track' | 'artist' | 'mood';

interface Song {
    song: string;
    artist: string;
    coverImage: string;
}

interface MainScrollProps {
    t: any;
    selectedType: PickType;
    onChangeType: (type: PickType) => void;
    lessPopular: boolean;
    onToggleLessPopular: () => void;
    searchQuery: string;
    onChangeQuery: (text: string) => void;
    onFocusSearch: () => void;
    autocomplete: string[];
    autocompleteVisible: boolean;
    searchLoading: boolean;
    canAddMore: () => boolean;
    handleItemSelect: (item: string) => void;
    selectedItems: string[];
    removeItem: (item: string) => void;
    placeholder: string;
    loading: boolean;
    handleGetRecommendations: () => void;
    recommendations: Song[];
    onOpenMoodModal: () => void;
    onPlayTrack: (track: Song) => void;
}

export default function MainScroll({
    t,
    selectedType,
    onChangeType,
    lessPopular,
    onToggleLessPopular,
    searchQuery,
    onChangeQuery,
    onFocusSearch,
    autocomplete,
    autocompleteVisible,
    searchLoading,
    canAddMore,
    handleItemSelect,
    selectedItems,
    removeItem,
    placeholder,
    loading,
    handleGetRecommendations,
    recommendations,
    onOpenMoodModal,
    onPlayTrack,
}: MainScrollProps) {
    return (
        <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
        >
            <View style={styles.radioGroup}>
                {(['track', 'artist', 'mood'] as const).map((type, index) => (
                    <TouchableOpacity
                        key={type}
                        style={[
                            styles.radioButton,
                            selectedType === type && styles.radioButtonActive,
                            index === 0 && styles.radioButtonFirst,
                            index === 2 && styles.radioButtonLast,
                        ]}
                        onPress={() => onChangeType(type)}
                    >
                        {type === 'track' && (
                            <Music
                                size={20}
                                color={selectedType === type ? '#fff' : '#666'}
                            />
                        )}
                        {type === 'artist' && (
                            <User
                                size={20}
                                color={selectedType === type ? '#fff' : '#666'}
                            />
                        )}
                        {type === 'mood' && (
                            <Heart
                                size={20}
                                color={selectedType === type ? '#fff' : '#666'}
                            />
                        )}
                        <Text
                            style={[
                                styles.radioText,
                                selectedType === type && styles.radioTextActive,
                            ]}
                        >
                            {t[type]}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.checkboxContainer}>
                <TouchableOpacity
                    style={styles.checkbox}
                    onPress={onToggleLessPopular}
                >
                    <View
                        style={[
                            styles.checkboxBox,
                            lessPopular && styles.checkboxBoxChecked,
                        ]}
                    >
                        {lessPopular && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                    <Text style={styles.checkboxText}>{t.lessPopular}</Text>
                </TouchableOpacity>
            </View>

            {selectedType === 'mood' ? (
                <TouchableOpacity
                    style={styles.moodDropdown}
                    onPress={onOpenMoodModal}
                >
                    <Text
                        style={[
                            styles.moodDropdownText,
                            selectedItems.length === 0 && styles.placeholder,
                        ]}
                    >
                        {selectedItems.length > 0
                            ? selectedItems[0]
                            : t.selectMood}
                    </Text>
                </TouchableOpacity>
            ) : (
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder={placeholder}
                        placeholderTextColor="#666"
                        value={searchQuery}
                        onChangeText={onChangeQuery}
                        onFocus={onFocusSearch}
                    />
                    <Search size={20} color="#666" style={styles.searchIcon} />
                </View>
            )}

            {selectedType !== 'mood' && autocompleteVisible && (
                <View style={styles.autocompleteContainer}>
                    {searchLoading ? (
                        <View style={{ padding: 12, alignItems: 'center' }}>
                            <ActivityIndicator />
                        </View>
                    ) : (
                        (autocomplete.length > 0
                            ? autocomplete
                            : [t.noResults ?? 'No results']
                        ).map((name, idx) => (
                            <TouchableOpacity
                                key={`${name}-${idx}`}
                                style={styles.autocompleteItem}
                                onPress={() => handleItemSelect(name)}
                                disabled={
                                    !canAddMore() ||
                                    name === (t.noResults ?? 'No results')
                                }
                            >
                                <Text
                                    style={[
                                        styles.autocompleteText,
                                        (!canAddMore() ||
                                            name ===
                                                (t.noResults ??
                                                    'No results')) &&
                                            styles.disabledText,
                                    ]}
                                    numberOfLines={1}
                                >
                                    {name}
                                </Text>
                            </TouchableOpacity>
                        ))
                    )}
                </View>
            )}

            {selectedItems.length > 0 && (
                <View style={styles.selectedContainer}>
                    {selectedItems.map((item, index) => (
                        <View
                            key={`${item}-${index}`}
                            style={styles.selectedItem}
                        >
                            <Text style={styles.selectedText} numberOfLines={1}>
                                {item}
                            </Text>
                            <TouchableOpacity onPress={() => removeItem(item)}>
                                <X size={16} color="#dc2626" />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            )}

            {(selectedType === 'mood'
                ? selectedItems.length === 1
                : selectedItems.length > 0) && (
                <TouchableOpacity
                    style={styles.recommendButton}
                    onPress={handleGetRecommendations}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>
                        {t.getRecommendations}
                    </Text>
                </TouchableOpacity>
            )}

            {recommendations.length > 0 && (
                <View style={styles.recommendationsContainer}>
                    <Text style={styles.recommendationsTitle}>
                        {t.recommendations}
                    </Text>
                    {recommendations.map((track, idx) => (
                        <View
                            key={`${track.song}-${idx}`}
                            style={styles.songCard}
                        >
                            <View style={styles.songCardContent}>
                                <View style={styles.songImageContainer}>
                                    <Image
                                        source={{ uri: track.coverImage }}
                                        style={styles.coverImage}
                                    />
                                    <TouchableOpacity
                                        style={styles.playOverlay}
                                        activeOpacity={0.8}
                                        onPress={() => onPlayTrack(track)}
                                    >
                                        <Play
                                            size={20}
                                            color="#fff"
                                            fill="#fff"
                                        />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.songInfo}>
                                    <Text
                                        style={styles.songName}
                                        numberOfLines={1}
                                    >
                                        {track.song}
                                    </Text>
                                    <Text
                                        style={styles.artistName}
                                        numberOfLines={1}
                                    >
                                        {track.artist}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            )}
        </ScrollView>
    );
}
