import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

const TRACK_QUERY_TEMPLATE = 'https://itunes.apple.com/lookup?id={collectionId}&limit=50&entity=song'

export default function TrackList({setAlertMessage}) { //setAlertMessage callback as prop
  const [trackData, setTrackData] = useState([]); //tracks to show
  const [isQuerying, setIsQuerying] = useState(false); //for spinner
  const [previewAudio, setPreviewAudio] = useState(null); //for playing previews!

  const urlParams = useParams(); //get album from URL
  const { collectionId } = urlParams;
  //YOUR CODE GOES HERE
  useEffect(() => {
    setIsQuerying(true); // Start the spinner
    setAlertMessage(null); // Clear any previous error messages

    const trackUrl = TRACK_QUERY_TEMPLATE.replace('{collectionId}', encodeURIComponent(collectionId));

    fetch(trackUrl)
      .then(response => response.json())
      .then(data => {
        if (data.resultCount === 0 || !data.results || data.results.length <= 1) {
          throw new Error('No tracks found for album.');
        }
        setTrackData(data.results.slice(1)); // Assume the first result is album info and exclude it
      })
      .catch(error => {
        setAlertMessage(error.message); 
      })
      .finally(() => {
        setIsQuerying(false); // Stop the spinner
      });
  }, [collectionId, setAlertMessage]);



  //for fun: allow for clicking to play preview audio!
  const togglePlayingPreview = (previewUrl) => {
    if(!previewAudio) { //nothing playing now
      const newPreview = new Audio(previewUrl);
      newPreview.addEventListener('ended', () => setPreviewAudio(null)) //stop on end
      setPreviewAudio(newPreview); //rerender and save
      newPreview.play(); //also start playing
    } else {
      previewAudio.pause(); //stop whatever is currently playing
      setPreviewAudio(null); //remove it
    }
  }

  //sort by track number
  trackData.sort((trackA, trackB) => trackA.trackNumber - trackB.trackNumber)

  //render the track elements
  const trackElemArray = trackData.map((track) => {
    let classList = "track-record";
    if(previewAudio && previewAudio.src === track.previewUrl){
      classList += " fa-spin"; //spin if previewing
    }

    return (
      <div key={track.trackId}>
        <div role="button" className={classList} onClick={() => togglePlayingPreview(track.previewUrl)}>
          <p className="track-name">{track.trackName}</p>
          <p className="track-artist">({track.artistName})</p>
        </div>
        <p className="text-center">Track {track.trackNumber}</p>
      </div>      
    )
  })

  return (
    <div>
      {isQuerying && <FontAwesomeIcon icon={faSpinner} spin size="4x" aria-label="Loading..." aria-hidden="false"/>}
      <div className="d-flex flex-wrap">
        {trackElemArray}
      </div>
    </div>
  )
}
