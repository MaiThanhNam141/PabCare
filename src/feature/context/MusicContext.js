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
  const [remainingSongs, setRemainingSongs] = useState([...songs]);

  const rollSongs = () => {
    if(!remainingSongs.length){
      setRemainingSongs([...songs]);
    }
    const filteredSongs = remainingSongs.filter(song => song.title !== currentSongContext.title);
    const randomSong = filteredSongs[Math.floor(Math.random() * filteredSongs.length)];

    setRemainingSongs(prev => prev.filter(song => song.title !== randomSong.title));
    return randomSong;
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
      try {
        const snapshot = await getUserInfo();
        if (snapshot) {
          const title = snapshot.favor || "Track1";
          const index = songs.findIndex(song => song.title === title);
          setCurrentSongContext(songs[index]);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    }
    getFavor();
  }, []);

  if (currentSongContext === null) {
    return null;
  }

  return (
    <MusicContext.Provider value={{ currentSongContext, setCurrentSongContext, isPlayingSong, setIsPlayingSong, roll, setRoll }}>
      {children}
    </MusicContext.Provider>
  );
};

export { MusicContext, MusicProvider };
