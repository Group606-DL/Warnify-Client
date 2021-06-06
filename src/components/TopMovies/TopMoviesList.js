import React from "react";
import {List} from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import MovieFilterIcon from "@material-ui/icons/MovieFilter";
import AudiotrackIcon from "@material-ui/icons/Audiotrack";

import styles from "./TopMovies.module.css";

function format(time) {
    // Hours, minutes and seconds
    var hrs = ~~(time / 3600);
    var mins = ~~((time % 3600) / 60);
    var secs = ~~time % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";
    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }
    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}

const TopMoviesList = ({list, selectedItem, onItemSelected}) => {

    const onListItemClick = (itemDetails) => () => onItemSelected(itemDetails);

    return (
        <div className={styles.listContainer}>
            <List className={styles.list}>
                {list.map((item, index) => {
                    const primary = <span className={styles.listItemText}>{item.file}</span>
                    const secondary = (
                        <span className={styles.listItemText}>
                            {format(item.duration)}
                            <br/>
                            {!item.isProcessed ? 'In process...' : ''}
                        </span>
                    );
                    const itemClassName = selectedItem === item ? styles.selectedListItem : styles.listItem;

                    return (
                        <ListItem key={index} button classes={{root: itemClassName}}
                                  onClick={onListItemClick(item)}>
                            <ListItemAvatar><Avatar><MovieFilterIcon/></Avatar></ListItemAvatar>
                            <ListItemText primary={primary} secondary={secondary}/>
                        </ListItem>
                    )
                })}
            </List>
        </div>
    );
}

export default TopMoviesList;
