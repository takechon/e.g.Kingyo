// グローバル変数
var UNIT = 256;

var fish;
var efish;
var isFool = false;
var fishLoaded;
var f_width;
var f_height;
var f_exp;
var f_size; // 画像のサイズでもある
var fx;
var fy;
var dx;
var dy;
// えさ初期化
var FOOD_NUM = 10;
var foodx = new Array(FOOD_NUM);
var foody = new Array(FOOD_NUM);
var feeding = false;

var DEAD_TIME = 129600000; // 36時間
//var DEAD_TIME = 60000; // debug 1分
var FOOD_TIME = 3240000; // DEAD_TIME / 40; // = 一粒 0.9 時間
var AGE_COUT_UP = 137113043; // 一年かけて 230 ドット……。

var NowTime;

// 保存対象データ
var period = 365; // 有効期限日数
var BirthTime;
var LastFoodTime;
var HungryTime;
var Age;
var IsFirst;
var LastMonthDay;
var AboutSeed;

var today = new Date();
var monthDay;

var num = new Array(10);
var coron = new Image();
var wall = new Array(12);
var guest = new Array(6);

var forceBlack = false;
var guestNum = -1;

var chibi = new Array(2);
var chibiCt = 0;
var isChibi = false;

var isXmas = false;
var brinkOn = -1;
var BRINK_NUM = 10;
var brx = new Array(BRINK_NUM);
var bry = new Array(BRINK_NUM);
var brr = new Array(BRINK_NUM);
var brc = new Array(BRINK_NUM);

var sgx;
var sgy;
var gx;
var gy;
var dgx;

var chimeON = -1;
var isMedaka = false;
var MEDAKAMAX = 5;
var medaka = new Array(MEDAKAMAX);
var medakaNum;

var isBozu = false;
var BOZUMAX = 17;
var bozu = new Array(BOZUMAX);
var bozuCt;
var mx, my;
var mdx, mdy;
var mddx, mddy;
var mddxd, mddyd;

var moon = new Array(30);
var isMoon = false;
var nowMoon;
var moonS;
var moonW;
var moonH;
var moonAlpha;

var WeatherRequest = new XMLHttpRequest();
var WeatherConditionCode = 0;
var WeatherLastCheckTime = 0;
var TempHosei = 1.0;

var isHanabi = false;
var hanabi;
var hanabiCt = 0;
//initData();

var Pos = function(x, dx, y, dy) {
    this.x = x;
    this.dx = dx;
    this.y = y;
    this.dy = dy;
    this.time = 0;
    this.move = function() {
        this.x += this.dx;
        this.y += this.dy;
        this.time++;
    };
};

var SMOKEMAX = 256;
var BLUEMAX = 6;
var smoke = new Array(BLUEMAX);
for (i = 0; i < BLUEMAX; i++) {
    smoke[i] = new Array(SMOKEMAX);
}

var isBlue = false;
var blueS;
var bluePos = new Array(BLUEMAX);


var KSMOKEMAX = 16;
var ksmoke = new Array(KSMOKEMAX);


/**
* @return {null}
*/
window.onload = function() {

    // FPS計算 ---------------------------------------------

    var FPS = function(target) {
        this.target = target; // 目標FPS
//        this.interval = 1000 / target; // setTimeoutに与えるインターバル
        this.interval = 2000 / target; // setTimeoutに与えるインターバル
        this.checkpoint = new Date();
        this.fps = 0;
    };
    FPS.prototype = {
        // checkからcheckまでの時間を元にFPSを計算
        check: function() {
            var now = new Date();
            this.fps = 1000 / (now - this.checkpoint);
            this.checkpoint = new Date();
        },
        // 現在のFPSを取得
        getFPS: function() {
            return this.fps.toFixed(2);
        },
        // 次回処理までのインターバルを取得
        getInterval: function() {
            var elapsed = new Date() - this.checkpoint;
            return this.interval - elapsed > 10 ? this.interval - elapsed : 10;
        }
    };

    // メイン処理 ------------------------------------------

    canvas = document.getElementById('id_canvas1');
    if (!canvas || !canvas.getContext) {
        alert('HTML5対応ブラウザで見てちょうだい!');
        return false;
    }
    cc = canvas.getContext('2d');

    // 20FPSでアニメーション
    var fps = new FPS(20);

    // スクリーンサイズ初期化 // 仮想スクリーンサイズは 256 x 256
    screen_unitX = canvas.width;
    screen_unitY = canvas.height;
    if (canvas.width > canvas.height) {
        screen_unit = canvas.height;
    }
    else {
        screen_unit = canvas.width;
    }

    // 水草初期設定
    var PLANT_NUM = 16;
    var px = new Array(PLANT_NUM);
    var py = new Array(PLANT_NUM);
    var px0 = 51;
    var py0 = 238;

    for (i = 0; i < PLANT_NUM; i++) {
        px[i] = Math.floor(Math.random() * 40);
        py[i] = Math.floor(Math.random() * 100) + 100;
    }
    fx = Math.floor(Math.random() * 256);
    fy = Math.floor(Math.random() * 236);
    dx = -1;
    dy = 0;

    // データいろいろ初期化
    initData();

    canvas.addEventListener('mouseup', mouseupfunc, true);

    // ループ処理ぐるぐる!
    var loop = function() {
        /*
        if ((Math.floor(NowTime / 1000)) % 60 == 0) { // 1分おきにリロード
            loadFish();
        }*/
        //canvas.height = wrapper.height;
        //canvas.width = wrapper.width;

        //canvas.height = document.body.clientHeight;
        //canvas.width = document.body.clientWidth;

        canvas.width = document.documentElement.clientWidth;
        canvas.height = document.documentElement.clientHeight;
        screen_unitX = canvas.width;
        screen_unitY = canvas.height;
        if (canvas.width > canvas.height) {
            screen_unit = canvas.height;
        }
        else {
            screen_unit = canvas.width;
        }

        fps.check();
        cc.save();

        DD = new Date();
        h2 = DD.getHours() * 3600 + DD.getMinutes() * 60 + DD.getSeconds();
        h = h2;
        if (h > 43200) { // 正午で絶対値
            h = 86400 - h;
        }
        if (h > 21600) { // 6〜18時で正午を最低値 0.1 にする
            moonAlpha = (-0.9 * (h - 21600)) / 21600 + 1.0;
        }
        else {
            moonAlpha = 1.0;
        }

        var m_key = DD.getMinutes();
        var key = DD.getHours() * 60 + m_key;
        if (WeatherConditionCode == 0 || m_key == 10) { // 一時間毎に天気情報取得
            getWeather(key);
        }
        moonAge = (((DD.getFullYear() - 2009) % 19) * 11 +
                   (DD.getMonth() + 1) + DD.getDate()) % 30;
        if (DD.getMonth() == 0 || DD.getMonth() == 1) { // 1, 2月の補正
            moonAge += 2;
            moonAge %= 30;
        }
//        if (DD.getHours() >= 17 || DD.getHours() < 8) {
            isMoon = true;
            moonW = screen_unit * 0.35;
            moonH = screen_unit * 0.35;
            nowMin = DD.getHours() * 60 + DD.getMinutes();
            moonS = ((moonAge * 1440 + nowMin) / 30) + 360; // 月の出 (unit: 分)
            nowMoon = nowMin - moonS; // 月の出から何分?
            if (nowMoon < 0) {
                nowMoon += 1440; // 24時間
            }
//            nowMoon = 360; // debug alway
//        }
//        else {
//            isMoon = false;
//            isMoon = true; // always show Moon
//        }

        // 水
        red = calcColor(h, 0xcd, 0);
        green = calcColor(h, 0xd5, 0x1f);
        blue = calcColor(h, 0xff, 0x33);

        var color = 'rgb(' +
            Math.floor(red) + ',' +
            Math.floor(green) + ',' +
            Math.floor(blue) + ')';
        if (forceBlack) {
            color = 'rgb(0, 0, 0)';
        }
        cc.fillStyle = color;
        cc.fillRect(0, 0, canvas.width, canvas.height);



        // 壁紙の描画
        month = DD.getMonth() + 1;
        day = DD.getDate();
        monthDay = month * 100 + day;

        //monthDay = 1103; // for deBug
        forceBlack = false;
        isXmas = false;
        isFool = false;
        isHanabi = false;
        switch (monthDay) {
        case 124:
            if (guestNum != 0) {
                guestNum = 0;
                sgx = gx = UNIT;
                sgy = 0;
                gy = (UNIT - guest[guestNum].height - 20) / 2;
                dgx = -3;
            }
            break;
        case 412: // チビ黒
            if (!isChibi) {
                isChibi = true;
                chibiCt = 0;
                sgx = gx = UNIT;
                gy = UNIT - chibi[0].height - 20;
                dgx = -2;
            }
            break;
        case 505:
            if (guestNum != 1) {
                guestNum = 1;
                sgx = gx = UNIT;
                sgy = -1;
                gy = (UNIT - guest[guestNum].height - 20) / 2;
                dgx = -2;
            }
            break;
        case 707:
            if (guestNum != 2) {
                guestNum = 2;
                sgx = gx = UNIT;
                sgy = 0;
                gy = 5;
                dgx = -3;
            }
            break;
        case 724:
            if (guestNum != 3) {
                guestNum = 3;
                sgx = gx = UNIT;
                sgy = 0;
                gy = (UNIT - guest[guestNum].height - 20) / 5;
                dgx = -3;
            }
            break;
        /*case 1103:
            if (guestNum != 5) {
                guestNum = 5;
                sgx = gx = UNIT;
                sgy = 0;
                gy = (UNIT - guest[guestNum].height - 20) / 2;
                dgx = -1;
            }
            break;*/
        case 1112:
            if (guestNum != 4) {
                guestNum = 4;
                sgx = gx = UNIT;
                sgy = -1;
                gy = Math.random() *
                    (UNIT - guest[guestNum].height - 20);
                dgx = -1;
            }
            break;
        default:
            guestNum = -1;
            isChibi = false;
        }

        switch (monthDay) {
        case 101:
            var wx = (screen_unitX - calcUnit(wall[0].width)) / 2;
            var wy = (screen_unitY - calcUnit(wall[0].height)) / 2;
            cc.drawImage(wall[0],
                         wx, wy,
                         calcUnit(wall[0].width), calcUnit(wall[0].height)
                        );
            break;
        case 214:
            var wx = (screen_unitX - calcUnit(wall[1].width)) / 2 +
                calcUnitX(20);
            var wy = screen_unitY - calcUnit(wall[1].height) - calcUnitY(20);
            cc.drawImage(wall[1],
                         wx, wy,
                         calcUnit(wall[1].width), calcUnit(wall[1].height)
                        );
            break;
        case 426:
            var wx = (screen_unitX - calcUnit(wall[3].width)) / 2;
            var wy = (screen_unitY - calcUnit(wall[3].height)) / 2;
            cc.drawImage(wall[3],
                         wx, wy,
                         calcUnit(wall[3].width), calcUnit(wall[3].height)
                        );
            break;
        case 510:
            var wx = (screen_unitX - calcUnit(wall[4].width)) * 3 / 4;
            var wy = screen_unitY - calcUnit(wall[4].height) - calcUnitY(20);
            cc.drawImage(wall[4],
                         wx, wy,
                         calcUnit(wall[4].width), calcUnit(wall[4].height)
                        );
            break;
        case 612:
            var wx = screen_unitX - calcUnit(wall[5].width) - calcUnitX(40);
            var wy = screen_unitY - calcUnit(wall[5].height) - calcUnitY(20);
            cc.drawImage(wall[5],
                         wx, wy,
                         calcUnit(wall[5].width), calcUnit(wall[5].height)
                        );
            break;
        case 707:
            var wx = (screen_unitX - calcUnit(wall[6].width)) / 2;
            var wy = screen_unitY - calcUnit(wall[6].height) - calcUnitY(20);
            cc.drawImage(wall[6],
                         wx, wy,
                         calcUnit(wall[6].width), calcUnit(wall[6].height)
                        );
            break;
        case 806:
            var wx = (screen_unitX - calcUnit(wall[7].width)) / 2;
            var wy = (screen_unitY - calcUnit(wall[7].height)) / 2;
            cc.drawImage(wall[7],
                         wx, wy,
                         calcUnit(wall[7].width), calcUnit(wall[7].height)
                        );
            forceBlack = true;
            break;
        case 815:
            if (DD.getHours() > 18 &&
                DD.getHours() < 21) {
                isHanabi = true;
            }
            break;
        case 907:
            var wx = (screen_unitX - calcUnit(wall[8].width)) * 3 / 4;
            var wy = screen_unitY - calcUnit(wall[8].height) - calcUnitY(20);
            cc.drawImage(wall[8],
                         wx, wy,
                         calcUnit(wall[8].width), calcUnit(wall[8].height)
                        );
            break;
        case 910:
            var wx = (screen_unitX - calcUnit(wall[9].width)) - calcUnitX(10);
            var wy = screen_unitY - calcUnit(wall[9].height) - calcUnitY(20);
            cc.drawImage(wall[9],
                         wx, wy,
                         calcUnit(wall[9].width), calcUnit(wall[9].height)
                        );
            break;
        case 1031:
            var mag = 1.2;
            var wx = (screen_unitX - calcUnit(wall[10].width * mag)) * 4 / 5;
            var wy = screen_unitY - calcUnit(wall[10].height * mag) -
                calcUnitY(20);
            cc.drawImage(wall[10],
                         wx, wy,
                         calcUnit(wall[10].width * mag),
                         calcUnit(wall[10].height * mag)
                        );
            break;
        case 1225:
            var mag = 0.8;
            var wx = (screen_unitX - calcUnit(wall[11].width)) - calcUnitX(5);
            var wy = screen_unitY - calcUnit(wall[11].height * mag) -
                calcUnitY(20);
            cc.drawImage(wall[11],
                         wx, wy,
                         calcUnit(wall[11].width * mag),
                         calcUnit(wall[11].height * mag)
                        );
            isXmas = true;
            break;
        }
        /*
        if((i = rand(100)) < 10) { // 100回に 10回雪ダルマ
            switch(month) {
            case 2:
                wallImage = addImage(this, "w214");
                wx = (getWidth - wallImage._width) / 2 + 20;
                wy = getHeight - wallImage._height - GROUND_H;
                wallImage.setXY(wx, wy);
                break;
            }
        }
*/
        // 満月の描画
        if (isMoon) {
            cc.save();
            x = Math.sin((nowMoon - 360) * Math.PI / 720) *
                ((screen_unitX - moonW) / 2) + screen_unitX / 2;
            y = Math.sin((nowMoon - 720) * Math.PI / 720) *
                (screen_unitY - moonH) + screen_unitY;
            rot = ((nowMoon - 360) * Math.PI / 720);

            xd = moonW * -0.5;
            yd = moonH * -0.5;

            //cc.globalAlpha = 0.1; // test
            cc.globalAlpha = moonAlpha;
            cc.translate(x, y);
            //cc.rotate(rot * Math.PI / 180);
            cc.rotate(rot);
            cc.drawImage(moon[moonAge],
                         xd, yd,
                         moonW, moonH
                        );
            cc.restore();
        }

        // 花火
        if (isHanabi) {
            cc.save();
            if (brinkOn != DD.getSeconds()) {
                brinkOn = DD.getSeconds();
                hanabiCt++;
                hanabiCt %= 2;
            }
            if (hanabiCt == 1) {
                cc.scale(-1, 1);
                cc.drawImage(hanabi,
                             -screen_unitX, 0,
                             screen_unitX,
                             screen_unitY
                            );
            }
            else {
                cc.drawImage(hanabi,
                             0, 0,
                             screen_unitX,
                             screen_unitY
                            );
            }

            cc.restore();
        }

        // ゲストの描画
        if (guestNum >= 0) {
            cc.drawImage(guest[guestNum],
                         calcUnitX(gx), calcUnitY(gy),
                         calcUnit(guest[guestNum].width),
                         calcUnit(guest[guestNum].height)
                        );
            //guestImage.setXY(gx, gy);
            gx += dgx;
            if (calcUnitX(gx) < -calcUnit(guest[guestNum].width) ||
                calcUnitX(gx) > screen_unitX +
                calcUnit(guest[guestNum].width)) {
                gx = sgx;
                if (sgy < 0) {
                    gy = Math.random() * (UNIT - guest[guestNum].height - 20);
                }
            }
        }

        // チビ黒の描画
        if (isChibi) {
            cc.drawImage(chibi[chibiCt],
                         calcUnitX(gx),// calcUnitY(gy),
                         screen_unitY - calcUnit(chibi[chibiCt].height) -
                         calcUnitY(20),
                         calcUnit(chibi[chibiCt].width),
                         calcUnit(chibi[chibiCt].height)
                        );
            gx += dgx;
            chibiCt++;
            chibiCt %= 2;
            if (calcUnitX(gx) < -calcUnit(chibi[0].width)) {
                gx = sgx;
            }
        }

        // クリスマスイベント: ピカピカは 1秒おき
        if (isXmas) {
            if (brinkOn != DD.getSeconds()) {
                brinkOn = DD.getSeconds();
                for (i = BRINK_NUM - 1; i >= 0; i--) {
                    brc[i] = 'rgb(' +
                        (~~(256 * Math.random())) + ', ' +
                        (~~(256 * Math.random())) + ', ' +
                        (~~(256 * Math.random())) + ')';

                    brr[i] = Math.floor(Math.random() * calcUnit(30));
                    brx[i] = Math.floor(Math.random() * screen_unitX);
                    bry[i] = Math.floor(Math.random() * screen_unitY);
                }
            }
            for (i = BRINK_NUM - 1; i >= 0; i--) {
                cc.fillStyle = brc[i];
                cc.beginPath();
                cc.arc(brx[i], bry[i], brr[i], 0, Math.PI * 2, false);
                cc.fill();
            }
        }

        // 正時処理
        if (parseInt(DD.getSeconds()) == 0 && !isMedaka) {
/**/
            if (chimeON != parseInt(DD.getMinutes()) &&
                (Math.floor(Math.random() * 30) == 1 || monthDay == 1103)) {
                chimeON = parseInt(DD.getMinutes());
                initChime();
                isMedaka = true;
            }
/**/
/*        if (chimeON != parseInt(DD.getMinutes())) { // deBug
                chimeON = parseInt(DD.getMinutes());
                initChime();
                isMedaka = true;
            }
*/
        }
        else {
            chimeON = parseInt(DD.getMinutes());
        }

        if (isMedaka) {
            chimeMove();
        }

        // 時計
        hour = parseInt(DD.getHours()); // 0 - 23
        minute = parseInt(DD.getMinutes()); // 0 -59


        cc.drawImage(num[Math.floor(hour / 10)],
                     calcUnitX(3), calcUnitY(5),
                     calcUnit(50), calcUnit(70)
                    );
        cc.drawImage(num[hour % 10],
                     calcUnitX(3) + calcUnit(50), calcUnitY(5),
                     calcUnit(50), calcUnit(70)
                    );
        cc.drawImage(coron,
                     calcUnitX(3) + calcUnit(100), calcUnitY(5),
                     calcUnit(50), calcUnit(70)
                    );
        cc.drawImage(num[Math.floor(minute / 10)],
                       calcUnitX(3) + calcUnit(150), calcUnitY(5),
                     calcUnit(50), calcUnit(70)
                    );
        cc.drawImage(num[minute % 10],
                     calcUnitX(3) + calcUnit(200), calcUnitY(5),
                     calcUnit(50), calcUnit(70)
                    );
        cc.globalAlpha = 1.0;

        // 天候描画
        drawWeather();

        // 金魚ちゃん描画
        if (fishLoaded) {
            cc.save();
            f_width = calcUnit(f_size);
            f_exp = f_size / fish.height;
            //f_exp = f_width / f_size;
            //f_height = calcUnit(Math.floor(fish.height * f_exp));
            f_height = Math.floor((fish.height * f_width / fish.width) + 0.5);

            if (dx > 0) {
                cc.scale(-1, 1);
                if (isFool) {
                    cc.drawImage(efish, calcUnitX(-fx), calcUnitY(fy),
                                 f_width, f_height);
                }
                else {
                    cc.drawImage(fish, calcUnitX(-fx), calcUnitY(fy),
                                 f_width, f_height);
                }
            }
            else {
                if (isFool) {
                    cc.drawImage(efish, calcUnitX(fx), calcUnitY(fy),
                                 f_width, f_height);
                }
                else {
                    cc.drawImage(fish, calcUnitX(fx), calcUnitY(fy),
                                 f_width, f_height);
                }
            }
            moveFish();
            cc.restore();
        }


        // 地面の描画
        //private final int GROUNDCOLOR = 0xdd782a;
        // min = 42240d

        red = calcColor(h, 0xdd, 0x42);
        green = calcColor(h, 0x78, 0x24);
        blue = calcColor(h, 0x2a, 0x2a);
        color = 'rgb(' +
            Math.floor(red) + ',' +
            Math.floor(green) + ',' +
            Math.floor(blue) + ')';
        cc.fillStyle = color;
        GROUND_H = calcUnitY(20);
        if (!forceBlack) {
            cc.fillRect(0, canvas.height - GROUND_H,
                        canvas.width, canvas.height);
        }

        // えさ!
        if (feeding) {
            //private final int FEEDCOLOR = 0xcc6719;
            //cc.fillStyle = "rgb(0xcc, 0x67, 0x19)";
            cc.fillStyle = 'rgb(204, 103, 19)';
            for (i = 0; i < FOOD_NUM; i++) {
                //foodx[i] = x;
                //foody[i] = 0;
                cc.beginPath();
                cc.arc(calcUnitX(foodx[i]), calcUnitY(foody[i]),
                       2, 0, Math.PI * 2, false);
                cc.fill();
            }
            movefood();
        }

        // ぶくぶく
        cc.fillStyle = 'rgb(255, 255, 255)';
        bx = Math.floor(canvas.width - canvas.width / 3);

        for (i = 5; i > 0; i--) {
            r = Math.floor(Math.random() * calcUnit(10) + calcUnit(4));
            x = Math.floor(bx + Math.random() * calcUnitX(41) - calcUnitX(20));
            y = Math.floor(Math.random() * canvas.height) - GROUND_H;
            cc.beginPath();
            cc.arc(x, y, r, 0, Math.PI * 2, false);
            cc.fill();
        }

        // 水草
        px0 = 51;
        py0 = 238;
        cc.strokeStyle = 'rgb(0, 136, 0)';
        cc.lineWidth = calcUnit(2);
        for (i = 0; i < PLANT_NUM / 2; i++) {
            px_h = px[i] * TempHosei;
            py_h = py[i] * TempHosei;
            cc.beginPath();
            cc.moveTo(calcUnitX(px0), calcUnitY(py0));
            cc.bezierCurveTo(
                calcUnitX(Math.floor(px0 + px_h * 0.4)),
                calcUnitY(py0),
                calcUnitX(px0 + px_h),
                calcUnitY(Math.floor(py0 - py_h * 0.4)),
                calcUnitX(px0 + px_h), calcUnitY(py0 - py_h));
            cc.stroke();
        }
        for (i = PLANT_NUM / 2; i < PLANT_NUM; i++) {
            px_h = px[i] * TempHosei;
            py_h = py[i] * TempHosei;
            cc.beginPath();
            cc.moveTo(calcUnitX(px0), calcUnitY(py0));
            cc.bezierCurveTo(
                calcUnitX(Math.floor(px0 - px_h * 0.4)),
                calcUnitY(py0),
                calcUnitX(px0 - px_h),
                calcUnitY(Math.floor(py0 - py_h * 0.4)),
                calcUnitX(px0 - px_h), calcUnitY(py0 - py_h));
            cc.stroke();
        }
        // 水草 move
        for (i = 0; i < PLANT_NUM; i++) {
            px[i] += Math.floor(Math.random() * 3 - 1);
            py[i] += Math.floor(Math.random() * 3 - 1);
            if (px[i] > 40) {
                px[i] = 40;
            }
            else if (px[i] < 0) {
                px[i] = 0;
            }
            if (py[i] > 200) {
                py[i] = 200;
            }
            else if (py[i] < 100) {
                py[i] = 100;
            }
        }

        cc.restore();
        setTimeout(loop, fps.getInterval());
    };

    loop();
};

function getWeather(time) {
    //openweathermap（天気予報API）に接続
    var cityName = 'tokyo';
    var owmApiKey = 'APIKEY';
    var owmURL = 'http://api.openweathermap.org/data/2.5/weather?q=' +
        cityName + '&APPID=' + owmApiKey + '&units=metric';

    if (time != WeatherLastCheckTime) {
        WeatherRequest.open('GET', owmURL, true);
        //結果をjson型で受け取る
        WeatherRequest.responseType = 'json';
        WeatherRequest.send();
        WeatherLastCheckTime = time;
    }

    WeatherRequest.onreadystatechange = function() {
        // 通信完了
        if (WeatherRequest.readyState == 4) {
            var data = this.response;

            WeatherConditionCode = data['weather'][0]['id'];
            var temp = data['main']['feels_like'];
            //var t_min = data['main']['temp_min'];
            //var t_max = data['main']['temp_max'];
            var t_min = 5.0;
            var t_max = 30.0;

            //temp = 35; // debug

            if (t_max != t_min) {
                TempHosei = ((1.1 * (temp - t_min)) / (t_max - t_min)) + 0.1;
            }
            else {
                TempHosei = 0;
            }

            if (TempHosei < 0.1) {
                TempHosei = 0.1;
            }
            else if (TempHosei > 1.2) {
                TempHosei = 1.2;
            }

            console.log('code = ' + WeatherConditionCode);
            console.log('temp = ' + data['main']['temp']);
            console.log('feels_temp = ' + temp);
            console.log('temp_min = ' + t_min);
            console.log('temp_max = ' + t_max);
            console.log('TempHosei = ' + TempHosei);
        }
    };
}

function drawWeather() {
    //WeatherConditionCode = 230; // deBug

    var wgroup = Math.floor(WeatherConditionCode / 100);

    cc.save();
    switch (wgroup) {
    case 2: // Thunderstorm
        drawThnderstorm(WeatherConditionCode);
        break;
    case 3: // Drizzle
        drawDrizzle(WeatherConditionCode);
        break;
    case 5: // Rain
        drawRain(WeatherConditionCode);
        break;
    case 6: // Snow
        drawSnow(WeatherConditionCode);
        break;
    case 7: // Atmosphere
        break;
    case 8: // Clear & Clouds
        break;
    }
    cc.restore();
}

function drawThnderstorm(code) {
    var vol;
    vol = (code % 10) * 10 + 10;
    switch (code) {
    case 200: // Thunderstorm thunderstorm with light rain (11d)
    case 201: // Thunderstorm thunderstorm with rain (11d)
    case 202: // Thunderstorm thunderstorm with heavy rain (11d)
        drawRain(code + 300);
        break;
    case 210: // Thunderstorm light thunderstorm (11d)
    case 211: // Thunderstorm thunderstorm (11d)
    case 212: // Thunderstorm heavy thunderstorm (11d)
    case 221: // Thunderstorm ragged thunderstorm (11d)
        break;
    case 230: // Thunderstorm thunderstorm with light drizzle (11d)
    case 231: // Thunderstorm thunderstorm with drizzle (11d)
    case 232: // Thunderstorm thunderstorm with heavy drizzle (11d)
        drawDrizzle(code + 100);
        break;
    }

    if (Math.random() * 100 < vol) {
        cc.fillStyle = 'rgb(255, 255, 255)';
        cc.fillRect(0, 0, canvas.width, canvas.height);
    }
}

function drawDrizzle(code) {
    var sx, sy;
    var st; // 角度
    var sl; // 長さ
    var vol;

    cc.strokeStyle = 'rgb(255, 255, 255)';
    cc.lineWidth = calcUnit(1);

    vol = (code % 10) * 20 + 10;
    st = (code % 10) * 6 + 93;
    st = (st * Math.PI) / 180; // ラジアンにする!

//case 300: // Drizzle light intensity drizzle (09d)
//case 301: // Drizzle drizzle (09d)
//case 302: // Drizzle heavy intensity drizzle (09d)
//case 310: // Drizzle light intensity drizzle rain (09d)
//case 311: // Drizzle drizzle rain (09d)
//case 312: // Drizzle heavy intensity drizzle rain (09d)
//case 313: // Drizzle shower rain and drizzle (09d)
//case 314: // Drizzle heavy shower rain and drizzle (09d)
//case 321: // Drizzle shower drizzle (09d)

    cc.strokeStyle = 'rgb(128, 128, 128)';
    for (i = vol; i > 0; i--) {
        sx = Math.floor(Math.random() * canvas.width);
        sy = Math.floor(Math.random() * canvas.height);
        sl = Math.floor(Math.random() * calcUnit(UNIT));
        cc.beginPath();
        cc.moveTo(sx, sy);
        cc.lineTo(sx + sl * Math.cos(st), sy - sl * Math.sin(st));
        cc.stroke();
    }
}
function drawRain(code) {
    var sx, sy;
    var st; // 角度
    var sl; // 長さ
    var vol;

    cc.strokeStyle = 'rgb(255, 255, 255)';
    cc.lineWidth = calcUnit(1);

    vol = (code % 10) * 20 + 10;
    st = (code % 10) * 6 + 93;
    st = (st * Math.PI) / 180; // ラジアンにする!

    switch (code) {
    case 511: // Rain freezing rain (13d)
        drawSnow(600);
        break;
    case 500: // Rain light rain (10d)
    case 501: // Rain moderate rain (10d)
    case 502: // Rain heavy intensity rain (10d)
    case 503: // Rain very heavy rain (10d)
    case 504: // Rain extreme rain (10d)
        cc.strokeStyle = 'rgb(255, 255, 255)';
        break;
    case 520: // Rain light intensity shower rain (09d)
    case 521: // Rain shower rain (09d)
    case 522: // Rain heavy intensity shower rain (09d)
    case 531: // Rain ragged shower rain (09d)
        cc.strokeStyle = 'rgb(128, 128, 128)';
        break;
    }
    for (i = vol; i > 0; i--) {
        sx = Math.floor(Math.random() * canvas.width);
        sy = Math.floor(Math.random() * canvas.height);
        sl = Math.floor(Math.random() * calcUnit(UNIT));
        cc.beginPath();
        cc.moveTo(sx, sy);
        cc.lineTo(sx + sl * Math.cos(st), sy - sl * Math.sin(st));
        cc.stroke();
    }
}
function drawSnow(code) {
    var sx, sy, sr;
    var vol = 50; // 雪の量
    cc.fillStyle = 'rgb(255, 255, 255)';

    switch (code) {
    case 600: // Snow light snow (13d)
    case 612: // Snow Light shower sleet (13d)
    case 615: // Snow Light rain and snow (13d)
    case 620: // Snow Light shower snow (13d)
        vol = 50;
        break;
    case 601: // Snow Snow (13d)
    case 611: // Snow Sleet (13d)
    case 621: // Snow Shower snow (13d)
    case 613: // Snow Shower sleet (13d)
        vol = 100;
        break;
    case 602: // Snow Heavy snow (13d)
    case 616: // Snow Rain and snow (13d)
    case 622: // Snow Heavy shower snow (13d)
        vol = 200;
        break;
    }

    for (i = vol; i > 0; i--) {
        sx = Math.floor(Math.random() * canvas.width);
        sy = Math.floor(Math.random() * canvas.height);
        sr = Math.floor(Math.random() * calcUnit(5) + calcUnit(1));
        cc.beginPath();
        cc.arc(sx, sy, sr, 0, Math.PI * 2, false);
        cc.fill();
    }
}

function initChime() {
    if (monthDay == 1103) { // ブルーインパルス
        bluePos[0] = new Pos(-blueS.width, 3, 90, 0);
        bluePos[1] = new Pos(-blueS.width * 2, 3, 50, 0);
        bluePos[2] = new Pos(-blueS.width * 2, 3, 130, 0);
        bluePos[3] = new Pos(-blueS.width * 3, 3, 90, 0);
        bluePos[4] = new Pos(-blueS.width * 3, 3, 10, 0);
        bluePos[5] = new Pos(-blueS.width * 3, 3, 170, 0);
        for (j = 0; j < BLUEMAX; j++) {
            for (i = 0; i < SMOKEMAX; i++) {
                smoke[j][i] = new Pos(i * UNIT / SMOKEMAX, 0,
                                      bluePos[j].y + (blueS.height * 0.55), 0);
            }
        }
        isBlue = true;
    }
    else {
        switch (Math.floor(Math.random() * 6)) {
        //switch (5) { // debug
        case 0: // メダカ
            medakaNum = 0;
            mx = UNIT;
            my = 120;
            mdy = 0;
            mdx = -5;
            mddx = 1;
            mddxd = -5;
            mddy = 1;
            mddyd = 0;
            break;
        case 1: // イエローサブマリン
            medakaNum = 1;
            mx = -medaka[medakaNum].width;
            my = 50;
            mdy = 0;
            mdx = 1;
            mddx = 1;
            mddxd = 1;
            mddy = 3;
            mddyd = -1;
            break;
        case 2: // モアイ
            medakaNum = 2;
            mx = UNIT;
            my = UNIT - medaka[medakaNum].height - 20;
            mdy = 0;
            mdx = -1;
            mddx = 1;
            mddxd = -1;
            mddy = 0;
            mddyd = 0;
            break;
        case 3: // タケぼうず
            isBozu = true;
            bozuCt = 0;
            mx = UNIT;
            my = (UNIT - 20 - bozu[0].height) / 2;
            mdy = 0;
            mdx = -1;
            mddx = 1;
            mddxd = -1;
            mddy = 0;
            mddyd = 0;
            break;
        case 4: // コマジェ
            medakaNum = 3;
            mx = -medaka[medakaNum].width;
            my = UNIT - medaka[medakaNum].height - 20;
            mdy = 0;
            mdx = 1;
            mddx = 0;
            mddxd = 5;
            mddy = 0;
            mddyd = 0;
            for (i = 0; i < KSMOKEMAX; i++) {
                ksmoke[i] = new Pos(i * UNIT / KSMOKEMAX, 0,
                                      UNIT - 22, -1);
            }
            break;
        case 5: // ベスパ
            medakaNum = 4;
            mx = -medaka[medakaNum].width;
            my = UNIT - medaka[medakaNum].height - 20;
            mdy = 0;
            mdx = 1;
            mddx = 0;
            mddxd = 2;
            mddy = 0;
            mddyd = 0;
            for (i = 0; i < KSMOKEMAX; i++) {
                ksmoke[i] = new Pos(i * UNIT / KSMOKEMAX, 0,
                                      UNIT - 22, -1);
            }
            break;
        }
    }
}

function chimeMove() {
    if (isBozu) {
        cc.drawImage(bozu[bozuCt],
                     calcUnitX(mx), calcUnitY(my),
                     calcUnit(bozu[bozuCt].width),
                     calcUnit(bozu[bozuCt].height)
                    );
        mx--;
        bozuCt++;
        bozuCt %= BOZUMAX;
        if (calcUnitX(mx) < -calcUnit(bozu[0].width)) {
            isBozu = false;
            isMedaka = false;
        }
    }
    else if (isBlue) {
        for (b = 0; b < BLUEMAX; b++) {
            cc.drawImage(blueS,
                         calcUnitX(bluePos[b].x), calcUnitY(bluePos[b].y),
                         calcUnit(blueS.width), calcUnit(blueS.height));
            var SMOKE_ALPHA = 96; // 小さい程早く消える
            if (b != 0) { // 1号機はスモークひかない!
                for (i = 0; i < SMOKEMAX; i++) {
                    if (smoke[b][i].x < bluePos[b].x) {
                        var a = 1.0 -
                            smoke[b][i].time / SMOKE_ALPHA +
                            Math.random() / 10.0;
                        if (a < 0.0) {
                            a = 0.0;
                        }
                        cc.globalAlpha = a;
                        cc.fillStyle = 'rgb(255, 255, 255)';
                        cc.beginPath();
                        cc.arc(calcUnitX(smoke[b][i].x),
                               calcUnitY(smoke[b][i].y),
                               calcUnit(
                                   Math.max(1,
                                            (smoke[b][i].time +
                                             (Math.random() * 6 - 3)) / 10)
                               ),
                               0,
                               Math.PI * 2, false);
                        cc.fill();
                        cc.globalAlpha = 1.0;
                        smoke[b][i].move();
                        //smoke[i].y += (Math.random() / 2.0 - 0.25);
                        // smoke[b][i].y += (Math.random() - 0.5);
                        smoke[b][i].y += (Math.random() * 5.0 - 2.5);
                    }
                }
            }
            bluePos[b].move();
        }
        a = SMOKEMAX - 1;
        b = BLUEMAX - 1;
        if (smoke[b][a].time / SMOKE_ALPHA > 1.0) {
            isBlue = false;
            isMedaka = false;
        }
    }
    else {
        if (medakaNum != 2 && medakaNum != 3 && medakaNum != 4) { // モアイ，コマジェ以外
            cc.drawImage(medaka[medakaNum],
                         calcUnitX(mx), calcUnitY(my),
                         calcUnit(medaka[medakaNum].width),
                         calcUnit(medaka[medakaNum].height)
                        );
        }
        else { // モアイ，コマジェは地面
            cc.drawImage(medaka[medakaNum],
                         calcUnitX(mx),
                         screen_unitY - calcUnit(medaka[medakaNum].height) -
                         calcUnitY(20),
                         calcUnit(medaka[medakaNum].width),
                         calcUnit(medaka[medakaNum].height)
                        );
        }
        mdx = Math.floor((Math.random() * mddx)) + mddxd;
        mdy = Math.floor((Math.random() * mddy)) + mddyd;
        mx += mdx;
        my += mdy;
        if (medakaNum == 3 || medakaNum == 4) { // コマジェ スモーク処理
            var SMOKE_ALPHA = 64; // 小さい程早く消える
            for (i = 0; i < KSMOKEMAX; i++) {
                if (ksmoke[i].x < mx) {
                    var a = 1.0 -
                        ksmoke[i].time / SMOKE_ALPHA +
                        Math.random() / 10.0;
                    if (a < 0.0) {
                        a = 0.0;
                    }
                    cc.globalAlpha = a;
                    cc.fillStyle = 'rgb(255, 255, 255)';
                    cc.beginPath();
                    cc.arc(calcUnitX(ksmoke[i].x),
                           calcUnitY(ksmoke[i].y),
                           calcUnit(
                               Math.max(0,
                                        (ksmoke[i].time +
                                         (Math.random() * 6 - 3))
                                        ) / 1.5) + 1,
                           0,
                           Math.PI * 2, false);
                    cc.fill();
                    cc.globalAlpha = 1.0;
                    ksmoke[i].move();
                    ksmoke[i].y += (Math.random() * 6.0 - 4.0) -
                        ksmoke[i].time / 20.0;
                }
            }
            a = KSMOKEMAX - 1;
            if (ksmoke[a].time / SMOKE_ALPHA > 1.0) {
                isMedaka = false;
            }
        }
        else if (calcUnitX(mx) < -calcUnitX(medaka[medakaNum].width) ||
            calcUnitX(mx) > screen_unitX + calcUnitX(medaka[medakaNum].width)) {
            isMedaka = false;
        }
    }
}

function initData() {
    NowTime = today.getTime();

    // データロード
    loadData();

    BirthTime = getCookie('BirthTime');

    if (BirthTime == null) {
        LastFoodTime = BirthTime = NowTime;

        saveData();
        window.alert('大事に育てて下さい。');
    }

    loadFish(); // 金魚画像ロード
    loadNum(); // 時計の数字ロード
    loadWall(); // 壁紙のロード
    loadGuest(); // ゲストのロード
    loadChibi();
    loadMedaka();
}

function loadMedaka() {
    for (i = 0; i < MEDAKAMAX; i++) {
        medaka[i] = new Image();
    }
    var i = 0;
    medaka[i++].src = './res/medaka.png';
    medaka[i++].src = './res/submarine.png';
    medaka[i++].src = './res/moai.png';
    medaka[i++].src = './res/komaje.png';
    medaka[i++].src = './res/vespa.png';

    for (i = 0; i < BOZUMAX; i++) {
        bozu[i] = new Image();
        bozu[i].src = './res/b' + i + '.png';
    }

    for (i = 0; i < 30; i++) {
        moon[i] = new Image();
        if (i == 15) {
            moon[i].src = './res/moon.png';
        }
        else if (i < 10) {
            moon[i].src = './res/m0' + i + '.png';
        }
        else {
            moon[i].src = './res/m' + i + '.png';
        }
    }

    hanabi = new Image();
    hanabi.src = './res/hanabi.png';

    blueS = new Image();
    blueS.src = './res/blueS.png';
}


function loadChibi() {
    chibi[0] = new Image();
    chibi[1] = new Image();
    chibi[0].src = './res/c0.png';
    chibi[1].src = './res/c1.png';
}

// ゲスト画像の読み込み
function loadGuest() {
    for (i = 0; i < 6; i++) {
        guest[i] = new Image();
    }
    var i = 0;
    guest[i++].src = './res/g1_24.png';
    guest[i++].src = './res/g5_5.png';
    guest[i++].src = './res/g7_7.png';
    guest[i++].src = './res/g7_24.png';
    guest[i++].src = './res/g11_12.png';
    guest[i++].src = './res/blueDelta.png';
}

// 壁紙画像の読み込み
function loadWall() {
    for (i = 0; i < 12; i++) {
        wall[i] = new Image();
    }
    var i = 0;
    wall[i++].src = './res/w1_1.png';
    wall[i++].src = './res/w2_14.png';
    wall[i++].src = './res/w3_3.png';
    wall[i++].src = './res/w4_26.png';
    wall[i++].src = './res/w5_10.png';
    wall[i++].src = './res/w6_12.png';
    wall[i++].src = './res/w7_7.png';
    wall[i++].src = './res/w8_6.png';
    wall[i++].src = './res/w9_7.png';
    wall[i++].src = './res/w9_10.png';
    wall[i++].src = './res/w10_31.png';
    wall[i++].src = './res/w12_24.png';
}

// 時計用の数字画像読み込み
function loadNum() {
    coron.onload = function() {
        coronLoaded = true;
    };
    coron.src = './res/nc.png';

    for (i = 0; i < 10; i++) {
        num[i] = new Image();
        num[i].src = './res/n' + i + '.png';
    }
}

// エサ投入! (マウスアップ)
function mouseupfunc(event) {
    var rect = event.target.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;

    if (!feeding) {
        var DD = new Date();
        var key = DD.getHours() * 60 + DD.getMinutes();
        getWeather(key);

        for (i = 0; i < FOOD_NUM; i++) {
            //foodx[i] = x;
            foodx[i] = x * 256 / canvas.width;
            foody[i] = 0;
        }
        LastFoodTime = NowTime;
        saveData();
        feeding = true;
    }
}

// エサの移動
function movefood() {
    feeding = false;
    for (i = 0; i < FOOD_NUM; i++) {
        if (foody[i] != -1) {
            //dy = Math.floor((Math.random() * 2)) - 1;

            if (Math.floor((Math.random() * 3)) == 0) {
                foody[i] += 1;
            }
            //if(foody[i] >= canvas.height - GROUND_H) {
            if (foody[i] >= 236) {
                foody[i] = -1;
            }
            else {
                foodx[i] += Math.floor((Math.random() * 5)) - 2;
                if (foodx[i] < 0) {
                    foodx[i] = 1;
                }
                //else if(foodx[i] > canvas.width) {
                else if (foodx[i] > 256) {
                    foodx[i] = 255;
                }
                feeding = true;
            }
        }
        }
}

// クッキーセット
function setCookie(name, value, expires, domain, path, secure) {
    var c = '';
    c += name + '=' + encodeURIComponent(value);
    if (expires){
        var exp = new Date();
        exp.setDate(exp.getDate() + expires);
        c += '; expires=' + exp.toGMTString();
    }
    if (domain) {
        c += '; domain=' + domain;
    }
    if (path) {
        c += '; path=' + path;
    }
    if (secure) {
        c += '; secure';
    }
    document.cookie = c;
}

// クッキーゲット
function getCookie(name) {
    var cs = document.cookie.split('; ');
    for (var i = 0; i < cs.length; i++) {
        var kv = cs[i].split('=');
        if (kv[0] == name) {
            return decodeURIComponent(kv[1]);
        }
    }
    return null;
}

// データロード
function loadData() {
    BirthTime = getCookie('BirthTime');
    LastFoodTime = getCookie('LastFoodTime');
    HungryTime = getCookie('HungryTime');
    //RestTime = getCookie('RestTime');
    Age = getCookie('Age');
    IsFirst = getCookie('IsFirst');
    LastMonthDay = getCookie('LastMonthDay');
    AboutSeed = getCookie('AboutSeed');

    if (HungryTime < NowTime - DEAD_TIME) {
        HungryTime = NowTime - DEAD_TIME;
        setCookie('HungryTime', HungryTime, period);
    }
    else if (HungryTime > NowTime + DEAD_TIME) {
        HungryTime = NowTime - DEAD_TIME;
        setCookie('HungryTime', HungryTime, period);
    }
}
// データセーブ
function saveData() {
    // クッキー
    setCookie('BirthTime', BirthTime, period);
    setCookie('LastFoodTime', LastFoodTime, period);
    setCookie('HungryTime', HungryTime, period);
    //setCookie('RestTime', RestTime, period);
    setCookie('Age', Age, period);
    setCookie('IsFirst', IsFirst, period);
    setCookie('LastMonthDay', LastMonthDay, period);
    setCookie('AboutSeed', AboutSeed, period);
}

// 金魚ちゃん画像のロード
function loadFish() {
    fish = new Image();
    fish.onload = function() {
        fishLoaded = true;
    };
    f_size = 120;
    fish.src = './res/100.png';

    efish = new Image();
    efish.src = './res/k.png';
}

// 金魚ちゃん移動
function moveFish() {
    // 50回に一回 x 反転
    // 5回に一回 y 変化
    /*
      if(((rand.nextInt() >>> 1) % 50) == 0) {
      dx *= -1;
      }
      if(((rand.nextInt() >>> 1) % 5) == 0) {
      dy = ((rand.nextInt() >>> 1) % 3) -1;
      }
    */
    var today = new Date();
    NowTime = today.getTime();

/*
    if (NowTime - LastFoodTime > DEAD_TIME + (Age - 4) * 3600000) { // 餓死
        //if(NowTime - LastFoodTime > 5000) { // debug
        BirthTime = NowTime;
        //RestTime = NowTime - LastFoodTime;
        LastFoodTime = NowTime;
        saveData();
        window.alert('きんぎょは寂しさのあまり，愛を求める旅に出ました。\n次の新しい金魚にはたっぷりと愛情を与えて育てて下さい。');
        //window.alert("きんぎょは寂しさと空腹で泣いています。このままだと愛を求める旅に出てしまいますよ。");
        loadFish();
    }
*/
    if (feeding && HungryTime < NowTime) { // エサ
        eatfood();
    }
    else {
        if (Math.floor(Math.random() * 50) == 0) {
            dx *= -1;
        }
        if (Math.floor(Math.random() * 5) == 0) {
            dy = Math.floor((Math.random() * 3)) - 1;
        }
    }
    fx += dx;
    fy += dy;
    if (fx < 0) {
        dx = 1;
    }
    else if (fx > 256) {
        dx = -1;
    }
    if (fy < 0) {
        dy = 1;
    }
    else if (fy > 235 - f_height) {
        dy = -1;
    }
}

// エサを食べに行く!
function eatfood() {
    var min = 0x20000;
    var targetFood;
    for (i = 0; i < FOOD_NUM; i++) {
        if (foody[i] != -1) {
            fdis = (foodx[i] - fx) * (foodx[i] - fx) +
                (foody[i] - fy) * (foody[i] - fy);
            if (min > fdis) {
                min = fdis;
                targetFood = i;
            }
        }
    }
    if (min < 36) {
        foody[targetFood] = -1; // 食べた
        HungryTime += FOOD_TIME;
        //NowTime = today.getTime();
        if (HungryTime < NowTime - DEAD_TIME) {
            HungryTime = NowTime - DEAD_TIME;
        }
        else if (HungryTime > NowTime + DEAD_TIME) {
            HungryTime = NowTime - DEAD_TIME;
        }
        setCookie('HungryTime', HungryTime, period);
        //saveData();
        return;
    }
    if (foodx[targetFood] < fx) {
        dx = -1;
    }
    else { //if(food.x[targetFood] - x < 0) {
        dx = 1;
    }

    var disY;
    if ((disY = foody[targetFood] - fy) > 0) { // 下にある時
        if (disY > 30) { // 遠い時は急いで潜る
            dy = 4;
        }
        else if (disY > 5) {
            dy = 1;
        }
        else {
            dy = 0;
        }
    }
    else { // 上にある時
        if (disY > 30) { // 遠い時は急いで浮上!
            dy = -4;
        }
        else if (disY < -5) {
            dy = -1;
        }
        else {
            dy = 0;
        }
    }
}

function calcColor(h, max, min) {
    return ((max - min) * h) / 43200 + min;
}

function calcUnit(n) {
    return Math.floor((screen_unit * n) / UNIT);
}
function calcUnitX(n) {
    return Math.floor((screen_unitX * n) / UNIT);
}
function calcUnitY(n) {
    return Math.floor((screen_unitY * n) / UNIT);
}
