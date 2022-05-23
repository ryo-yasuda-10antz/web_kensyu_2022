## 各リンク
### リポジトリ
https://github.com/ryo-yasuda-10antz/web_kensyu_2022

### github pages
https://ryo-yasuda-10antz.github.io/web_kensyu_2022/



## 操作方法
十字キー:  移動
Space: 回転

## 仕様
ゲーム
縦×横= 20×10マス
左右、下移動と左回転
1つミノが配置されると、ボード全体が1ブロック分右に移動する

## 描画
テーブルを表示、cssでクラスを指定して色を表示している
最初にjsでクラスをremoveし、その後に色を管理している配列からクラスを付与することで表示している
0の場合は何もない、1~7に対してはそれぞれのミノの色が反映される

## ブロック管理
盤面の管理には2つの配列を使用しており、既に配置されたブロック管理配列と、現在操作しているミノを管理する配列の2つ

## ゲームの速度
描画、移動、回転、行が揃ったかの更新は0.1秒毎に行なっている
落下速度は1.3秒毎

## BGM・SE
BGM  FC音工場 https://fc.sitefactory.info/bgm.html　コロブチカ

SE 効果音ラボ https://soundeffect-lab.info/　ペタッ