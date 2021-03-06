setTimeout(() => {
    ipcRenderer.send('test', 'ping');
}, 5000);

ipcRenderer.on('reply', (e, args) => {
    console.log(e, args);
});
