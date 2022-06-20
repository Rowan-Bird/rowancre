
$('body').terminal({
    cat: function(width, height) {
        const img = $('<img src="https://placekitten.com/' +
                      width + '/' + height + '">');
        img.on('load', this.resume);
        this.pause();
        this.echo(img);
    },
        echo: function(echo) {
        this.echo(echo);
    },
    cmd: function() {
        this.echo('RowanCrE Windows [Version 5.1.0.3017-1]\n<c> 2022 RowanCrE. You have the rights\n');
    },
    cd: function(path) {
        this.echo(path + ' Does not exist');
    },
    fs: function() {
        MonsterBrowser();
    },
}, {
    greetings: 'RowanCrE Windows [Version 5.1.0.3017-1]\n<c> 2022 RowanCrE. You have the rights\n'
});