import React from 'react';

import { List, ListItem, ListItemSecondaryAction, ListItemText, ListSubheader, MenuItem, Popover, Select, Switch, TextField, Typography } from '@material-ui/core';

export default function Settings () {
    // @ts-ignore: When loading the app we've already ensured userSettings is going to be JSON
    const [settings, setSettings] = React.useState(JSON.parse(window.localStorage.getItem('userSettings')));

    const [anchorEl, setAnchorEl]: [any[], any] = React.useState([null]);
    const [activePopover, setActivePopover] = React.useState(-1);

    const devState = window.unigraph.getState('settings/developerMode');
    const [devMode, setDevMode] = React.useState(devState.value);
    devState.subscribe((newState: boolean) => setDevMode(newState));

    const analyticsState = window.unigraph.getState('settings/enableAnalytics');
    const [analyticsMode, setAnalyticsMode] = React.useState(analyticsState.value);
    analyticsState.subscribe((newState: boolean) => setAnalyticsMode(newState));

    const handleClick = (event: any, n: number) => {
        let total = anchorEl; total[n] = event.currentTarget;
        setAnchorEl(total);
        setActivePopover(n);
    };

    const handleWindowSelection = (value: string) => {
        let newSettings = {...settings, newWindow: value};
        setSettings(newSettings)
        window.localStorage.setItem('userSettings', JSON.stringify(newSettings));
    }

    const handleClose = () => {
        setAnchorEl([null]);
        window.localStorage.setItem('userSettings', JSON.stringify(settings));
        setActivePopover(-1);
    };

    //const id0 = Boolean(anchorEl[0]) ? 'address-popover' : undefined;
    //console.log(Boolean(anchorEl[0]))
    return <div>
        <Typography variant="h4">Settings</Typography>
        <p>These setting will be stored in your browser. </p>
        <List>
            <ListSubheader component="div" id="nested-list-subheader" key="connectionsettings">
            Connection
            </ListSubheader>
            <ListItem button onClick={(e) => handleClick(e, 0)} key="connection">
                <ListItemText primary="Server address" secondary={`Current address: ${settings.serverLocation}`}/>
            </ListItem>
            <ListSubheader component="div" id="nested-list-subheader" key="window">
            Window Management
            </ListSubheader>
            <ListItem button onClick={e => {}} key="newwindow">
                <ListItemText id="switch-list-label-new-window" primary="New window options" secondary="Choose the behavior when a new window is opened." />
                <ListItemSecondaryAction>
                    <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={settings['newWindow'] ? settings['newWindow']: "new-tab"}
                        onChange={(event) => handleWindowSelection(event.target.value as string)}
                        label="new-window"
                    >
                        <MenuItem value={"new-tab"}>Open in new tab</MenuItem>
                        <MenuItem value={"new-pane"}>Open in new pane side by side</MenuItem>
                        <MenuItem value={"new-popout"}>Open in new popout window</MenuItem>
                    </Select>
                </ListItemSecondaryAction>
            </ListItem>
            <ListItem button onClick={e => {}} key="analytics">
                <ListItemText id="switch-list-label-analytics-mode" primary="Enable analytics" secondary="Opt-in to analytics with mixpanel" />
                <ListItemSecondaryAction>
                    <Switch
                        edge="end"
                        onChange={(e) => {analyticsState.setValue(!analyticsMode)}}
                        checked={analyticsMode}
                        inputProps={{ 'aria-labelledby': 'switch-list-label-developer-mode' }}
                    />
                </ListItemSecondaryAction>
            </ListItem>
            <ListSubheader component="div" id="nested-list-subheader" key="developers">
            Developers
            </ListSubheader>
            <ListItem button onClick={e => {}} key="developermode">
                <ListItemText id="switch-list-label-developer-mode" primary="Developer mode" secondary="Enable utilities about Unigraph for developers." />
                <ListItemSecondaryAction>
                    <Switch
                        edge="end"
                        onChange={(e) => {devState.setValue(!devMode)}}
                        checked={devMode}
                        inputProps={{ 'aria-labelledby': 'switch-list-label-developer-mode' }}
                    />
                </ListItemSecondaryAction>
            </ListItem>
            <ListSubheader component="div" id="nested-list-subheader" key="settingsapp">
            App Settings
            </ListSubheader>
            <ListItem button onClick={e => {window.wsnavigator("/settings/twitter")}} key="twitter">
                <ListItemText id="switch-list-label-developer-mode" primary="Twitter settings" secondary="Connect your Twitter account to Unigraph" />
            </ListItem>
            <ListItem button onClick={e => {window.wsnavigator("/settings/reddit")}} key="reddit">
                <ListItemText id="switch-list-label-developer-mode" primary="Reddit settings" secondary="Connect your Reddit account to Unigraph" />
            </ListItem>
            <ListItem button onClick={e => {window.wsnavigator("/settings/email")}} key="email">
                <ListItemText id="switch-list-label-developer-mode" primary="Email settings" secondary="Connect your email inboxes to Unigraph" />
            </ListItem>
        </List>
        <Popover
            id={JSON.stringify(activePopover)}
            open={activePopover === 0}
            anchorEl={anchorEl[0]}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left', }}
            transformOrigin={{ vertical: 'top', horizontal: 'left', }}
        >
            <TextField label="New server address:" value={settings.serverLocation} onChange={(event) => {
                let newSettings = {...settings};
                newSettings.serverLocation = event.target.value;
                setSettings(newSettings);
            }}/>
        </Popover>
    </div>
}