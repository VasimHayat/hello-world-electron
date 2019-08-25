const electron = require('electron');
const { app, BrowserWindow ,Menu , ipcMain} =electron;
const url = require('url') 
const path = require('path') 

let win;
let addWin;
function createAddWindow(){
    addWin = new BrowserWindow({ 
        height:400,
        width:400,
        webPreferences: {
            nodeIntegration: true
            }
    })

    addWin.loadURL(url.format ({ 
        pathname: path.join(__dirname, 'addItem.html'), 
        protocol: 'file:', 
        slashes: true 
    })) 
    addWin.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        addWin = null
    })
}
function createWindow () {
            // Create the browser window.
            win = new BrowserWindow({ 
                webPreferences: {
                nodeIntegration: true
                }
            })

            win.loadURL(url.format ({ 
                pathname: path.join(__dirname, 'index.html'), 
                protocol: 'file:', 
                slashes: true 
            }))

           
            const mainMenu = Menu.buildFromTemplate(menuTemplate);
            Menu.setApplicationMenu(mainMenu);
            
            
            // Open the DevTools.
            win.webContents.openDevTools();


            // Emitted when the window is closed.
            win.on('closed', () => {
                // Dereference the window object, usually you would store windows
                // in an array if your app supports multi windows, this is the time
                // when you should delete the corresponding element.
                win = null
            })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

ipcMain.on("item:add",function(e,item){
   win.webContents.send('item:add',item); 
    addWin.close();
})

const menuTemplate = [
    {
        label:'File',
        submenu:[
            {
                label:'Add Item',
                click(){
                    createAddWindow();
                }
            },
            
            {
                label:'Clear Item',
                click(){
                    win.webContents.send("item:clear");
                }
            },
            
            {
                label:'Exit',
                click(){
                    app.quit();
                }
            }
        ]
    },
    {
        label:'DevTools',
        submenu:[
            {
               role:'reload'
            },
            
            {
                label:'Toogle Devtool',
                click(item,focusWin){
                    focusWin.toggleDevTools()
                }
            }
        ]
    }
]

