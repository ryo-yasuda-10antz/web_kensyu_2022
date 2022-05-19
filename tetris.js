let boadArray = [];
let currentBoadArray = [];

const boadRow = 20;
const boadCol = 10;

// オフセット、移動管理
let offsetX = 0;
let offsetY = 0;

let fallSpeed = 1500;

let isCanMove = {
    xAxis : true,
    yAxis : true
}

const tetrimino = [
    [
        [0,1,1,0],
        [0,1,1,0]
    ],
    [
        [1,1,0,0],
        [0,1,1,0]
    ]
];



const ArrayReset = (array) => {
    for (let y = 0; y < boadRow; y++) {
        array[y] = [];
        for (let x = 0; x < boadCol; x++) {
            array[y][x] = 0;
        }
    }
}

const init = () => {
    ArrayReset(boadArray);
    ArrayReset(currentBoadArray);

    // Debug
    // currentBoadArray[1][6] = 1
    // currentBoadArray[1][7] = 1
    // currentBoadArray[2][6] = 1
    // currentBoadArray[2][7] = 1
    generateMino();
    console.log("init");
}

// ミノ生成
const generateMino = () => {
    ArrayReset(currentBoadArray);

    let mino = tetrimino[1];
    //console.log("len:" + mino.length);
    for (let y = 0; y < mino.length; y++) {
        for (let x = 0; x < mino[y].length; x++) {
            let generateXPos = (boadCol / 2) - (mino[y].length / 2);
            currentBoadArray[y][x+generateXPos] = mino[y][x];
        }
    }
}

// 描画処理
const draw = () => {
    $('#game').find('tr').each(function(i, elementTr) {
        $(elementTr).children().each(function(j, elementTd) {
            $(elementTd).removeClass();
            if (boadArray[i][j] == 1) {
                $(elementTd).addClass("stick");
            } else {
                $(elementTd).addClass("default");
            }

            if (currentBoadArray[i][j] == 1) {
                $(elementTd).addClass("stick");
            } else {
                $(elementTd).addClass("default");
            }
        });
    });
}

// キー入力
const inputKey = () => {
    document.onkeydown = (e) => {
        switch (e.code) {
            case "ArrowLeft":
                offsetX = -1;
                break;
            case "ArrowRight":
                offsetX = 1;
                break;
            case "ArrowDown":
                offsetY = 1;
                break;
        }
    }
}

// offsetから移動処理
const move = () => {
    if (offsetX != 0 || offsetY != 0) {
        // 移動前の位置を保存
        const beforeChangeBoadArray = currentBoadArray.slice(0, currentBoadArray.length);

        ArrayReset(currentBoadArray);
        update_array:
        for (let y = 0; y < boadRow; y++) {
            for (let x = 0; x < boadCol; x++) {
                if (arrayIndexRangeCheck(x+offsetX, y+offsetY)) {  // pos+offsetの値が配列のlength内か
                    currentBoadArray[y+offsetY][x+offsetX] = beforeChangeBoadArray[y][x]; 
                }
        
                canMove(x, y, offsetX, offsetY, beforeChangeBoadArray)
                //console.log("x;" + isCanMove.xAxis + " y;" + isCanMove.yAxis);
                if (!isCanMove.xAxis) {  // xが移動できない時
                    currentBoadArray = beforeChangeBoadArray.slice(0, beforeChangeBoadArray.length); // 移動キャンセル
                    break update_array;
                }
                if (!isCanMove.yAxis) { // yが移動できない時
                    currentBoadArray = beforeChangeBoadArray.slice(0, beforeChangeBoadArray.length);
                    copyMino();
                    generateMino();

                    //console.log("next");
                    break update_array;
                }
            }
        }
        offsetX = 0;
        offsetY = 0;
        setIsCamMove(true, true);
    }
}

// 配列の範囲外チェック
let arrayIndexRangeCheck = (axisX, axisY) => {
    if (arrayIndexRangeCheckX(axisX) && arrayIndexRangeCheckY(axisY)) {
        return true;
    } else {
        return false;
    }
}

// x軸の範囲外チェック
let arrayIndexRangeCheckX = (axisX) => {
    if (axisX < 0 || axisX >= boadCol) {
        return false;
    }
    return true;
}

// y軸の範囲外チェック
let arrayIndexRangeCheckY = (axisY) => {
    if (axisY < 0 || axisY >= boadRow) {
        return false;
    }
    return true;
}

// 移動先に移動できるか確認
let canMove = (axisX, axisY, offsetX, offsetY, currentBoadArray) => {
    let movePosX = axisX+offsetX;
    let movePosY = axisY+offsetY;
    let resultX = true;
    let resultY = true;
    // 1が端っこにあるかチェック
    if (currentBoadArray[axisY][axisX] == 1) {
        resultX = arrayIndexRangeCheckX(movePosX);
        resultY = arrayIndexRangeCheckY(movePosY);
        //console.log("x;" + isCanMove.xAxis + "y:" + isCanMove.yAxis);
    }

    // 描画ボードと比較  
    if (arrayIndexRangeCheck(movePosX, movePosY)) {
        if (currentBoadArray[axisY][axisX] == 1 && boadArray[movePosY][movePosX] == 1) { // 移動前と移動先にブロックが存在しているか
            //console.log (movePosX + "," + movePosY + "  "+ boadArray[movePosY][movePosX]);
            if (offsetX != 0) {
                resultX = false;
            }
            if (offsetY != 0) {
                resultY = false;
            }   
        }
    }
    setIsCamMove(resultX, resultY);
}

// 移動が確定後に配列管理を移動する
const copyMino = () => {
    for (let y = 0; y < boadRow; y++) {
        for (let x = 0; x < boadCol; x++) {
            if (currentBoadArray[y][x] == 1) {
                boadArray[y][x] = currentBoadArray[y][x];
            }
        }
    }
    ArrayReset(currentBoadArray);
}

// 自動落下処理
const fall = () => {
    offsetY = 1;
}

const setIsCamMove = (xAxis, yAxis) => {
    isCanMove.xAxis = xAxis;
    isCanMove.yAxis = yAxis;
}

// Main
//$(function() {
  

//});

init();
setInterval(function() {  // 0.5秒ごとに更新　
    inputKey(); 
    move();
    draw();
}, 100);

setInterval(function(){
    fall();
}, fallSpeed);