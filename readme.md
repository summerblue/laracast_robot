
## Introduction

	This is little script for download video from http://www.laracasts.com/. 

## Requirements

Reqirements: 

* nodejs
* caspterjs - Headless browser
* aria2  - Powerfull command line downloader

### Install nodejs

	➜ brew update
	➜ brew install node

### Install caspterjs

	➜ brew install casperjs

### Install aria2 

	➜ brew install aria2

## Usage: Downloading Lessons

> Please follow the steps. 

### 1. Fetching all the lessons info.

	casperjs lesson_pager.js

### 2. Collecting download links.

	casperjs lesson_info.js

### 3. Configurate the lesson_downloader.js file

The website will check for user login credential, we must setting up the cookie for downloader `aria2`;

#### 1). Get the cookie string

1. Open Chrome Broswer link -> http://www.laracasts.com/ and login;
2. Using chrome debuger -> network, refresh the page, click for request detail, copy the cookie string;
3. Paste it onto the following link in `lesson_downloader.js` file:

```
var cookie_header = '--header=Cookie: ' + 'PASTE THE COOKE HERE';
```

#### 2). Modifiy the download destination folder


```
// This is the video file download dictory
var lesson_dir = '../../Learning/Laravel/Laracasts/Lesson/';
```

### 4. Start the download

	node lesson_downloader.js


## Usage: Downloading Series 

### 1. Gathering series info

```
casperjs series_fetcher.js --web-security=no --series=https://laracasts.com/series/whats-new-in-laravel-5
```
### 2. Configurate the series_downloader.js file

Just like [before](#3-configurate-the-lesson_downloaderjs-file).

### 3. Start the download

	node series_downloader.js 


