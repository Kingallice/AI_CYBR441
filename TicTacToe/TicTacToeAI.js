//Tic-Tac-Toe AI

//1 = X, 2 = O

//AIchar = X.
var AIchar = 1;
var playerChar = 2-(AIchar-1);

window.board = [
	[0, 0, 0],
	[0, 0, 0],
	[0, 0, 0]
];

function defineBoard(arr) {
	window.board = [[0,0,0],[0,0,0],[0,0,0]];
	var b = [[0,0,0],[0,0,0],[0,0,0]];
	for (let i=0; i<window.board.length; i++) {
		for (let j=0; j<window.board[0].length; j++) {
			let value = arr[i][j];
			window.board[i][j] = (value=='') ? 0 : (value=='X') ? 1 : 2;
			b[i][j] = (value=='') ? 0 : (value=='X') ? 1 : 2;
		}
	}
	// console.log(b);
	// console.log(window.board);
	// console.log(arr);
}
//
var lastMove = [];

function think() {
	console.log("thinking...");
	tableArr = TabletoArray();
		defineBoard(tableArr);
	let allCount = placedCount();

	if (allCount>=9) return 0;

    var move = 0;
	//Do winning move if possible.
	move = getWinningMove(AIchar);
	console.log(move);
    if (move!=0) {return move;}

	//Block instant opponent wins next move.
	console.log("Player char: "+playerChar+", AIchar: "+AIchar);
	move = getWinningMove(playerChar);
	console.log(move);
    if (move!=0) {return move;}

	
	//If player is playing Xs, play this way.
	if (AIchar == 1) {
		let Xcount = placedCount(1);

		if (Xcount == 0) {
			//picks a random corner
			move = [Math.round(Math.random())*2,Math.round(Math.random())*2];
			return move;
		} if (Xcount>0) {
			//get non-blocked corner
			let corners = getUnblockedCorners();
			if (corners!=null) {
				move = corners[Math.round(Math.random()*(corners.length-1))];
				return move
			}
		}
	}
	
	//if Player is playing Os, play this way.
	else {
		let Ocount = placedCount(2);
		if (Ocount==0) {

			//move to the center if it's the first move.
			move = [1,1];
			return move;
		} if (Ocount>0) {
			//block X corner shenanigans
			let moves = blockCorner();
			if (moves!=null) {
				move = moves[Math.round(Math.random()*(moves.length-1))];
				return move;
			}
		}
	}
	
	//Idea not implemented: mirroring opponent's move.	
    var moves = possibleMoves();

    //returns random move for now!
    return moves[Math.round(Math.random())*(moves.length-1)];
}

function possibleMoves() {
    let pMoves = [];
    for (let i=0; i<window.board.length; i++) {
        for (let j=0; j<window.board[i].length; j++) {
            if (window.board[i][j] == 0) pMoves.push(window.board[i][j]);
        }
    }
}

function doMove(move) {
	window.board[move[0]][move[1]] = AIchar;
	
}

function doPlayerMove(move, playerChar) {
	window.board[move[0]][move[1]] = playerChar;
}

function calcWinner() {
	let winner = -1; // -1 means no winner.
	let count = 0; //if 3, there's a winner.
	let emptyCell = false;
	let countCell = window.board[0][0]; //tracks if we're counting Xs or Os, gets first cell we're counting initially.
	
	//check rows.
	for (let i=0; i<window.board.length; i++) {
		for (let j=0; j<window.board[i].length; j++) {
			if (window.board[i][j] == 0) {
				emptyCell = true;
				count = 0;
				break;
			}
			if (window.board[i][j] == countCell) count++;
			else count = 0;
			
			//return winner
			if (count==3) return window.board[i][j];
			
			countCell = window.board[i][j];
		}
	}
	
	
	//check columns.
	count = 0;
	countCell = window.board[0][0];
	for (let i=0; i<window.board[0].length; i++) {
		for (let j=0; j<window.board.length; j++) {
			if (board[j][i] == 0) {
				emptyCell = true;
				count = 0;
				break;
			}
			if (window.board[i][j] == countCell) count++;
			else {
				count = 0; break;
			}
			
			//return winner
			if (count==3) return window.board[j][i];
			
			countCell = window.board[j][i];
		}
	}
	
	//check diagonals
	count = 0;
	countCell = window.board[0][0];
	for (let i=0; i<window.board.length; i++) {
		if (window.board[i][i] == countCell) count++;
		else {
			count = 0; break;
		}
		if (count==3) return window.board[i][i];
	}
	
	count = 0;
	countCell = window.board[0][2];
	for (let i=window.board.length-1; i>=0; i--) {
		if (window.board[(window.board.length-1)-i][i] == countCell) count++;
		else {
			count = 0; break;
		}
		if (count==3) return window.board[i][i];
	}
	
	
	if (!emptyCell) return 0;
	return -1;
	//0 means draw, 1 means X win, 2 means O win.
}

//XorO: 1 means X, 2 means O.
function getWinningMove(XorO) {
	let count = 0; //if 2, there's a winning move.
	let winningMove = false;
	let emptyCell = null; // keeps track of the empty cell for a given line.

    //rows
	for (let i=0; i<window.board.length; i++) {
		count = 0;
		emptyCell = 0;
		for (let j=0; j<window.board[i].length; j++) {
			if (window.board[i][j] == 0) {
				emptyCell = [i,j];
			}
			if (window.board[i][j] == XorO) {
				count++;
			}
			if (count>=2 && emptyCell != 0) {
				console.log("row counted");
				return emptyCell;
			}
			
		}
	}
	
    //columns
	for (let i=0; i<window.board[0].length; i++) {
		count = 0;
		emptyCell = 0;
		for (let j=0; j<window.board.length; j++) {
			if (window.board[j][i] == 0) {
				emptyCell = [j,i];
			}
			if (window.board[j][i] == XorO) {
				count++;
			}
			if (count>=2 && emptyCell != 0) {
				console.log("column counted");
				return emptyCell;
			}
			
		}
	}
	
    //check diagonals
    count = 0;
    for (let i=0; i<window.board.length; i++) {
        if (window.board[i][i] == 0) {
            emptyCell = [i,i];
        }
        if (window.board[i][i] == XorO) {
            count++;
        }
        if (count==2 && emptyCell != null) return emptyCell;
        
    }

    count = 0;
    for (let i=window.board.length-1; i>=0; i--) {
        if (window.board[(window.board.length-1)-i][i] == 0) {
            emptyCell = [(window.board.length-1)-i,i];
        }
        if (window.board[(window.board.length-1)-i][i] == XorO) {
            count++;
        }
        if (count==2 && emptyCell != null) return emptyCell;
    }


	return 0; //0 means there are no winning moves currently.
}

function placedCount(type = 0) {
	//0: count Xs and Os
	//1: count Xs
	//2: count Os
	let count = 0;
	
	if (type==0) {
		for (let i=0; i<window.board.length; i++) {
			for (let j=0; j<window.board[i].length; j++) {
				if (window.board[i][j]!=0) count++;
			}
		}
	} else {
		for (let i=0; i<window.board.length; i++) {
			for (let j=0; j<window.board[i].length; j++) {
				if (window.board[i][j]==type) count++;
			}
		}
	}

	return count;
}

function getUnblockedCorners() {
	//iterates through all corners.
	let possibleCells = [];
	for (let i=0; i<4; i++) {
		let x = (i%2)*2;
		let y = Math.floor(i/2)*2;

		if (window.board[y+(1-y)][x]==0 && window.board[y][x+(1-x)] == 0 && window.board[y][x] == 0) {
			possibleCells.push([y, x]);
		}
	}

	return possibleCells;
}

function blockCorner() {
	let possibleCells = [];
	for (let i=0; i<4; i++) {
		let x = (i%2)*2;
		let y = Math.floor(i/2)*2;

		if (window.board[x][y]==2-(AIchar-1)) {
			if (window.board[x+(1-x)][y]==0)
				possibleCells.push([x+(1-x),y]);
			if (window.board[x][y+(1-y)]==0)
				possibleCells.push([x,y+(1-y)]);
		}
	}

	return possibleCells;
}