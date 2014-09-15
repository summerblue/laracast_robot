#!/usr/bin/env node

var child_process = require('child_process');
var download_string = '';

var fs = require('fs');
var download_link_file = 'storage/download_link.txt';

// This is the video file download dictory
var lesson_dir = '../../Learning/Laravel/Laracasts/Lesson/';

var util = require('util');

var lessen_infos;
var lessens_links_file = "storage/lessen_infos.json";
var cookie_header = '--header=Cookie: ' + '_trak_0303ff918bab012c714b118edfe4ef84a8d22ebb_fo....';
var user_agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:26.0) Gecko/20100101 Firefox/26.0';

function download()
{
    var download_option = [
        cookie_header,
        '--user-agent='+user_agent,
        '--check-certificate=false',
        '--continue=true',
        '--max-concurrent-downloads=5',
        '--input-file='+download_link_file
    ]
    child = child_process.spawn('aria2c', download_option);
    child.stdout.setEncoding('utf8');
    child.stdout.on('data', function(data) 
    {
      console.log(data);
    });
}

lessen_infos = JSON.parse(fs.readFileSync(lessens_links_file, 'utf8'));

for(var key in lessen_infos)
{
    var lesson = lessen_infos[key];
    var lesson_file_name = lesson.Title + '.mp4';
    download_string += lesson.DownloadLink + "\r\n";
    download_string += "\t" + 'out=' + lesson_dir + lesson_file_name + "\r\n";
}

fs.writeFileSync(download_link_file, download_string);

download();
