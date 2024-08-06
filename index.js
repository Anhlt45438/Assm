/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './Appmaster';
import {name as appName} from './app.json';
import TrackPlayer from 'react-native-track-player';
import { playbackService } from './trackPlayerServices';

AppRegistry.registerComponent(appName, () => App);

TrackPlayer.registerPlaybackService(() => playbackService);