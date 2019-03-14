module.exports = {
    theme: 'reco',
    base: '/',
    title: '渣渣辉',
    description: '渣渣辉的博客',
    head: [
        ['link', {
            rel: 'icon',
            href: './favicon.ico'
        }],
        [
            "meta",
            {
                name: "viewport",
                content: "width=device-width,initial-scale=1,user-scalable=no"
            }
        ]
    ],
    markdown: {
        lineNumbers: true //代码块显示行号
    },
    configureWebpack: {
        resolve: {
            alias: {
                '@alias': './assets/'
            }
        }
    },
    themeConfig: {
        // valine
        valineConfig: {
            appId: 'u82dyrvnOHCVMj15QfU4HPvb-gzGzoHsz', // your appId
            appKey: '3T6duRFNFwGB88qoeycPO8Io', // your appKey
        },
        nav: [{
                text: "首页",
                icon: "reco-home",
                link: "/"
            },
            {
                text: "文章",
                icon: "reco-category",
                items: [{
                    text: "taro",
                    link: "/taro/",
                }, {
                    text: "mpvue",
                    link: "/mpvue/"
                }]
            }, {
                text: "标签",
                icon: "reco-tag",
                link: "/tags/"
            }, {
                text: "关于",
                icon: "reco-account",
                link: "/about/"
            }, {
                text: "GitHub",
                icon: "reco-github",
                link: "https://github.com/zyh9"
            }
        ],
        sidebar: {
            "/taro/": [{
                title: "taro",
                collapsable: true,
                children: [
                    "taro踩坑之旅"
                ]
            }],
            "/mpvue/": [{
                title: "mpvue",
                collapsable: true,
                children: [
                    "mpvue踩坑之旅"
                ]
            }]
        },
        search: true, //内置搜索
        searchMaxSuggestions: 10, //结果数量
        lastUpdated: 'Last Updated', //最后更新时间
    }
}