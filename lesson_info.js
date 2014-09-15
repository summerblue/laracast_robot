
var fs = require('fs');

var lessen_infos;
var new_lessen_infos = [];

var lessens_links_file = "storage/lessen_infos.json";

var casper = require('casper').create
({ 
    // verbose: true, 
    // logLevel: 'info',
    waitTimeout: 30000,
    // clientScripts: ["jquery.js"],
    pageSettings: {
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36',
        loadImages:  false,         // The WebPage instance used by Casper will
        loadPlugins: false          // use these settings
    }
});

// check lessen_infos file
if (fs.exists(lessens_links_file)) {
    lessen_infos = JSON.parse(fs.read(lessens_links_file));
} else {
    casper.log('Info file cannot be found, make sure you run fetch_course_info.js first.', 'error');
    casper.exit();
}

function get_lessen_link()
{
    return $("li#playback-rate").prev().find("a").attr("href");
}

// enabling the for testing
phantom.casperTest = true;

casper.start().each(lessen_infos, function(self, lesson) 
{
    self.thenOpen(lesson.CourseLink, function() {
        
        console.log('Current Lesson: '+lesson.Title);
        console.log(' - Request Url:: '+lesson.CourseLink);

        var link = this.evaluate(get_lessen_link);
        lesson.DownloadLink = 'https://laracasts.com' + link;
        
        console.log(' - Download Link is: ' + lesson.DownloadLink);
        new_lessen_infos.push(lesson);
        console.log(' ');
    });
})

casper.then(function() 
{
    fs.write(lessens_links_file, JSON.stringify(new_lessen_infos), 'w');
    console.log("Lessons Data: ");
    require('utils').dump(new_lessen_infos);
});

casper.run();

