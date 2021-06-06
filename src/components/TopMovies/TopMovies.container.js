import React, {useEffect, useState} from "react";
import TopMoviesList from "./TopMoviesList";
import ReactPlayer from "react-player";

import warning from "../../assets/warning.png";
import smiley from "../../assets/smiley.png";

import styles from "./TopMovies.module.css";
import getIconFromLabels from "../../services/labelsToIcon";
import Switch from "@material-ui/core/Switch";

const detectionIntervalInSeconds = 5;

const TopMoviesContainer = (props) => {
    const [videoUrl, setVideoUrl] = useState('');
    const [fileLists, setVideoList] = useState([]);
    const [videoLabels, setVideoLabels] = useState({});
    const [selectedItem, setSelectedItem] = useState(fileLists[0]);
    const [iconToShow, setIconToShow] = useState(smiley);
    const [shouldMuteOnWarning, setShouldMuteOnWarning] = useState(false);
    // const [isPlaying, setIsPlaying] = useState(false);

    const showWarn = selectedItem && selectedItem.isProcessed;

    useEffect(() => {
        fetch('http://localhost:8080/videos/names', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            return res.json();
        }).then((fileList) => {
            setVideoList(fileList);
        }).catch(err => {
            console.error(err);
        });
    }, []);

    const getLabels = (fileName) => (
        fetch(`http://localhost:8080/censoredInfo/${fileName}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            return res.json();
        }).then((labels) => {
            setVideoLabels(JSON.parse(labels));
        }).catch(err => {
            console.error(err);
        })
    );

    const changeSource = (videoDetails) => {
        const encodedFileName = encodeURIComponent(videoDetails.file);
        getLabels(encodedFileName).then(() => {
            setVideoUrl(`http://localhost:8080/stream/${encodedFileName}`);
            setSelectedItem(videoDetails);
        });
    }

    const onVideoProgress = ({played, playedSeconds}) => setIconByPlayedCursor(playedSeconds);

    const setIconByPlayedCursor = (cursorInSeconds) => {
        const rounded = Math.round(cursorInSeconds);
        let keyToPull = rounded > detectionIntervalInSeconds ? rounded : 0;
        keyToPull = keyToPull - (keyToPull % detectionIntervalInSeconds);
        console.log({keyToPull, cursorInSeconds});
        const {audio, video} = videoLabels[keyToPull];
        setIconToShow(getIconFromLabels(audio, video));
    }

    return (
        <div className={styles.container}>
            { showWarn && <img src={iconToShow} className={styles.warning}/> }
            <ReactPlayer url={videoUrl} width={'100%'} onProgress={showWarn && onVideoProgress}
                         progressInterval={1000}
                         onSeek={showWarn && setIconByPlayedCursor}
                         muted={shouldMuteOnWarning && iconToShow === warning}
                         controls
            />
            <div className={styles.bottomPanel}>
                <div>
                    <div>
                        <label style={{color: 'white', marginRight: '10px'}}>Mute On Warning</label>
                        <Switch checked={shouldMuteOnWarning} onChange={(evt) => setShouldMuteOnWarning(evt.target.checked)}/>
                    </div>
                </div>
                <TopMoviesList list={fileLists} selectedItem={selectedItem} onItemSelected={changeSource}/>
            </div>
        </div>
    )
};

export default TopMoviesContainer;
