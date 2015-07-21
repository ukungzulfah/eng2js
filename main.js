eng.config('$config', {
    defaultPage: 'page/index.html'
})
.module('$menu', function(){
    this.left = eng.getJSON('menu.json');
})
.factory('$app', function($config, $menu){
    return {
        menu: $menu,
        config: $config
    };
})

.controller('menu', function($root, $app){
    $root.menus = $app.menu.left;
    $root.gotopage = function(page){
        $app.config.rootPage.page = 'page' + (page=='/'?'/index':page) + '.html';
        $app.config.rootPage.$reload();
    };
})

.controller('page', function($root, $app){
    $app.config.rootPage = $root;
    $root.page = $app.config.defaultPage;
})

