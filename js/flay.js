var bird = {
	skymovestop : 2,
	skyposition : 0,
	startcolor : 'blue',
	birdtop : 235,
	nostart : true,
	birdstopY : 0,
	pipelength : 7,
	pipearr : [],
	pipelastindex : 6,
	score : 0,
	scorearr : [],
	
	
	
	//选中HTML元素 数据初始化
	initDate : function () {
		this.el = document.getElementById('flaybird');
		this.bird = this.el.getElementsByClassName('bird')[0];
		this.start = this.el.getElementsByClassName('start')[0];
		this.fengshu = this.el.getElementsByClassName('fengshu')[0];
		this.mask = this.el.getElementsByClassName('mask')[0];
		this.end = this.el.getElementsByClassName('end')[0];
		this.results = this.el.getElementsByClassName('final-score')[0];
		this.ranklist = this.el.getElementsByClassName('rank-list')[0];
		this.restart = this.el.getElementsByClassName('restart')[0];
		this.scorearr = this.scorepanduan();
		
	},
	
	
	//初始分数判断
	scorepanduan : function () {
		var scorearr = getlocal('score');
		return scorearr ? scorearr : [] ;
	},
	
	
	
	//执行函数
	start : function () {
		this.initDate();
		this.animate();
		this.handlestart();
		this.handleclick();
		
		
		
	},
	
	
	//翅膀切换
	birdfly : function (count) {
		this.bird.style.backgroundPositionX = count % 3 * -30 + 'px';
	},
	
	
	//计时器函数
	animate : function () {
		var count = 0;
		var that = this;
		this.timer = setInterval(function () {
			that.skymove();
			if (!that.nostart) {
				that.birddown();
				that.pipemove();
			}
			
			if (++ count % 10 == 0 ) {
				if (that.nostart) {
					that.startbound();
					that.birdmove();
					
					
				}
				that.birdfly(count);
			}
			
		},30)
		
	},
	
	
	
	//bird移动
	birdmove : function () {
		this.birdtop = this.birdtop === 220 ? 260 : 220;
		this.bird.style.top = this.birdtop + 'px';
	},
	
	
	//碰撞函数
	judgepige : function () {
		var index = this.score % this.pipelength;

		var pipex = this.pipearr[index].up.offsetLeft;
		var pipey = this.pipearr[index].y;
		var birdy = this.birdtop;
		if ((pipex <= 115 && pipex >= 53) && (birdy <= pipey[0] || birdy >=pipey[1])) {
			this.gameover();
		}
	},
	
	
	//游戏结束
	gameover : function () {
		clearInterval(this.timer);
		
		this.fengshu.style.display = 'none';
		this.mask.style.display = 'block';
		this.end.style.display = 'block';
		this.results.innerText = this.score;
		this.getscore();
		this.rank();
		this.handlerestart();
	},
	
	//分数存储
	getscore : function () {
		this.scorearr.push({
			feng : this.score,
			time : this.getdate(),
		})
		
		//分数数组排序
		this.scorearr.sort(function (a, b){
			return b.feng - a.feng;
		})
		
		//本地存储
		setlocal('score' , this.scorearr);
	},
	
	
	
	//时间
	getdate : function () {
		var d = new Date();
		var year = d.getFullYear();
		var month = d.getMonth() + 1 ;
		var day = d.getDate();
		var hour = d.getHours();
		var minute = d.getMinutes();
		var second = d.getSeconds();
		return `${year}.${month}.${day} ${hour} : ${minute} : ${second}`
	},
	
	
	//bird下降
	birddown : function (count) {
		
		this.birdtop += ++ this.birdstopY;
		this.bird.style.top =  this.birdtop  + 'px';
		//判断边界出界
		if (this.birdtop <= 0 || this.birdtop >= this.el.offsetHeight - this.bird.offsetHeight) {
			this.gameover();
			
		}
	},
	
	
	//天空移动
	skymove : function () {
		this.skyposition -= this.skymovestop;
		this.el.style.backgroundPositionX = this.skyposition + "px";
		
	},
	
	
	//开始按钮
	startbound : function () {
		var prevcolor = this.startcolor;
		this.startcolor = this.startcolor === 'blue' ? 'white' : 'blue' ;
		this.start.classList.remove('start-' + prevcolor);
		this.start.classList.add('start-' + this.startcolor);
	},
	
	
	//重新开始
	handlerestart : function () {
		this.restart.onclick = function () {
			window.location.reload();
		}
	},
	
	
	
	
	//开始游戏点击事件
	handlestart : function () {
		var that = this;
		this.start.onclick = function () {
			that.fengshu.style.display = 'block' ;
			that.skymovestop = 5;
			that.bird.style.left = '100px';
			that.nostart = false;
			that.start.style.display = 'none' ;
			that.bird.style.transition = 'none' ;
			console.log(that.pipelength);
			for (var i = 0 ; i < that.pipelength ; i ++) {
				that.creatpipe((i + 1) * 300);
			}
			
		}
		
	},
	
	
	//点击小鸟跳一下
	handleclick : function () {
		var that = this;
		this.el.onclick = function (e) {
			var dom = e.target;
			//判断点击是不是按钮  取消点开始也跳一下
			if (!dom.classList.contains('start')) {
				that.birdstopY = -10 ;
			}
		}
	},
	
	

	
	
	
	//创建柱子
	creatpipe : function (x) {
		var upheight = 100 + Math.floor(Math.random() * 125);
		var downheight = 450 - upheight;
	
		var pipeup = createlement('div' , ['pipe','pipe-up'], {
			left : x + 'px',
			height : upheight + 'px',
		});
		var pipedown = createlement('div' , ['pipe','pipe-down'],{
			left : x + 'px',
			height : downheight + 'px',
		});

		this.pipearr.push({
			up: pipeup,
			down: pipedown,
			y : [upheight , upheight + 150 - 30],
		})

		this.el.appendChild(pipeup);
		this.el.appendChild(pipedown);
	},
	
	
	//柱子移动
	pipemove : function () {
		for (var i = 0; i < this.pipelength; i ++) {
			
			var up = this.pipearr[i].up;
			var down = this.pipearr[i].down;
			var x = up.offsetLeft - this.skymovestop;
			
			up.style.left = x + 'px';
			down.style.left = x + 'px';
			
			if (x < -52) {
				var lastleft = this.pipearr[this.pipelastindex].up.offsetLeft;
				up.style.left = lastleft + 300 + 'px';
				down.style.left = lastleft + 300 + 'px';
				this.pipelastindex = i;
			}
		}
		this.judgepige();
		this.addscore();
		
	},
	
	
	//加分
	addscore : function () {
		var index = this.score % this.pipelength;
		var pipex = this.pipearr[index].up.offsetLeft;
		if (pipex < 13 ) {
			this.fengshu.innerText = ++ this.score;
		}
	},
	
	
	
	//时间函数
	getDate: function () {
	  var d = new Date();
	  var year = d.getFullYear();
	  var month = formatNum(d.getMonth() + 1);
	  var day = formatNum(d.getDate());
	  var hour = formatNum(d.getHours());
	  var minute = formatNum(d.getMinutes());
	  var second = formatNum(d.getSeconds());
	
	  return `${year}.${month}.${day} ${hour}:${minute}:${second}`;
	},
	

	
	//分数列表
	rank : function () {
		var length = this.scorearr.length;
		console.log(length);
		if (length > 5 ) {
			length = 5;
		}
		var list = '';
		var degreeclass = '';
		for (var i = 0 ; i < length  ; i ++ ) {
			switch (i) {
				case 0:
					degreeclass = 'diyi';
					break;
				case 1:
					degreeclass = 'dier';
					break;
				case 2:
					degreeclass = 'disan';
					break;
				case 3:
					degreeclass = '';
					break;
			}
			list += `<li class="rank-item">
						<span class="rank-degree ${degreeclass} ">${i + 1}</span>
						<span class="rank-score"> ${this.scorearr[i].feng} </span>
						<span class="rank-time"> ${this.scorearr[i].time} </span>
					</li>`;
			
		}
		
		this.ranklist.innerHTML = list ;
		
		
	},
	
}
bird.start();
