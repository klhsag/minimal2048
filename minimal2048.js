"use strict"

let gameCtrl_new2048 = {
    row : 4,
    col : 4,
    directions : [
        [0, -1],
        [-1, 0],
        [0, 1],
        [1, 0]
    ],
    data : [],
    future : [undefined, undefined, undefined, undefined],
    success : [true, true, true, true],
    history: [],

    refreshAll(){
        this.log(this.data)
        /**
         * Empty as console app
         */
    },

    initData(row = this.row, col = this.col){
        this.data = []
        for (let i=0; i<row; ++i){
            let l = []
            for (let j=0; j<col; ++j){
                l.push(new Sq2048("", i, j))
            }
            this.data.push(l)
        }
    },

    isValid(idx, idy){
        return !(idx<0 || idx>=this.row || idy<0 || idy>=this.col);
    },

    /**
     * @param {*} total 
     * @param {*} decrement 
     */
    __createIteration__(total, decrement){
        let iters = []
        if (decrement===-1) {
            for (let i = 0; i < total; i++) iters.push(i)
        }else{ // decrement===1
            for (let i = total-1; i >= 0; i--) iters.push(i)
        }
        return iters;
    },
    createIteration(direction){
        let iters = [];
        let m = this.row, n = this.col;
        if (direction[0]==0){
            for (let i=0; i<m; ++i){
                let jters = this.__createIteration__(n, direction[1])
                for (let _j = 0; _j < jters.length; _j++) {
                    const j = jters[_j];
                    iters.push([i, j])
                }
            }
        }else{
            for (let i=0; i<n; ++i){
                let jters = this.__createIteration__(m, direction[0])
                for (let _j = 0; _j < jters.length; _j++) {
                    const j = jters[_j];
                    iters.push([j, i])
                }
            }
        }
        return iters;
    },

    /**
     * @param {number} [dId=null] none param to excute all (dId=0~3)
     */
    iterateFuture(dId=null){
        if (dId == null){
            for (let i=0; i<4; i++) this.iterateFuture(i)
            return
        }

        this.future[dId] = JSON.parse(JSON.stringify(this.data))
        let grids = this.future[dId]
        let direction = this.directions[dId]
        let iters = this.createIteration(direction)
        for (let i = 0; i < iters.length; i++) {
            const [idx, idy] = iters[i];
            if (grids[idx][idy].num === "") continue
            let [x, y] = [idx, idy]
            x += direction[0]
            y += direction[1]
            while (this.isValid(x, y)){
                if (grids[x][y].num !== ""){
                    if (grids[x][y].mark[dId]!==0 || grids[x][y].num!==grids[idx][idy].num) break
                    grids[x][y].mark[dId] = grids[x][y].num = grids[x][y].num + grids[x][y].num
                    grids[idx][idy].num = ""
                    grids[idx][idy].dist = (x-idx!=0)?(x-idx):(y-idy)
                }
                x += direction[0]
                y += direction[1]
            }
            if (grids[idx][idy].num === "") continue
            x -= direction[0]
            y -= direction[1]
            ;[grids[x][y].num, grids[idx][idy].num] = [grids[idx][idy].num, grids[x][y].num]
            grids[idx][idy].dist = (x-idx!=0)?(x-idx):(y-idy)
        }

        this.success[dId] = false
        let m = this.row, n = this.col;
        (()=>{
        for (let i=0; i<m; ++i){
            for (let j=0; j<n; ++j){
                if (this.data[i][j].num !== grids[i][j].num){
                    this.success[dId] = true
                    return;
                }
            }
        }})()
    },

    /**
     * @param {number} [dId=null] none param to excute all (dId=0~3)
     */
    isSuccess(dId){
        if (dId==null){
            for (let i=0; i<4; ++i) if (this.isSuccess()) return true;
            return false;
        }
        return this.success[dId];
    },

    /**
     * assert :  this.future[dId] leads to success!
     */
    iterateData(dId){
        let grids = this.future[dId]
        let m = this.row, n = this.col;
        for (let i=0; i<m; ++i){
            for (let j=0; j<n; ++j){
                this.data[i][j].num = grids[i][j].num
            }
        }
        this.generateNewSquare()
    },

    generateNewSquare(){
        let x = (Math.random() < 0.9) ? 2 : 4
        let items = []
        let m = this.row, n = this.col;
        for (let i=0; i<m; ++i){
            for (let j=0; j<n; ++j){
                if (this.data[i][j].num === "") items.push([i, j])
            }
        }
        let idx = Math.floor(Math.random() * items.length)
        let [i, j] = items[idx]
        this.data[i][j] = new Sq2048(x, i, j)
        //this.refreshContent(i, j, this.data[i][j].num)
    },

    showMoving(dId){
        this.refreshAll()
        /**
         * Empty as console app
         */
    },

    applyMove(dId){
        if (!this.success[dId]) return false;
        this.history.push(JSON.parse(JSON.stringify(this.data)))
        this.iterateData(dId)
        this.showMoving(dId)
        //this.log(this.data)
        return true;
    },

    tryMove(dId){
        if (!this.applyMove(dId)) return;
        this.iterateFuture()
        for (let i=0; i<4; ++i){
            if (this.success[i]) return;
        }

        setTimeout(()=>{alert("defeat")}, 1000)  //delay
    },

    undo(){
        if (this.history.length>1){
            this.data = this.history.pop()
            this.iterateFuture()
            this.refreshAll()
        }

    },

    start(row = this.row, col = this.col){
        this.row = row
        this.col = col

        this.initData(row, col)

        // init the first
        this.iterateFuture()
        this.success = [true, true, true, true]
        this.tryMove(0)

        window.addEventListener("keydown", this.keyListener)

    },

    /**
     * Attention :  a callback - no use 'this'
     * @param {*} event 
     */
    keyListener(event){

        event = event || window.event

        switch (event.keyCode) {
        case 8:     //backspace            //TODO
        gameCtrl_new2048.undo()
        break
        case 37:    //left arrow
        gameCtrl_new2048.tryMove(0)
        break
        case 38:    //up arrow
        gameCtrl_new2048.tryMove(1)
        break
        case 39:    //right arrow
        gameCtrl_new2048.tryMove(2)
        break
        case 40:    //down arrow
        gameCtrl_new2048.tryMove(3)
        break
        }

    },

    /**
     * @param {{num}[][]} mat
     */
    log(mat){
        tableLog(this.row, this.col, (i, j)=>{
            return mat[i][j].num
        })
    }

}

function Sq2048(num, idx, idy){
    this.idx = idx
    this.idy = idy
    this.num = num
    this.mark = [0, 0, 0, 0]
    this.dist = 0
}

function tableLog(x, y, getter){
    let table = []
    for (let i = 0; i < x; i++) {
        let row = []
        for (let j = 0; j < y; j++) {
            row.push(getter(i, j));
        }
        table.push(row)
    }
    console.table(table)
}

function helpMe(){
    console.log(' ----帮助----')

    console.log('按键盘方向键控制滑动')
    console.log('按退格键可撤销滑动（不能恢复，可无限撤销）')
    console.log('（注意：编辑状态下并无法响应键盘操作，需要点击浏览器主窗口空白部分来取消）')

    console.log('高级指令：')
    console.log('> helpMe()')
    console.log(' - 重新显示此帮助')
    console.log('> go2048(X, Y)')
    console.log(' - 重启一局新的2048，X、Y分别填写行数和列数')
}
function go2048(x, y){
    gameCtrl_new2048.start(x, y)
}
function left(){
    gameCtrl_new2048.tryMove(0)
}
function up(){
    gameCtrl_new2048.tryMove(1)
}
function right(){
    gameCtrl_new2048.tryMove(2)
}
function down(){
    gameCtrl_new2048.tryMove(3)
}
function back(){
    gameCtrl_new2048.undo()
}

gameCtrl_new2048.start(4, 4)
helpMe()