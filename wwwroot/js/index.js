$(function () {
    var app = {}

    app.state = {
        currIndex: 0,
        data: [],
        currObj: []
    }

    // 获取模型数据
    app.getData = function (cb) {
        $.ajax({
            url: '../wwwroot/data/data/models.json',
            type: 'GET',
            dataType: 'json',
            success: function (res) {
                app.state.data = res
                if (typeof cb === 'function') {
                    cb()
                }
            },
            error: function (err) {
                console.log(err)
            }
        })
    }

    // dom操作
    app.domOperation = function () {
        var $btnPrev = $('#btnPrev'),
            $btnNext = $('#btnNext'),
            $btnRotate = $('#btnRotate'),
            $btnZoomIn = $('#btnZoomIn'),
            $btnZoomOut = $('#btnZoomOut')


        // 渲染前一个模型
        $btnPrev.on('click', function () {
            if (app.state.currIndex <= 0) {
                app.state.currIndex = app.state.data.length - 1
            } else {
                app.state.currIndex --
            }

            app.switchObj()
        })

        // 加载下一个模型
        $btnNext.on('click', function () {
            if (app.state.currIndex >= app.state.data.length - 1) {
                app.state.currIndex = 0
            } else {
                app.state.currIndex ++
            }

            app.switchObj()
        })

        // 旋转模型
        $btnRotate.on('click', function () {
            app.state.currObj[0].emit('rotate')
        })

        // 放大模型
        $btnZoomIn.on('click', function () {
            var scales = app.state.currObj.attr('scale')

            scales.x += 0.01
            scales.y += 0.01
            scales.z += 0.01

            app.state.currObj.attr('scale', [scales.x, scales.y, scales.z].join(' '))
        })

        // 缩小模型
        $btnZoomOut.on('click', function () {
            var scales = app.state.currObj.attr('scale')

            scales.x -= 0.01
            scales.y -= 0.01
            scales.z -= 0.01

            scales.x = scales.x <= 0 ? 0.01 : scales.x
            scales.y = scales.y <= 0 ? 0.01 : scales.y
            scales.z = scales.z <= 0 ? 0.01 : scales.z

            app.state.currObj.attr('scale', [scales.x, scales.y, scales.z].join(' '))
        })
    }

    // 创建实体
    app.createEntity = function (data) {
        var html = '<a-entity id="obj_' + data.id + '" side="dobule" scale="' + data.scale + '" obj-model="obj: #' + data.obj + '; mtl: #' + data.mtl + '"></a-entity>'

        return $(html)
    }

    // 创建动画
    app.createAnimation = function ($entity) {
        var html = '<a-animation attribute="rotation" begin="rotate" end="endRotate" dur="5000" fill="forwards" to="0 360 0" repeat="indefinite" easing="linear"></a-animation>'

        $entity.append($(html))

        return $entity
    }

    // 切换模型
    app.switchObj = function () {
        var data = app.state.data[app.state.currIndex],
            $entity = $('#obj_' + data.id)

        $('a-entity[id^="obj_"]').attr('visible', 'false')
        if ($entity.length) {
            $entity.attr('visible', 'true')
        } else {
            $entity = app.createEntity(data)
            $entity = app.createAnimation($entity)
            $('#marker').append($entity)
        }

        if (app.state.currObj[0]) {
            app.state.currObj[0].emit('endRotate')
        }

        app.state.currObj = $entity
        app.state.currObj.attr('rotation', '0 0 0')
        app.state.currObj.attr('scale', data.scale)
        $('#objName').text(data.title)
    }

    // 初始化
    app.init = function () {
        app.getData(function () {
            app.switchObj()
            app.domOperation()
        })
    }

    app.init()
})