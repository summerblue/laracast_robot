#!/usr/bin/env node

var child_process = require('child_process');
var fs = require('fs');
var util = require('util');
var download_link_file = 'storage/series_download_link.txt';

var cookie_header = '--header=Cookie: '+'_trak_0303ff918bab012c714b118edfe4ef84a8d22ebb_foo=; ...';
var user_agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:26.0) Gecko/20100101 Firefox/26.0';

function download()
{
    var download_option = [
        cookie_header,
        '--user-agent='+user_agent,
        '--check-certificate=false',
        '--continue=true',
        '--max-concurrent-downloads=2',
        '--input-file='+download_link_file
    ]
    child = child_process.spawn('aria2c', download_option);
    child.stdout.setEncoding('utf8');
    child.stdout.on('data', function(data) 
    {
      console.log(data);
    });
}

download();
