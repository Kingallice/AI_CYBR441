//Tic-Tac-Toe AI

//1 = X, 2 = O

//AIchar = X.
var AIchar = 1;
var playerChar = 2-(AIchar-1);

var board = [
	[0, 0, 0],
	[0, 0, 0],
	[0, 0, 0]
]

//
var lastMove = [];

function think() {
	let allCount = placeCount();

	if (allCount>=9) return;

    var move = 0;
	//Do winning move if possible.
	move = getWinningMove(AIchar);
    if (move!=0) {doMove(move); return;}

	//Block instant opponent wins next move.
	move = getWinningMove(playerChar);
    if (move!=0) {doMove(move); return;}

	
	//If player is playing Xs, play this way.
	if (AIchar == 1) {
		let Xcount = placeCount(1);

		if (Xcount == 0) {
			//picks a random corner
			move = [Math.round(Math.random())*2,Math.round(Math.random())*2];
			return move;
		} if (Xcount>0 && Xcount<9) {
			//get non-blocked corner
			let corners = getUnblockedCorners();
			move = corners[Math.round(Math.random()*(corners.length-1))];
			return move
		}
	}
	
	//if Player is playing Os, play this way.
	else {
		let Ocount = placeCount(2);
		if (Ocount==0) {

			//move to the center if it's the first move.
			move = [1,1];
			return move;
		} if (Ocount>0) {
			//block X corner shenanigans
			let moves = blockCorner();
			move = moves[Math.round(Math.random()*(moves.length-1))];

		}
	}
	
	//Idea not implemented: mirroring opponent's move.	
    var moves = possibleMoves();

    //returns random move for now!
    return moves[Math.round(Math.random())*(moves.length-1)];
}

function possibleMoves() {
    let pMoves = [];
    for (let i=0; i<board.length; i++) {
        for (let j=0; j<board[i].length; j++) {
            if (board[i][j] == 0) pMoves.push(board[i][j]);
        }
    }
}

function doMove(move) {
	board[move[0]][move[1]] = AIchar;
	
}

function doPlayerMove(move, playerChar) {
	board[move[0]][move[1]] = playerChar;
}

function calcWinner() {
	let winner = -1; // -1 means no winner.
	let count = 0; //if 3, there's a winner.
	let emptyCell = false;
	let countCell = board[0][0]; //tracks if we're counting Xs or Os, gets first cell we're counting initially.
	
	//check rows.
	for (let i=0; i<board.length; i++) {
		for (let j=0; j<board[i].length; j++) {
			if (board[i][j] == 0) {
				emptyCell = true;
				count = 0;
				break;
			}
			if (board[i][j] == countCell) count++;
			else count = 0;
			
			//return winner
			if (count==3) return board[i][j];
			
			countCell = board[i][j];
		}
	}
	
	
	//check columns.
	count = 0;
	countCell = board[0][0];
	for (let i=0; i<board[0].length; i++) {
		for (let j=0; j<board.length; j++) {
			if (board[j][i] == 0) {
				emptyCell = true;
				count = 0;
				break;
			}
			if (board[i][j] == countCell) count++;
			else {
				count = 0; break;
			}
			
			//return winner
			if (count==3) return board[j][i];
			
			countCell = board[j][i];
		}
	}
	
	//check diagonals
	count = 0;
	countCell = board[0][0];
	for (let i=0; i<board.length; i++) {
		if (board[i][i] == countCell) count++;
		else {
			count = 0; break;
		}
		if (count==3) return board[i][i];
	}
	
	count = 0;
	countCell = board[0][2];
	for (let i=board.length-1; i>=0; i--) {
		if (board[(board.length-1)-i][i] == countCell) count++;
		else {
			count = 0; break;
		}
		if (count==3) return board[i][i];
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
	for (let i=0; i<board.length; i++) {
		count = 0;
		emptyCell = null;
		for (let j=0; j<board[i].length; j++) {
			if (board[i][j] == 0) {
				emptyCell = [i,j];
			}
			if (board[i][j] == XorO) {
				count++;
			}
			if (count==2 && emptyCell != null) return emptyCell;
			
		}
	}
	
    //columns
	for (let i=0; i<board[0].length; i++) {
		count = 0;
		emptyCell = null;
		for (let j=0; j<board.length; j++) {
			if (board[j][i] == 0) {
				emptyCell = [j,i];
			}
			if (board[j][i] == XorO) {
				count++;
			}
			if (count==2 && emptyCell != null) return emptyCell;
			
		}
	}
	
    //check diagonals
    count = 0;
    for (let i=0; i<board.length; i++) {
        if (board[i][i] == 0) {
            emptyCell = [i,i];
        }
        if (board[i][i] == XorO) {
            count++;
        }
        if (count==2 && emptyCell != null) return emptyCell;
        
    }

    count = 0;
    for (let i=board.length-1; i>=0; i--) {
        if (board[(board.length-1)-i][i] == 0) {
            emptyCell = [(board.length-1)-i,i];
        }
        if (board[(board.length-1)-i][i] == XorO) {
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
		for (let i=0; i<board.length; i++) {
			for (let j=0; j<board[i].length; j++) {
				if (board[i][j]!=0) count++;
			}
		}
	} else {
		for (let i=0; i<board.length; i++) {
			for (let j=0; j<board[i].length; j++) {
				if (board[i][j]==type) count++;
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

		if (board[x+(1-x)][y]!=0 && board[x][y+(1-y)] != 0 && board[x][y] == 0) {
			possibleCells.push([x, y]);
		}
	}

	return possibleCells;
}

function blockCorner() {
	let possibleCells = [];
	for (let i=0; i<4; i++) {
		let x = (i%2)*2;
		let y = Math.floor(i/2)*2;

		if (board[x][y]==2-(AIchar-1)) {
			if (board[x+(1-x)][y]==0)
				possibleCells.push([x+(1-x),y]);
			if (board[x][y+(1-y)]==0)
				possibleCells.push([x,y+(1-y)]);
		}
	}

	return possibleCells;
}