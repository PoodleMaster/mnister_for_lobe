// use Createjs and JQuery
window.addEventListener("load", init);
function init() {

    // --------------------------------------------------------------
    // localStorage読み込み
    // --------------------------------------------------------------
    var val = localStorage.getItem("MyURL");
    console.log(val);
    document.getElementById("INPUT1").value = val;

    // --------------------------------------------------------------
    // Stage1オブジェクト：WriteCanvas
    // --------------------------------------------------------------
    var stage1 = new createjs.Stage("WriteCanvas");

    // タッチイベントが有効なブラウザの場合、
    // CreateJSでタッチイベントを扱えるようにする
    if (createjs.Touch.isSupported()) {
        createjs.Touch.enable(stage1);
    }

    var shape = new createjs.Shape();   // シェイプを作成
    stage1.addChild(shape);             // ステージに配置

    handleClick_reset();

    // ステージ上でマウスボタンを押した時のイベント設定
    stage1.addEventListener("stagemousedown", handleDown);

    // マウスを押した時に実行される
    function handleDown(event) {

        var paintColor = "#FFFFFF"                      // 筆ペンの色

        // 線の描画を開始
        shape.graphics
                .beginStroke(paintColor)                // 指定のカラーで描画
                .setStrokeStyle(20, "round")            // 線の太さ、形
                .moveTo(event.stageX, event.stageY);    // 描画開始位置を指定

        // ステージ上でマウスを動かした時と離した時のイベント設定
        stage1.addEventListener("stagemousemove", handleMove);
        stage1.addEventListener("stagemouseup", handleUp);
    }

    // マウスが動いた時に実行する
    function handleMove(event) {

        // マウス座標への線を引く
        shape.graphics.lineTo(event.stageX, event.stageY);
    }

    // マウスボタンが離された時に実行される
    function handleUp(event) {

        // マウス座標への線を引く
        shape.graphics.lineTo(event.stageX, event.stageY);

        // 線の描画を終了する
        shape.graphics.endStroke();

        // イベント解除
        stage1.removeEventListener("stagemousemove", handleMove);
        stage1.removeEventListener("stagemouseup", handleUp);
    }

    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener("tick", onTick);

    function onTick() {
        stage1.update(); // Stageの描画を更新
    }

    // --------------------------------------------------------------
    // Stage2オブジェクト：ButtonCanvas
    // --------------------------------------------------------------
    var stage2 = new createjs.Stage("ButtonCanvas");
    stage2.enableMouseOver();

    // ボタンを作成
    var btn1 = createButton("Predict", 80, 30, "#0650c7");
    btn1.x = 20;
    btn1.y = 10;
    stage2.addChild(btn1);

    var btn2 = createButton("Reset", 80, 30, "#ff6161");
    btn2.x = 110;
    btn2.y = 10;
    stage2.addChild(btn2);

    // イベントを登録
    btn1.addEventListener("click", handleClick_png);
    btn2.addEventListener("click", handleClick_reset);

    // Predictボタン押下イベント
    function handleClick_png(event) {

        var URL = document.getElementById("INPUT1").value;
        console.log(URL);
        if (!URL) {
            document.getElementById("INPUT1").value = "Please enter URL!";
            return;
        }

        // Canvasタグから画像に変換
        stage1.update();
        var png = stage1.canvas.toDataURL();
        document.getElementById("ChgPngImg").src = png;

        // JQueryによるPOST処理
        // javascript→pythonへPNGデータ転送
        var textData = JSON.stringify({"b64_pngdata":png});

        var csvArray = png.split(',');
        base64png = csvArray[1]

        var data = JSON.stringify({
          "inputs": {
//          "Image": "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"
            "Image": base64png
          }
        });

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;

        var result = "";
        xhr.addEventListener("readystatechange", function () {
          if (this.readyState === this.DONE) {
            result = this.responseText;
            console.log(result);
            var result_parse = JSON.parse(result || "null");
            document.getElementById("ResultImg").src = png;

            var array = [];
            for (let i = 0; i <= 9; i++) {
                labelname = "Label" + String(i);
                document.getElementById(labelname).textContent = result_parse.outputs.Labels[i][1].toFixed(10);
                array.push(result_parse.outputs.Labels[i][1].toFixed(10));
            }
            max_val = Math.max.apply(null, array);
            document.getElementById("ResultLabel").textContent = result_parse.outputs.Prediction[0];
            document.getElementById("ResultScore").textContent = max_val.toFixed(10);
          }
        });

        xhr.open("POST", URL);
        xhr.send(data);

        // --------------------------------------------------------------
        // localStorage書き込み
        // --------------------------------------------------------------
        localStorage.setItem("MyURL", URL);
    }


    // Restボタン押下イベント
    function handleClick_reset(event) {

        // シェイプのグラフィックスを消去
        shape.graphics.clear();
        shape.graphics.beginFill("black");
        shape.graphics.drawRect(0, 0, 240, 240);
        shape.graphics.endFill();
        stage1.update();
        var png = stage1.canvas.toDataURL();
        document.getElementById("ChgPngImg").src = png;
    }

    // 時間経過イベント
    createjs.Ticker.addEventListener("tick", handleTick);
    function handleTick() {

        // Stage2の描画を更新
        stage2.update();
    }

    /**
    * @param {String} text ボタンのラベル文言です。
    * @param {Number} width ボタンの横幅(単位はpx)です。
    * @param {Number} height ボタンの高さ(単位はpx)です。
    * @param {String} keyColor ボタンのキーカラーです。
    * @returns {createjs.Container} ボタンの参照を返します。
    */
    function createButton(text, width, height, keyColor) {

        // ボタン要素をグループ化
        var button = new createjs.Container();
        button.name = text; // ボタンに参考までに名称を入れておく(必須ではない)
        button.cursor = "pointer"; // ホバー時にカーソルを変更する

        // 通常時の座布団を作成
        var bgUp = new createjs.Shape();
        bgUp.graphics
              .setStrokeStyle(1.0)
              .beginStroke(keyColor)
              .beginFill("white")
              .drawRoundRect(0.5, 0.5, width - 1.0, height - 1.0, 4);
        button.addChild(bgUp);
        bgUp.visible = true; // 表示する

        // ロールオーバー時の座布団を作成
        var bgOver = new createjs.Shape();
        bgOver.graphics
              .beginFill(keyColor)
              .drawRoundRect(0, 0, width, height, 4);
        bgOver.visible = false; // 非表示にする
        button.addChild(bgOver);

        // ラベルを作成
        var label = new createjs.Text(text, "18px sans-serif", keyColor);
        label.x = width / 2;
        label.y = height / 2;
        label.textAlign = "center";
        label.textBaseline = "middle";
        button.addChild(label);

        // ロールオーバーイベントを登録
        button.addEventListener("mouseover", handleMouseOver);
        button.addEventListener("mouseout", handleMouseOut);

        // マウスオーバイベント
        function handleMouseOver(event) {
            bgUp.visble = false;
            bgOver.visible = true;
            label.color = "white";
        }

        // マウスアウトイベント
        function handleMouseOut(event) {
            bgUp.visble = true;
            bgOver.visible = false;
            label.color = keyColor;
        }

        return button;
    }
}