var Nav = require('./config/nav.js');
var Sidebar = require('./config/sidebar.js');
module.exports = {
    base: '/demo-vuepress/',
    title: 'yt46767\'s Blog',
    // description: '学习、思考、实践、感悟”本就是一个从学而思到思而践，再到践而悟的螺旋式上升、循环往复的过程，是永无止境的。',
    themeConfig: {
        repo: 'https://github.com/yt46767/my-blog-vuepress',
        repoLabel: 'My GitHub', // 自定义仓库链接文字。
        nav: Nav,
        sidebar: Sidebar,
        sidebarDepth: 2,
        lastUpdated: 'Last Updated',
    },
    serviceWorker: true,
    searchMaxSuggestions: 10, // 内置搜索框显示的搜索提示数量
    head: [
        [ 'link', {rel: 'shortcut icon apple-touch-icon', href: 'favicon.ico' } ],
        // ['link', { rel: 'manifest', href: '/manifest.json' }],
        ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' }],
    ],
}