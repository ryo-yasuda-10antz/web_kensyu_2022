let boadArray = [];
let currentBoadArray = [];

const boadRow = 20;
const boadCol = 10;

// オフセット、移動管理
let offsetX = 0;
let offsetY = 0;

const init = () => {
    for (let y = 0; y < boadRow; y++) {
        boadArray[y] = [];
        currentBoadArray[y] = [];
        for (let x = 0; x < boadCol; x++) {
            boadArray[y][x] = 0;
            currentBoadArray[y][x] = 0;
        }
    }

    // Debug
    boadArray[1][6] = 1
    boadArray[2][6] = 1
    boadArray[3][6] = 1
    boadArray[4][6] = 1
}


// 描画処理
const draw = () => {
    $('#game').find('tr').each(function(i, elementTr) {
        $(elementTr).children().each(function(j, elementTd) {
            $(elementTd).removeClass();
            switch (boadArray[i][j]) {
                case 1:
                    $(elementTd).addClass("stick");
                    break;
            
                default:
                    $(elementTd).addClass("default");
            }
        });
    });
}

// offsetから移動処理
const move = () => {
    
}

// キー入力
const inputKey = () => {
    document.onkeydown = (e) => {
        switch (e.code) {
            case "ArrowLeft":
                offsetX--;
                break;
            case "ArrowRight":
                offsetX++;
                break;
            case "ArrowUp":
                offsetY--;
                break;
            case "ArrowDown":
                offsetY++;
                break;
        }
    }
}


/*const fall = () => {

}*/


// Main
$(function() {
    init();
});
draw();
setInterval(function() {  // 0.5秒ごとに更新　　
    draw();
    //fall();  // 難易度上昇には描画速度を早めることで調整できる
}, 500);
