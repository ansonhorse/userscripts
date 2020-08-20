// ==UserScript==
// @name         jdcloud工具
// @namespace    https://wx.jdcloud.com
// @version      0.1
// @description  解析测试页面的响应数据，方便查看
// @author       Anxon
// @match        https://wx.jdcloud.com/gwtest/init/*
// @grant        unsafeWindow
// ==/UserScript==

(function() {
    'use strict';
    function parse() {
        const el = document.querySelector('#testResultPre')

        const tips = '[parsed by `jdcloud工具`]'
        if (el.textContent.indexOf(tips) >= 0) {
            return
        }
       
        let content = el.textContent.trim()
        if (content === '') {
            return
        }
        content = content.substr(content.indexOf('Body：') + 5).trim()
        const data = JSON.parse(content)
        data.result.ret_body = JSON.parse(data.result.ret_body)

        el.textContent = tips + "\n\n" + JSON.stringify(data, null, 2)

        console.log('jdcloud response', data)
        console.info('接口响应数据已解析并赋值到`jdata`')
        unsafeWindow.jdata = data
    }

    function monitor() {
        setInterval(() => {
            parse()
        }, 2e3)
    }

    console.log('>>>', unsafeWindow)

    monitor()
})();
