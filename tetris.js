let boadArray = [];
let currentBoadArray = [];
let currentMino = [];

const boadRow = 20;
const boadCol = 10;

// オフセット、移動管理
let offsetX = 0;
let offsetY = 0;
let movementX = 0;
let movementY = 0;
let rotate = false;

let fallSpeed = 1500;

let isCanMove = {
    xAxis : true,
    yAxis : true
}

const tetrimino = [
    [
        [0,0,0,0],
        [0,1,1,0],
        [0,1,1,0],
        [0,0,0,0]

    ],
    [
        [0,0,0,0],
        [1,1,1,1],
        [0,0,0,0],
        [0,0,0,0]

    ],
    [
        [0,0,0,0],
        [1,1,0,0],
        [0,1,1,0],
        [0,0,0,0]
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
    movementX = 0;
    movementY = 0;
    currentMino = tetrimino[1];
    let generateXPos;
    //console.log("len:" + mino.length);
    for (let y = 0; y < currentMino.length; y++) {
        for (let x = 0; x < currentMino[y].length; x++) {
            generateXPos = (boadCol / 2) - (currentMino[y].length / 2);
            currentBoadArray[y][x+generateXPos] = currentMino[y][x];
        }
    }
    movementX += generateXPos;
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
            case "Space":
                rotate = true;
                break;
        }
    }
}

// offsetから移動処理
const move = () => {
    if (offsetX != 0 || offsetY != 0) {
        // 移動前の位置を保存
        const beforeChangeBoadArray = currentBoadArray.slice();

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
                    currentBoadArray = beforeChangeBoadArray.slice(); // 移動キャンセル
                    break update_array;
                }
                if (!isCanMove.yAxis) { // yが移動できない時　移動確定
                    currentBoadArray = beforeChangeBoadArray.slice();
                    copyMino();
                    clearLine();
                    generateMino();

                    //console.log("next");
                    break update_array;
                }
            }
        }
        // for (let y = 0; y < boadRow; y++) {
        //     for (let x = 0; x < boadCol; x++) {
        //         if (currentBoadArray[y][x] == 1) {
        //             console.log(x + "," + y);
        //         }
        //     }
        // }
        movementX += offsetX;
        movementY += offsetY;
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
let canMove = (axisX, axisY, offsetX, offsetY, checkBoadArray) => {
    let movePosX = axisX+offsetX;
    let movePosY = axisY+offsetY;
    let resultX = true;
    let resultY = true;
    // 1が端っこにあるかチェック
    if (checkBoadArray[axisY][axisX] == 1) {
        resultX = arrayIndexRangeCheckX(movePosX);
        resultY = arrayIndexRangeCheckY(movePosY);
        //console.log("x;" + isCanMove.xAxis + "y:" + isCanMove.yAxis);
    }

    // 描画ボードと比較  
    if (arrayIndexRangeCheck(movePosX, movePosY)) {
        if (checkBoadArray[axisY][axisX] == 1 && boadArray[movePosY][movePosX] == 1) { // 移動前と移動先にブロックが存在しているか
            //console.log (movePosX + "," + movePosY + "  "+ boadArray[movePosY][movePosX]);
            if (offsetX != 0) {
                resultX = false;
            }
            if (offsetY != 0) {
                resultY = false;
            } 
            if (offsetX == 0 && offsetY == 0) {  // 回転時の対応
                resultX = false;
                resultY = false;
            }
        }
    }
    setIsCamMove(resultX, resultY);
}

// ミノの回転処理
const RotateMino = () => {
    if (rotate) {
        // 回転前の位置を保存
        const beforeChangeBoadArray = currentBoadArray.slice();
        ArrayReset(currentBoadArray);

        let isRotateCancel = false;
        let newMino = [];
        let beforeMino = currentMino.slice();
        for (let y = 0; y < currentMino.length; y++) {
            newMino[y] = [];
            for (let x = 0; x < currentMino[y].length; x++) {
                    newMino[y][x] = currentMino[currentMino[y].length - 1 - x][y]; 
                    //console.log("rotate x;" + afterXPos + " y;" + afterYPos);
            }
        }
        currentMino = newMino.slice();

        // 回転を反映
        rotate_apply:
        for (let y = 0; y < newMino.length; y++) {
            for (let x = 0; x < newMino[y].length; x++) {
                if (newMino[y][x] == 1) {
                    currentBoadArray[y+movementY][x+movementX] = 1;
                    //console.log("rotate x;" + (x+movementX) + " y;" + (y+movementY));
                    if (!arrayIndexRangeCheck(x+movementX , y+movementY)) {  // 回転後範囲外に出た
                        currentBoadArray = beforeChangeBoadArray.slice();
                        currentMino = beforeMino.slice();
                        isRotateCancel = true;
                        break rotate_apply;
                    }
                }
            }
        }

        if (!isRotateCancel) {
            // 当たるかチェック
            rotate_mino:
            for (let y = 0; y < boadRow; y++) {
                for (let x = 0; x < boadCol; x++) {
                    canMove(x, y, 0, 0, currentBoadArray);
                    if (!isCanMove.xAxis || !isCanMove.yAxis) { // 移動不可
                        currentBoadArray = beforeChangeBoadArray.slice();　// 回転キャンセル
                        currentMino = beforeMino.slice();
                        break rotate_mino;
                    }
                }
            }
        }
        setIsCamMove(true, true);
        rotate = false;
    }
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

// 列削除
const clearLine = () => {
    let compleatLineArray = [1,1,1,1,1,1,1,1,1,1];
    //let clearLineArray = [0,0,0,0,0,0,0,0,0,0];
    let clearRow;
    let isClearLine = false;
    let beforeBoadArray = [];
    //TestBoadArray[1][1] = 1;
    // for (let y = 0; y < boadRow; y++) {
    //     for (let x = 0; x < boadCol; x++) {
    //         if (beforeBoadArray[y][x] == 1) {
    //             console.log(x + "," + y);
    //         }
    //         //console.log(beforeBoadArray[y][x]); 
    //     }
    // }

    for (let y = 0; y < boadRow; y++) {
        if (JSON.stringify(compleatLineArray) === JSON.stringify(boadArray[y])) {
            for (let x = 0; x < boadCol; x++) {
                boadArray[y][x] = 0;
                clearRow = y;
                isClearLine = true;
            }
            console.log ("clear");
        }
    }
    


    if (isClearLine) {
        for (let y = 0; y < boadRow; y++) {
            beforeBoadArray[y] = [];
            for (let x = 0; x < boadCol; x++) {
               beforeBoadArray[y][x] = boadArray[y][x]; 
            }
        }
        deleteBlock(clearRow, beforeBoadArray);
        isClearLine = false;
        clearRow = 0;
    }
    

}

const deleteBlock = (clearRow, clearBoadArray) => {
    for (let y = 0; y < clearRow; y++) {
        for (let x = 0; x < boadCol; x++) {
            boadArray[y+1][x] = clearBoadArray[y][x]; 
        }
    }
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
    RotateMino();
    draw();
}, 100);

setInterval(function(){
    fall();
}, fallSpeed);