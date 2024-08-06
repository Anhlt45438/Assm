// 1. import các thư viện
import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import TrackPlayer, {
    useTrackPlayerEvents,
    usePlaybackState,
    useProgress,
    Event,
    State
} from 'react-native-track-player';
import Icon from 'react-native-vector-icons/FontAwesome';
import { setupPlayer, addTracks } from './trackPlayerServices';
import Slider from '@react-native-community/slider';

function Home() {
    const [isPlayerReady, setIsPlayerReady] = useState(false);

    useEffect(() => {
        async function setup() {
            let isSetup = await setupPlayer();
            const queue = await TrackPlayer.getQueue();
            if (isSetup && queue.length <= 0) {
                await addTracks();
            }
            setIsPlayerReady(isSetup);
        }
        setup();
    }, []);

    if (!isPlayerReady) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color="#bbb" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Header />
            <TrackProgress />
            <Playlist />
        </SafeAreaView>
    );
}

function Playlist() {
    const [queue, setQueue] = useState([]);
    const [currentTrack, setCurrentTrack] = useState(0);

    async function loadPlaylist() {
        const queue = await TrackPlayer.getQueue();
        setQueue(queue);
    }

    useEffect(() => {
        loadPlaylist();
    }, []);

    useTrackPlayerEvents([Event.PlaybackTrackChanged], (event) => {
        if (event.state === State.nextTrack) {
            TrackPlayer.getCurrentTrack().then((index) => setCurrentTrack(index));
        }
    });

    function PlaylistItem({ index, title, isCurrent }) {
        function handleItemPress() {
            TrackPlayer.skip(index);
        }

        return (
            <TouchableOpacity onPress={handleItemPress}>
                <Text
                    style={{
                        ...styles.playlistItem,
                        backgroundColor: isCurrent ? '#666' : 'transparent',
                        color: isCurrent ? '#fff' : '#000'
                    }}>
                    {title}
                </Text>
            </TouchableOpacity>
        );
    }

    return (
        <View>
            <View style={styles.playlist}>
                <FlatList
                    data={queue}
                    renderItem={({ item, index }) => (
                        <PlaylistItem
                            index={index}
                            title={item.title}
                            isCurrent={currentTrack === index}
                        />
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
            <Controls />
        </View>
    );
}

function Controls() {
    const playerState = usePlaybackState();

    async function handlePlayPress() {
        const state = await TrackPlayer.getState();
        if (state === State.Playing) {
            TrackPlayer.pause();
        } else {
            TrackPlayer.play();
        }
    }

    return (
        <View style={styles.controls}>
            <Icon.Button
                name="arrow-left"
                size={28}
                backgroundColor="transparent"
                color="#FF6347"
                onPress={() => TrackPlayer.skipToPrevious()}
            />
            <Icon.Button
                name={playerState === State.Playing ? 'pause' : 'play'}
                size={28}
                backgroundColor="transparent"
                color="#32CD32"
                onPress={handlePlayPress}
            />
            <Icon.Button
                name="arrow-right"
                size={28}
                backgroundColor="transparent"
                color="#FF6347"
                onPress={() => TrackPlayer.skipToNext()}
            />
        </View>
    );
}

function TrackProgress() {
    const { position, duration } = useProgress(200);
    function format(seconds) {
        let mins = (parseInt(seconds / 60)).toString().padStart(2, '0');
        let secs = (Math.trunc(seconds) % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    }
    return (
        <View style={styles.trackProgressContainer}>
            <Text style={styles.trackProgress}>
                {format(position)} / {format(duration)}
            </Text>
            <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={duration}
                minimumTrackTintColor="#1E90FF"
                maximumTrackTintColor="#D3D3D3"
                value={position}
                onValueChange={(value) => TrackPlayer.seekTo(value)}
            />
        </View>
    );
}

function Header() {
    const [info, setInfo] = useState({});
    useEffect(() => {
        setTrackInfo();
    }, []);
    useTrackPlayerEvents([Event.PlaybackTrackChanged], (event) => {
        if (event.state == State.nextTrack) {
            setTrackInfo();
        }
    });
    async function setTrackInfo() {
        const track = await TrackPlayer.getCurrentTrack();
        const info = await TrackPlayer.getTrack(track);
        setInfo(info);
    }
    return (
        <View style={styles.header}>
            <Text style={styles.songTitle}>{info.title}</Text>
            <Text style={styles.artistName}>{info.artist}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F8F8FF', // Thay đổi màu nền thành màu sáng hơn
    },
    playlist: {
        marginTop: 20,
        marginBottom: 20,
    },
    playlistItem: {
        fontSize: 18,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginVertical: 4,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 20,
    },
    trackProgressContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    trackProgress: {
        fontSize: 18,
        color: '#000',
        marginBottom: 10,
    },
    slider: {
        width: 300,
        height: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    songTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    artistName: {
        fontSize: 20,
        color: '#666',
        textAlign: 'center',
    },
});

export default Home;
