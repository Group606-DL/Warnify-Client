import warning from "../assets/warning.png";
import smiley from "../assets/smiley.png";

const labelToIcon = (labelName) => {
    switch (labelName) {
        case 'Explosion/Fire/Smoke':
            return warning;
        case 'Music/Talking':
            return smiley;
        case 'Explosion': 
            return warning;
        case 'Riot/Crowded':
            return warning;
        default:
            return smiley;
    }
}

const getIconFromLabels = (audioLabels, videoLabels) => {
    const audioMostDominant = audioLabels.sort((a,b) => a.pred - b.pred)[0];
    const videoMostDominant = videoLabels.sort((a,b) => a.pred - b.pred)[0];
    
    if (audioMostDominant == null && videoMostDominant == null) {
        return smiley;
    }
    
    const audioPred = audioMostDominant ? audioMostDominant.pred : 0;
    const videoPred = videoMostDominant ? videoMostDominant.pred : 0;
    
    let icon;
    
    if (audioPred > videoPred) {
        icon = labelToIcon(audioMostDominant.label);    
    } else {
        icon = labelToIcon(videoMostDominant.label);
    }
    
    return icon;
}

export default getIconFromLabels;
