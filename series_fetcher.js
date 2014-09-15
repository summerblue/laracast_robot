#!/usr/bin/env casperjs

var fs = require('fs');
var lessen_infos = new_lessen_infos = [];

var lesson_dir = 'storage/Laracasts/Series/';
var download_link_file = 'storage/series_download_link.txt';
var series_name;

var casper = require('casper').create
({   
    verbose: true, 
    // logLevel: 'debug',
    logLevel: 'error',
    userAgent: 'Mozilla/5.0 (Windows NT 6.1; rv:17.0) Gecko/20100101 Firefox/17.0',
    pageSettings: {
      loadImages:  false,         // The WebPage instance used by Casper will
      loadPlugins: false         // use these settings
    }
});

phantom.casperTest = true;

// get course from command line
series_url = casper.cli.options.series;
if (!series_url) {
    casper.log('Usage: "casperjs series_fetcher.js --web-security=no --series=https://laracasts.com/series/whats-new-in-laravel-5" ', 'error');
    casper.exit();
} else {
    console.log('Download Series: ');
    require("utils").dump(series_url);
    console.log('Fetching information... ');
}

function get_lessen_infos() 
{
    var articles = [];
    $("table.episode-outline tr.episode-wrap").each(function(index){
        var article = {};
        var title = $(this).find('.episode-title a').text().replace(/(\r\n|\n|\r)/gm,"").replace(/\s+/g, ' ').trim();
        article['Title'] = $(this).find('.episode-index').text().trim() + '.' + title;
        article['CourseLink'] = "https://laracasts.com" + $(this).find('.episode-title a').attr('href');
        article['DownloadLink'] = '';
        articles.push(article);
    });
    return articles;
}
function get_lessen_link()
{
    return $("li#playback-rate").prev().find("a").attr("href");
}
function get_lessen_title()
{
    return $("h1.lesson-title").text().trim();
}

casper.start(series_url, function() {

    console.log("------------------------> page loaded");
    series_name = this.getTitle();
    this.echo('=====================================>'+this.getTitle());
    
    lessen_infos = this.evaluate(get_lessen_infos);
    // console.log(lessen_infos);
    require("utils").dump(lessen_infos);
    
    console.log('Beginning to get lesson download links ... ');

    this.each(lessen_infos, function(self, lesson) 
    {
        self.thenOpen(lesson.CourseLink, function() {
            
            console.log('Current Lesson: '+lesson.Title);
            console.log(' - Request Url:: '+lesson.CourseLink);

            lesson.DownloadLink = 'https://laracasts.com' + this.evaluate(get_lessen_link);
            console.log(' - Download Link is: ' + lesson.DownloadLink);
            new_lessen_infos.push(lesson);
            console.log(' ');
        });
    })

});

// -------------------------------------------------------------
// --------------------  Sorting Out the Download Link ---------
// -------------------------------------------------------------

casper.then(function() 
{
    var download_string = '';
    for(var key in new_lessen_infos)
    {
        var lesson = new_lessen_infos[key];
        var lesson_file_name = lesson.Title + '.mp4';
        download_string += lesson.DownloadLink + "\r\n";
        download_string += "\t" + 'out=' + lesson_dir  + series_name + '/' + lesson_file_name + "\r\n";
    }

    fs.write(download_link_file, download_string, 'w');

    console.log("Lessons Data: ");
    require('utils').dump(new_lessen_infos);
});


casper.run();
