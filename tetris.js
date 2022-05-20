let boadArray = [];
let currentBoadArray = [];
let colorBoadArray = [];
let currentColorBoadArray = [];
let currentMino = [];

// 全体の行列
const boadRow = 20;
const boadCol = 10;

// オフセット、移動管理
let offsetX = 0;
let offsetY = 0;
// 生成後からの移動量
let movementX = 0;
let movementY = 0;
let rotate = false;
let minoIndex;
let minoArray = [];

let fallSpeed = 1300;

let isCanMove = {
    xAxis : true,
    yAxis : true
}

const tetrimino = [
    [],
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
        [0,1,0,0],
        [1,1,1,0],
        [0,0,0,0]

    ],
    [
        [0,0,0,0],
        [0,0,1,1],
        [0,1,1,0],
        [0,0,0,0]

    ],
    [
        [0,0,0,0],
        [1,1,1,0],
        [0,0,1,0],
        [0,0,0,0]

    ],
    [
        [0,0,0,0],
        [0,0,1,0],
        [1,1,1,0],
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
    ArrayReset(colorBoadArray);
    ArrayReset(currentColorBoadArray);

    minoArray = [];
    generateMino();
    console.log("init");
}

// ミノ生成
const generateMino = () => {
    ArrayReset(currentBoadArray);
    movementX = 0;
    movementY = 0;
    minoIndex = randomSetSelect();
    currentMino = tetrimino[minoIndex];
    let generateXPos;
    //console.log("len:" + currentMino.length);
    for (let y = 0; y < currentMino.length; y++) {
        for (let x = 0; x < currentMino[y].length; x++) {
            // 座標と色情報更新
            generateXPos = (boadCol / 2) - (currentMino[y].length / 2);
            currentBoadArray[y][x+generateXPos] = currentMino[y][x];
            if (currentMino[y][x] != 0) {
                currentColorBoadArray[y][x+generateXPos] = minoIndex;
            }
        }
    }
    movementX += generateXPos;
}

// 7セット1週でランダムでミノ選択
const randomSetSelect = () => {
    if (minoArray.length == 0) {
        const indexArray = [1,2,3,4,5,6,7];
        minoArray = indexArray.slice();
        // random
        for (let i = minoArray.length -1; i >= 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [minoArray[i], minoArray[j]] = [minoArray[j], minoArray[i]];
        }
    }
    let num = minoArray.shift();
    console.log('num;' + num);
    return num;
}

// 描画処理
const draw = () => {
    $('#game').find('tr').each(function(i, elementTr) {
        $(elementTr).children().each(function(j, elementTd) {
            $(elementTd).removeClass();

            switch (colorBoadArray[i][j]) {
                case 1:
                    $(elementTd).addClass("omino");
                    break;
                case 2:
                    $(elementTd).addClass("imino");
                    break;
                case 3:
                    $(elementTd).addClass("tmino");
                    break;
                case 4:
                    $(elementTd).addClass("smino");
                    break;
                case 5:
                    $(elementTd).addClass("jmino");
                    break;
                case 6:
                    $(elementTd).addClass("lmino");
                    break;
                case 7:
                   $(elementTd).addClass("zmino");
                    break;
                default:
                    $(elementTd).addClass("default");
                    break;
            }

            switch (currentColorBoadArray[i][j]) {
                case 1:
                    $(elementTd).addClass("omino");
                    break;
                case 2:
                    $(elementTd).addClass("imino");
                    break;
                case 3:
                    $(elementTd).addClass("tmino");
                    break;
                case 4:
                    $(elementTd).addClass("smino");
                    break;
                case 5:
                    $(elementTd).addClass("jmino");
                    break;
                case 6:
                    $(elementTd).addClass("lmino");
                    break;
                case 7:
                   $(elementTd).addClass("zmino");
                    break;
                default:
                    $(elementTd).addClass("default");
                    break;
            }
            // if (boadArray[i][j] == 1) {
            //     $(elementTd).addClass("stick");
            // } else {
            //     $(elementTd).addClass("default");
            // }

            // if (currentBoadArray[i][j] == 1) {
            //     $(elementTd).addClass("stick");
            // } else {
            //     $(elementTd).addClass("default");
            // }
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
        const beforeChangeColorBoadArray = currentColorBoadArray.slice();

        ArrayReset(currentBoadArray);
        ArrayReset(currentColorBoadArray);
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
                    currentColorBoadArray = beforeChangeColorBoadArray.slice();
                    break update_array;
                }
                if (!isCanMove.yAxis) { // yが移動できない時　移動確定
                    currentBoadArray = beforeChangeBoadArray.slice();  // 移動キャンセル
                    currentColorBoadArray = beforeChangeColorBoadArray.slice();
                    copyMino();
                    clearLine();
                    //generateMino();
                    break update_array;
                }
            }
        }
        
        currentColorUpdate();
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
        const beforeChangeColorBoadArray = currentColorBoadArray.slice();
        ArrayReset(currentBoadArray);
        ArrayReset(currentColorBoadArray);

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
                        currentColorBoadArray = beforeChangeColorBoadArray.slice();
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
                        currentColorBoadArray = beforeChangeColorBoadArray.slice();
                        currentMino = beforeMino.slice();
                        setIsCamMove(true, true);
                        break rotate_mino;
                    }
                }
            }
        }
        currentColorUpdate();
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
                colorBoadArray[y][x] = currentColorBoadArray[y][x];
            }
        }
    }
    ArrayReset(currentBoadArray);
    ArrayReset(currentColorBoadArray);
}

const arrayCopy = (sourceArray, targetArray) => {
    ArrayReset(targetArray);
    for (let y = 0; y < boadRow; y++) {
        for (let x = 0; x < boadCol; x++) {
            targetArray[y][x] = sourceArray[y][x];
        }
    }
}

// 行削除
const clearLine = () => {
    const compleatLineArray = [1,1,1,1,1,1,1,1,1,1];
    //let clearLineArray = [0,0,0,0,0,0,0,0,0,0];
    let clearRowArray = [];
    let isClearLine = false;
    let beforeBoadArray = [];
    let beforeColorBoadArray = [];
    //TestBoadArray[1][1] = 1;
    // for (let y = 0; y < boadRow; y++) {
    //     for (let x = 0; x < boadCol; x++) {
    //         if (beforeBoadArray[y][x] == 1) {
    //             console.log(x + "," + y);
    //         }
    //         //console.log(beforeBoadArray[y][x]); 
    //     }
    // }

    // 行が1で揃っているか
    for (let y = 0; y < boadRow; y++) {
        if (JSON.stringify(compleatLineArray) === JSON.stringify(boadArray[y])) {
            for (let x = 0; x < boadCol; x++) {
                boadArray[y][x] = 0;
                colorBoadArray[y][x] = 0;
                isClearLine = true;
            }
            clearRowArray.push(y);
            console.log ("clear");
        }
    }

    if (isClearLine) {
        for (let i = 0; i < clearRowArray.length; i++) {
            // 配列のコピー
            for (let y = 0; y < boadRow; y++) {
                beforeBoadArray[y] = [];
                beforeColorBoadArray[y] = [];
                for (let x = 0; x < boadCol; x++) {
                   beforeBoadArray[y][x] = boadArray[y][x]; 
                   beforeColorBoadArray[y][x] = colorBoadArray[y][x];

                }
            }
            downBlock(clearRowArray[i], beforeBoadArray, beforeColorBoadArray);
        }

        isClearLine = false;
        clearRowArray = [];
    }
}

// 空いたスペース分下に下げる
const downBlock = (clearRow, clearBoadArray, colorArray) => {
    for (let y = 0; y < clearRow; y++) {
        for (let x = 0; x < boadCol; x++) {
            boadArray[y+1][x] = clearBoadArray[y][x]; 
            colorBoadArray[y+1][x] = colorArray[y][x];
        }
    }
}

// 
const checkGenerateMino = () => {
    const clearLineArray = [0,0,0,0,0,0,0,0,0,0];
    for (let i = 0; i < boadRow; i++) {
        if (JSON.stringify(clearLineArray) !== JSON.stringify(currentBoadArray[i])) {
            return;
        }
    }
    generateMino();
}

// 自動落下処理
const fall = () => {
    offsetY = 1;
}

// 色更新
const currentColorUpdate = () => {
    for (let y = 0; y < boadRow; y++) {
        for (let x = 0; x < boadCol; x++) {
            if (currentBoadArray[y][x] == 1) {
                currentColorBoadArray[y][x] = minoIndex;
            }
        }
    }
}

const setIsCamMove = (xAxis, yAxis) => {
    isCanMove.xAxis = xAxis;
    isCanMove.yAxis = yAxis;
}
//  TetrisMain
const Tetris = () => {
    init();
    setInterval(function() {  // 0.1秒ごとに更新　
        inputKey(); 
        move();
        RotateMino();
        checkGenerateMino();
        draw();
    }, 100);

    setInterval(function(){
        fall();
    }, fallSpeed);
}

// スタートボタン
const HideStartBtn = () => {
    $('#startbtn').css({display:"none"});
}