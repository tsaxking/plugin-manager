import { app, BrowserWindow } from 'electron';


const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
        },
    });

    win.loadFile('./front/dist/index.html');
}


app.whenReady().then(createWindow);