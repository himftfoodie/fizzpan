import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import '../../styles/LoggedinUserInfo.css';

export default function LoggedinUserInfo() {
    return (
        <List sx={{ bgcolor: 'background.paper'}} className='listContainer'>
            <ListItem className='listItemContainer'>
                <ListItemAvatar>
                    <Avatar alt="Admin Image"/>
                </ListItemAvatar>
                <ListItemText primaryTypographyProps={{fontFamily: "'Josefin Sans', sans-serif !important", fontSize:"16px"}} secondaryTypographyProps={{fontFamily: "'Josefin Sans', sans-serif !important", fontSize:"14px"}} primary="Admin" secondary="admin@mail.com" />
            </ListItem>

        </List>
    );
}