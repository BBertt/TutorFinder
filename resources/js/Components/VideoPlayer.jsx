
import React from 'react';
import YouTube from 'react-youtube';

const VideoPlayer = ({ videoUrl, onVideoEnded }) => {
    const getYouTubeVideoId = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);

        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = getYouTubeVideoId(videoUrl);

    const opts = {
        height: '100%',
        width: '100%',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 0,
        },
    };

    return (
        <div className="aspect-w-16 aspect-h-9">
            {videoId ? (
                <YouTube videoId={videoId} opts={opts} onEnd={onVideoEnded} className="w-full h-full" />
            ) : (
                <video className="w-full h-full" controls onEnded={onVideoEnded}>
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            )}
        </div>
    );
};

export default VideoPlayer;
