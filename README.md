# moon
A linux-like terminal emulator written in Runtime Script

## Web
[https://yjlo123.github.io/moon/](https://yjlo123.github.io/moon/)

## Architecture
<p align="center">
    <img alt="arch" src="https://github.com/yjlo123/moon/blob/master/arch.png?raw=true" width="500">
</p>

## Local Setup
### Add hosts
```
127.0.0.1 local.siwei.dev
```

### Create local CA & cert
```
brew install mkcert
mkcert -install
mkcert local.siwei.dev
```
move certificate and key files to `<project_path>/localcert/`

### Start local server
```
node server.mjs
```

## macOS & Windows
[VM](https://github.com/yjlo123/runtime-go)  
[Moon OS source](https://raw.githubusercontent.com/yjlo123/moon/master/dist/program.runtime)  

Note: GUI is not maintained.

### macOS
- Right click on the VM app, select `Show Package Contents`
- Go to `Contents/MacOS/src`
- Replace the `program.runtime` file with the downloaded source file. (File name should not be changed)
- Restart the VM app

### Windows
- Create a folder `src` in the same directory as the VM program
- Put the downloaded source file in the `src` folder
- Restart the VM program
