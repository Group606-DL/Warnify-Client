import React, { useEffect, useState } from "react";
import TopMoviesList from "./TopMoviesList";
import ReactPlayer from "react-player";

import warning from "../../assets/warning.png";
import smiley from "../../assets/smiley.png";

import styles from "./TopMovies.module.css";
import Switch from "@material-ui/core/Switch";
import { getSortedLabels } from "../../services/labelsToIcon";
import { Slider } from "@material-ui/core";

const detectionIntervalInSeconds = 5;

const TopMoviesContainer = (props) => {
  const [videoUrl, setVideoUrl] = useState("");
  const [fileLists, setVideoList] = useState([]);
  const [defaultVideos, setDefaultVideos] = useState([]);
  const [allFilePredictions, setAllFilePredictions] = useState({});
  const [selectedItem, setSelectedItem] = useState(fileLists[0]);
  const [iconToShow, setIconToShow] = useState(smiley);
  const [labels, setLabels] = useState({ video: [], audio: [] });
  const [shouldMuteOnWarning, setShouldMuteOnWarning] = useState(false);
  const [shouldCensorOnWarning, setShouldCensorOnWarning] = useState(false);
  const [blur, setBlur] = useState(0.8);
  const [thereIsSensitiveScene, setThereIsSensitiveScene] = useState(false);

  const videos = [];
  let showWarn =
    (selectedItem && selectedItem.isProcessed) || thereIsSensitiveScene;

  useEffect(() => {
    fetch("http://193.106.55.106:8080/videos/names", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((fileList) => {
        setVideoList(fileList);
        setDefaultVideos(fileList);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const getLabels = (fileName) =>
    fetch(`http://193.106.55.106:8080/censoredInfo/${fileName}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((labels) => {
        setAllFilePredictions(JSON.parse(labels));
      })
      .catch((err) => {
        console.error(err);
      });

  const changeSource = (videoDetails) => {
    const encodedFileName = encodeURIComponent(videoDetails.file);
    getLabels(encodedFileName).then(() => {
      setVideoUrl(`http://193.106.55.106:8080/stream/${encodedFileName}`);
      setSelectedItem(videoDetails);
    });
  };

  const onVideoProgress = ({ played, playedSeconds }) =>
    setIconByPlayedCursor(playedSeconds);

  const setIconByPlayedCursor = (cursorInSeconds) => {
    const rounded = Math.round(cursorInSeconds);
    let keyToPull = rounded > detectionIntervalInSeconds ? rounded : 0;
    keyToPull = keyToPull - (keyToPull % detectionIntervalInSeconds);
    if (!allFilePredictions[keyToPull]) {
      return;
    }

    const { audio, video } = allFilePredictions[keyToPull];

    const {
      sensitiveVideoLabels,
      sensitiveAudioLabels,
      audioLabels,
      videoLabels,
    } = getSortedLabels(audio, video);
    if (sensitiveVideoLabels.length > 0 || sensitiveAudioLabels.length > 0) {
      setIconToShow(warning);
      setThereIsSensitiveScene(true);
    } else {
      setIconToShow(smiley);
      setThereIsSensitiveScene(false);
    }

    setLabels({ video: videoLabels, audio: audioLabels });
  };

  const onBlurChange = (ev, newValue) => {
    setBlur(newValue);
  };

  return (
    <div className={styles.container}>
      <div className={styles.iconWrapper}>
        {showWarn && <img src={iconToShow} className={styles.warning} />}
      </div>
      <div className={styles.videoContainer}>
        <ReactPlayer
          url={videoUrl}
          width={"100%"}
          onProgress={showWarn && onVideoProgress}
          style={
            shouldCensorOnWarning &&
            showWarn &&
            thereIsSensitiveScene && { filter: `blur(${blur}px)` }
          }
          progressInterval={1000}
          onSeek={showWarn && setIconByPlayedCursor}
          muted={shouldMuteOnWarning && iconToShow === warning}
          controls
        />
      </div>

      <div className={styles.bottomPanel}>
        <div className={styles.options}>
          <div>
            <label style={{ color: "white", marginRight: "10px" }}>
              Mute On Warning
            </label>
            <Switch
              checked={shouldMuteOnWarning}
              onChange={(evt) => setShouldMuteOnWarning(evt.target.checked)}
            />
          </div>
          <div>
            <label style={{ color: "white", marginRight: "10px" }}>
              Censor On Warning
            </label>
            <Switch
              checked={shouldCensorOnWarning}
              onChange={(evt) => setShouldCensorOnWarning(evt.target.checked)}
            />
            <div>
              <label
                style={{
                  color: "white",
                  marginRight: "10px",
                  textAlign: "left",
                }}
              >
                Blur ratio
              </label>
              <span style={{ color: "white" }}>
                <span>{blur}</span>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <span>0</span>
                  <Slider
                    min={0}
                    max={15}
                    step={1}
                    value={blur}
                    onChange={onBlurChange}
                  />
                  <span>15</span>
                </div>
              </span>
            </div>
            <div>
              <input
                className={styles.searchTxt}
                placeholder={"Search..."}
                onChange={(e) => {
                  setVideoList(
                    defaultVideos.filter((file) =>
                      file.file.includes(e.target.value)
                    )
                  );
                }}
              />
            </div>
          </div>
        </div>
        <TopMoviesList
          list={fileLists}
          selectedItem={selectedItem}
          onItemSelected={changeSource}
        />
        <div
          style={{
            marginTop: "10px",
            color: "white",
            maxWidth: "20%",
            overflowWrap: "break-word",
            width: "20%",
          }}
        >
          {labels && labels.audio && labels.audio.length > 0 && (
            <div>
              <div>
                <b>Audio: </b>
              </div>
              {<span>{labels.audio.join(", ")}</span>}
              <hr />
            </div>
          )}

          {labels && labels.video && labels.video.length > 0 && (
            <div>
              <div>
                <b>Video: </b>
              </div>
              {<span>{labels.video.join(", ")}</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopMoviesContainer;
