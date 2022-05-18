let boadArray = [];
let currentBoadArray = [];

const boadRow = 20;
const boadCol = 10;

// オフセット、移動管理
let offsetX = 0;
let offsetY = 0;

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
    currentBoadArray[1][6] = 1
    currentBoadArray[1][7] = 1
    currentBoadArray[2][6] = 1
    currentBoadArray[2][7] = 1

    console.log("init");
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
                offsetX--;
                break;
            case "ArrowRight":
                offsetX++;
                break;
            case "ArrowDown":
                offsetY++;
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
                if (arrayIndexRangeCheck(x+offsetX, y+offsetY)) {
                    currentBoadArray[y+offsetY][x+offsetX] = beforeChangeBoadArray[y][x]; 
                }
                
                if (!canMove(x, y, offsetX, offsetY, beforeChangeBoadArray)) {
                    currentBoadArray = beforeChangeBoadArray.slice(0, beforeChangeBoadArray.length);
                    break update_array;
                }
            }
        }
        offsetX = 0;
        offsetY = 0;
    }
}

// 配列の範囲外チェック
let arrayIndexRangeCheck = (axisX, axisY) => {
    if (axisY < 0 || axisY >= boadRow) {
        return false;
    }
    if (axisX < 0 || axisX >= boadCol) {
        return false;
    }
    return true;
}

// 移動先に移動できるか確認
let canMove = (axisX, axisY, offsetX, offsetY, boadArray) => {
    if (boadArray[axisY][axisX] == 1) {
        //console.log(axisX +","+ axisY);
        return arrayIndexRangeCheck(axisX+offsetX, axisY+offsetY);
    }
    return true;
}

/*const fall = () => {

}*/


// Main
//$(function() {
  

//});

init();
setInterval(function() {  // 0.5秒ごとに更新　
    inputKey(); 
    move();
    draw();
    //fall();  // 難易度上昇には描画速度を早めることで調整できる
}, 100);
