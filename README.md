# Document Management System

## Pre-requirements
1. Docker
   
## Run the Application
```bash
$ cd <project-folder>
$ docker build -t dmapi --no-cache .
$ docker-compose -f docker-compose.yaml up -d
```
## APIs
> Note: This apis tested in Postman
### Register
_*(POST)*_ http://localhost:5000/register
...Body Args:  userName,Password
___

### Login
_*(POST)*_ http://localhost:5000/login

Body Args:  userName,Password

> Note: For all remaining apis you need to add a bearer token that is returned form the Login request as authorization:Bearer _token-from-login_ in Headers
___
### Create Folder
_*(POST)*_ http://localhost:5000/dms/createFolder

Body Args:  folderName
___
### Add File

_*(POST)*_ http://localhost:5000/dms/addFile


Body Args:  folderName _( Optional, if entered then file stores in folder else as direct files)_

file _( 1 file)_
___
### Move File

_*(POST)*_ http://localhost:5000/dms/moveFile


Body Args:  srcFile _( File Name to be moved)_

srcFolder _( optional , If enteres moves file from this folder)_

destFolder _(optional, If entered moves file to this folder)_
___

### List 

_*(GET)*_ http://localhost:5000/dms/list
___

### Files in Folder 
_*(GET)*_ http://localhost:5000/dms/filesInFolder?folderName=_folder-Name_
___

### File
_*(GET)*_ http://localhost:5000/dms/file   ( returns the file)_

Query params: folderName _(Optional, if entered returns file form folder)_

fileName 
___

