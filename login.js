#!/usr/bin/env casperjs

var fs             = require('fs');
var cookie_file    = 'storage/cookies.txt';

var login_url      = 'https://laracasts.com/login';
var login_test_url = 'https://laracasts.com/admin/history';
var login_username = 'here is the usrename';
var login_password = 'pasword here';

var casper = require('casper').create
({   
    verbose: true, 
    logLevel: 'debug',
    userAgent: 'Mozilla/5.0 (Windows NT 6.1; rv:17.0) Gecko/20100101 Firefox/17.0',
    pageSettings: {
      loadImages:  false,         // The WebPage instance used by Casper will
      loadPlugins: false         // use these settings
    }
});

phantom.casperTest = true;

casper.start(login_url, function() {

    console.log("------------------------> page loaded");
    this.echo('=====================================>'+this.getTitle());
    
    this.test.assertExists('div#form form', 'Form is found');

    this.fill('div#form form', {
        email: login_username,
        password: login_password,
        remember: 'on'
    }, true);

    this.then(function() {
        console.log('Login From Submitted!');
    });
});

casper.thenOpen(login_test_url, function() {
    this.echo('=====================================>'+this.getTitle());
    this.test.assertExists('div.admin-nav', '√√√√√√√√√√√√√√√√√√√√√ -----> Login Success!');
});

casper.run(function()
{   
    var cookies = JSON.stringify((this.page.cookies)); 
    fs.write(cookie_file, cookies, 'w'); 
    this.exit();    
});
