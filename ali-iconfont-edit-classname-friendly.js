// ==UserScript==
// @name         iconfont.cn无刷新修改Font Class
// @namespace    https://ansonhorse.github.io/
// @version      0.1
// @description  iconfont.cn无刷新修改Font Class
// @author       Anxon
// @match        http://www.iconfont.cn/manage/index*
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict'

    /**
     * 获取csrf-ctoken
     *
     * @returns {String}
     */
    function getCsrfToken() {
        return $('meta[name="csrf-ctoken"]').attr('content')
    }

    function getProjectId() {
        let matches = window.location.href.match(/projectId=(\d+)/)
        return matches ? matches[1] : null
    }

    function getItemId(jqItem) {
        let matches = jqItem.attr('class').match(/icon_id_(\d+)/)
        return matches ? matches[1] : null
    }

    function injectStyle() {
        $('head').append(`
            <style>
            .genteelly-edit {
                margin-top: 15px;
                margin-bottom: 15px;
                background: #e3e3e3;
                color: #a67979;
                cursor: pointer;
                padding: 4px 10px;
            }
            </style>
        `)
    }

    function update(itemId, newClass) {
        return new Promise((resolve, reject) => {
            let data = {
                font_class: newClass,
                ctoken: token,
                pid: projectId,
                id: itemId,
            }
            $.ajax({
                url: 'http://www.iconfont.cn/api/icon/updateProjectIcon.json',
                type: 'POST',
                data: data,
                dataType: 'json',
            }).then(res => {
                if (res.code == 200) {
                    alert('Success!')
                } else if (res.message) {
                    alert(res.message)
                } else {
                    alert('Unknown response:', JSON.stringify(res, null, 2))
                }
                resolve(res)
            }).catch(err => {
                console.error('>>> iconfont update:', err)
                reject(err)
            })
        })
    }

    function mission() {
        $('.project-iconlist').not('.inited').addClass('inited').find('.icon-item').each(function () {
            let jqItem = $(this),
                itemId = getItemId(jqItem)
            jqItem.append(`<div class="genteelly-edit" data-id="${itemId}">Edit Class</div>`)
        })
    }

    let token = getCsrfToken()
    let projectId = getProjectId()


    $(function () {
        injectStyle()

        if (token && projectId) {
            $('body').on('click', '.genteelly-edit', function () {
                let jqBtn = $(this),
                    itemId = jqBtn.data('id'),
                    jqCls = jqBtn.closest('.icon-item').find('.icon-code.icon-code-show'),
                    fullCls = jqCls.text(),
                    cls = jqCls.attr('title'),
                    prefix = fullCls.replace(new RegExp(`-${cls}$`), '')
                let newCls = prompt('New Class:', cls)
                if (newCls) {
                    update(itemId, newCls)
                        .then(res => {
                            jqCls.attr('title', newCls).text(prefix + '-' + newCls)
                        })
                        .catch(err => {})
                }
            })
            setInterval(mission, 2000)
        }
    })

})()
