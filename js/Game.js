(function () {
    var Game = window.Game = function (params) {
        this.canvas = document.querySelector(params.canvasId)
        console.log(this.canvas)
        // 帧编号
        this.fno = 0
        // 资源地址
        this.RJsonUIR = params.RJsonUIR
        this.ctx = this.canvas.getContext('2d')
        // 初始化 宽高
        this.init();
        // 读取资源
        var self = this
        this.loadAllResource(function () {
            self.start()
        })
    }

    /**
     * 初始化
     */
    Game.prototype.init = function () {
        var windowW = document.documentElement.clientWidth;
        var windowH = document.documentElement.clientHeight;
        // 验收视口
        if (windowH > 736) {
            windowH = 736;
        } else if (windowH < 500) {
            windowH = 500
        }
        if (windowW > 414) {
            windowW = 414
        } else if (windowW < 320) {
            windowW = 320
        }
        this.canvas.width = windowW
        this.canvas.height = windowH
    }
    
    Game.prototype.loadAllResource = function (callback) {
        this.R = {}

        var xhr = new XMLHttpRequest();
        var self = this
        var loadedImageCnt = 0;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                var RObj = JSON.parse(xhr.responseText);
                for(var i=0; i< RObj.images.length; i++) {
                    var item = RObj.images[i];
                    var image = new Image();
                    image.src = item.url
                    self.R[item.name] = image
                    image.onload = function () {
                        loadedImageCnt ++;
                        // 提示
                        self.ctx.textAlign = 'center'
                        self.ctx.font = '20px 微软雅黑'
                        self.ctx.clearRect(0, 0, self.canvas.clientWidth, self.canvas.clientHeight)
                        var txt = '正在加载资源 ' + loadedImageCnt + '/' + RObj.images.length
                        self.ctx.fillText(txt, self.canvas.clientWidth /2, self.canvas.clientHeight * (1-0.618))

                        // 判断是否加载完
                        if (loadedImageCnt == RObj.images.length) {
                            callback();
                        }
                    }
                }
            }
        }
        xhr.open('get', this.RJsonUIR, true)
        xhr.send(null)

    }

    // 开始
    Game.prototype.start = function () {
        var self = this
        this.background = new Background()
        this.timer = setInterval(function () {
            self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height)

            //背景
            self.background.update()
            self.background.render()

            // 打印帧编号
            self.fno ++;
            self.ctx.textAlign = 'left'
            self.ctx.font = '16px consolas'
            self.ctx.fillText('fno:' + self.fno, 10, 20)



        }, 20)
    }
})();