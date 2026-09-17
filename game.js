// ============================================================
//  勉強会(2)  傾きで玉を動かす
// ============================================================
//
//  このファイルにコードを書いていく。上から順に進める。
//
//
//  用意されている関数と定数
//
//    tilt.x          端末の左右の傾き  -1 〜 1（右に倒すと +）
//    tilt.y          端末の前後の傾き  -1 〜 1（手前に倒すと +）
//    drawBall(x, y)  指定した座標に玉を描く
//    BOARD_W         盤の幅   300
//    BOARD_H         盤の高さ 400
//
//  座標系は左上が (0, 0)、右下が (BOARD_W, BOARD_H)。
//  y は下向きが正。数学のグラフとは上下が逆なので注意。
//
//
//  実行
//    保存 → ブラウザを再読み込み。端末がなければ矢印キーで傾く。
//    エラーは画面下部に表示される。
//
// ============================================================




// ============================================================
//  STEP 0 - 4 は解説しながら一緒に進める
// ============================================================


// ------------------------------------------------------------
//  STEP 0   このファイルを index.html から読み込む
// ------------------------------------------------------------
//  前回作った index.html の </body> の直前に、次の3行を足す。
//
//      <script src="three.min.js"></script>
//      <script src="engine.js"></script>
//      <script src="game.js"></script>
//
//  script タグは外部の JavaScript ファイルを読み込むタグ。
//  上から順に読み込まれるので、この順番を入れ替えてはいけない。
//  engine.js は three.min.js を使い、game.js は engine.js を使うため。
//
//  確認: 盤が木目の3D表示に変わる。
//        画面の下に「update() が見つかりません」と赤く出れば正常。
//        STEP 2 でその update() を書くと消える。


// ------------------------------------------------------------
//  STEP 1   玉の状態を持つ
// ------------------------------------------------------------
//  位置と速度を1つのオブジェクトにまとめる。
//
//      let ball = { x: 150, y: 200, vx: 0, vy: 0 };


let ball = { x: 30, y: 20, vx: 0, vy: 0 };
let goal = { x: 270, y: 370, r: 15 };
let cleared = false;
let startTime = Date.now();
let walls = [
 { x: 50,  y: 70,  w: 250, h: 16 }, // 上の方の壁（左側に隙間）
  { x: 0,   y: 140, w: 230, h: 16 }, // 2段目の壁（右側に隙間）
  { x: 70,  y: 210, w: 230, h: 16 }, // 3段目の壁（左側に隙間）
  { x: 0,   y: 280, w: 240, h: 16 }, // 4段目の壁（右側に隙間）
  {x: 0, y:35, w:250, h:8},
  {x:210, y:330, w:150, h:10},

  // 行き止まりや迷い道を作る縦の壁
  { x: 140, y: 70,   w: 16,  h: 50 },  // スタート直後の分岐
  { x: 210, y: 190, w: 16,  h: 30 },  // 罠の壁
  { x: 70,  y: 250, w: 16,  h: 40 },  // 行き止まりブロック
  { x: 150, y: 280, w: 16,  h: 50 },
    { x: 210, y: 340, w: 10,  h: 25 },
    {x:30, y:360, w:190, h:10},
    { x: 100, y: 340, w: 16,  h: 30 },
]



// ------------------------------------------------------------
//  STEP 2   描画する
// ------------------------------------------------------------
//  update() は engine が毎フレーム（1秒に約60回）呼び出す。
//  この関数の中身が繰り返し実行される。
//
//      function update() {
//        drawBall(ball.x, ball.y);
//      }
//
//  確認: 画面中央に玉が表示される。まだ動かない。

function hitWall() {
for (let i = 0; i < walls.length; i++) {
    let w = walls[i];
    if (ball.x > w.x && ball.x < w.x + w.w &&
     ball.y > w.y && ball.y < w.y + w.h) {
    return true;
    }
    }
    return false;
    }


function update() {
   ball.vx = ball.vx + tilt.x * 0.1;
   ball.vy = ball.vy + tilt.y * 0.1;


   
for (let i = 0; i < walls.length; i++) {
drawWall(walls[i].x, walls[i].y, walls[i].w, walls[i].h);
}

let prevX = ball.x;
ball.x = ball.x + ball.vx;
if (hitWall()) {
    ball.x = prevX;
    ball.vx = -ball.vx * 0.5;
}

let prevY = ball.y;
ball.y = ball.y + ball.vy;
if(hitWall()){
    ball.y = prevY;
    ball.vy= -ball.vy*0.5
} 


drawGoal(goal.x, goal.y, goal.r);
if(cleared == false){
    drawBall(ball.x, ball.y);
}
   
   if (ball.x<0){
    ball.x=0;
     ball.vx=-ball.vx*0.5;
}

if(ball.y<0){
    ball.y=0;
    ball.vy=-ball.vy*0.5;
}
if(ball.x>300){
    ball.x=300;
     ball.vx=-ball.vx*0.7;
}
if(ball.y>400){
    ball.y=400;
     ball.vy=-ball.vy*0.7;
}
ball.vx=ball.vx*0.99
ball.vy=ball.vy*0.99

// --- ここから追加：花火を描画する処理 ---
let fwCanvas = document.getElementById("fireworks");
let fwCtx = fwCanvas ? fwCanvas.getContext("2d") : null;
let particles = [];
let isFireworksRunning = false;

function startFireworks() {
    if (!fwCanvas) return;
    fwCanvas.width = window.innerWidth;
    fwCanvas.height = window.innerHeight;
    isFireworksRunning = true;

    for (let i = 0; i < 100; i++) {
        let angle = Math.random() * Math.PI * 2;
        let speed = Math.random() * 6 + 2;
        particles.push({
            x: fwCanvas.width / 2,
            y: fwCanvas.height / 2,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            alpha: 1,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`
        });
    }
    animateFireworks();
}

function animateFireworks() {
    if (!isFireworksRunning || !fwCtx) return;
    fwCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1;
        p.alpha -= 0.02;

        if (p.alpha <= 0) {
            particles.splice(i, 1);
            continue;
        }

        fwCtx.save();
        fwCtx.globalAlpha = p.alpha;
        fwCtx.fillStyle = p.color;
        fwCtx.beginPath();
        fwCtx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        fwCtx.fill();
        fwCtx.restore();
    }

    if (particles.length > 0) {
        requestAnimationFrame(animateFireworks);
    } else {
        isFireworksRunning = false;
    }
}




// 既存のゴール判定の部分を、次のように書き換えます
let dx = ball.x - goal.x;
let dy = ball.y - goal.y;
let dist = Math.sqrt(dx * dx + dy * dy);
if (dist < goal.r && !cleared) {
    cleared = true;
    document.getElementById("message").textContent = "CLEAR";
    
    // 🌟 花火をスタート
    startFireworks();
}





}



// ------------------------------------------------------------
//  STEP 3   位置を更新する
// ------------------------------------------------------------
//  update() の中、drawBall() より前に1行足す。
//
//      ball.x = ball.x + 2;
//
//  毎フレーム x が2ずつ増えるので、玉は右へ進む。
//
//  確認: 玉が右へ流れ、そのまま画面外へ出ていく。
//        壁がないので当然こうなる。STEP 5 で閉じ込める。





// ------------------------------------------------------------
//  STEP 4   傾きを加速度として扱う
// ------------------------------------------------------------
//  STEP 3 で直接書いた 2 を、速度 vx に置き換える。
//  さらにその前で、傾きを速度に足し込む。
//
//      ball.vx = ball.vx + tilt.x * 0.5;
//      ball.vy = ball.vy + tilt.y * 0.5;
//
//      ball.x = ball.x + ball.vx;
//      ball.y = ball.y + ball.vy;
//
//  傾き（加速度）を速度に足し、速度を位置に足している。
//  高校物理の v = v0 + at, x = x0 + vt を、
//  t = 1フレーム として離散的に繰り返しているだけ。
//
//  だから傾け続けると加速し続ける。一定速度では動かない。
//
//  確認: 傾ける（矢印キー）と玉が動き、離しても止まらない。
//        0.5 は傾きの効き。あとで好きな値にしてよい。





// ============================================================
//
//  ここから先は自力で書く。
//  コメントは仕様であって、コードではない。
//
// ============================================================


// ------------------------------------------------------------
//  STEP 5   左の壁
// ------------------------------------------------------------
//  update() の中、drawBall() より前に書く。
//
//      もし ball.x が 0 より小さければ
//          ball.x を 0 に戻す
//          ball.vx の符号を反転する
//
//
//  「もし〜ならば」は if で書く。形はこう。
//
//      if (条件) {
//        条件が成り立ったときにやること
//      }
//
//  例）速度が 100 を超えていたら 100 で頭打ちにする
//
//      if (ball.vx > 100) {
//        ball.vx = 100;
//      }
//
//  比較は   <  小さい    >  大きい
//  符号の反転は  ball.vx = -ball.vx;
//
//  確認: 左へ転がすと壁で跳ね返る。





// ------------------------------------------------------------
//  STEP 6   右の壁
// ------------------------------------------------------------
//  右端をはみ出したら、押し戻して反射させる。
//  右端の座標は BOARD_W。
//
//  確認: 右でも跳ね返る。





// ------------------------------------------------------------
//  STEP 7   上下の壁
// ------------------------------------------------------------
//  y と vy、BOARD_H を使う。
//
//  確認: 四方で跳ね返り、玉が盤から出られなくなる。





// ============================================================
//
//  ここからは挙動の調整。正解はない。
//
// ============================================================


// ------------------------------------------------------------
//  STEP 8   反発係数と摩擦
// ------------------------------------------------------------
//  現状は速度が保存されるので永久に跳ね返り続ける。
//  4つの壁すべての反射に反発係数を掛ける。
//
//      ball.vx = -ball.vx * 0.5;
//
//  さらに、毎フレーム速度を一定割合で減らして摩擦を入れる。
//  update() の中、位置の更新より前に書く。
//
//      ball.vx = ball.vx * 0.98;
//      ball.vy = ball.vy * 0.98;
//
//  確認: 傾きを戻すと玉が減速して止まる。
//        反発係数を 0.9 / 0.2、摩擦を 0.90 / 1.00 にすると何が起きるか。





// ============================================================
//
//  発展
//
//    ・玉には半径10がある。壁にめり込んで見えるのを直す
//    ・空気抵抗を速度の2乗に比例させる（今は1次）
//    ・センサー値のノイズが気になる場合、
//      tilt に移動平均やローパスフィルタをかけて滑らかにする
//    ・玉を複数にして、玉どうしの衝突を扱う
//    ・壁ごとに反発係数を変える
//
// ============================================================
