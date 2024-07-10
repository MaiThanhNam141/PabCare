import React, { createContext, useState, useEffect } from 'react';
import { Songs } from '../../data/Link';
import { getUserInfo } from '../firebase/handleFirestore';
const MusicContext = createContext();

const songs = [
  { title: 'Track1', file: Songs.Track1 },
  { title: 'Miko Alarm', file: Songs.MikoAlarm },
  { title: 'Yoyoyo', file: Songs.yoyoyo },
  { title: 'Windy Hill', file: Songs.WindyHill },
  { title: 'A Town Ocean View', file: Songs.ATownWithAnOceanView },
];

const MusicProvider = ({ children }) => {
  const [currentSongContext, setCurrentSongContext] = useState(null);
  const [isPlayingSong, setIsPlayingSong] = useState(true);
  const [roll, setRoll] = useState(false);

  const rollSongs = () => {
    const filteredSongs = songs.filter(song => song.title !== currentSongContext.title);
    return filteredSongs[Math.floor(Math.random() * filteredSongs.length)];
  }

  useEffect(() => {
    if (roll && currentSongContext) {
      const randomSong = rollSongs();
      setCurrentSongContext(randomSong);
      setRoll(false);
    }
  }, [roll]);

  useEffect(() => {
    const getFavor = async () => {
      const snapshot = await getUserInfo();
      if (snapshot) {
        const index = snapshot.favor || 0;
        setCurrentSongContext(songs[index]);
      }
    }
    getFavor();
  }, []);

  // Ensure currentSongContext is set before rendering children
  if (currentSongContext === null) {
    return null; // or a loading spinner
  }

  return (
    <MusicContext.Provider value={{ currentSongContext, setCurrentSongContext, isPlayingSong, setIsPlayingSong, roll, setRoll }}>
      {children}
    </MusicContext.Provider>
  );
};

export { MusicContext, MusicProvider };
