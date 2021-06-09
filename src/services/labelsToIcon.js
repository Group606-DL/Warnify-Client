

const sensitiveLabels = [
    'Explosion/Fire/Smoke', 'Explosion', 'Riot/Crowded', 'Fighting', 'Gun/Gunshot',
    'Car accident', 'Gunshot_gunfire', 'Civil_defense_siren', 'Abuse', 'Fireworks', 
    'Screaming', 'Shooting'
];

const normalLabels = ['Music/Talking', 'NonViolence', ];

const getSortedLabels = (audioPredictions, videoPredictions) => {
    const videoLabels = videoPredictions.map(pred => pred.label); 
    const audioLabels = audioPredictions.map(pred => pred.label);
    const sensitiveVideoLabels = videoLabels.filter(label => sensitiveLabels.includes(label));
    const sensitiveAudioLabels = audioLabels.filter(label => sensitiveLabels.includes(label));
    
    return {sensitiveAudioLabels, sensitiveVideoLabels, videoLabels, audioLabels};
}

export {getSortedLabels}
