//Tic-Tac-Toe AI

//1 = X, 2 = O

//AIchar = X.
var AIchar = 1;
var playerChar = (AIchar==1) ? 2 : 1;

var board = [
	[0, 0, 0],
	[0, 0, 0],
	[0, 0, 0]
]

//
var lastMove = [];

function think() {
	//Do winning move if possible.
	
	//Block instant opponent wins next move.
	
	//Default to mirroring move of opponent.	
	
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
			//if (winner!=-1) return winner;
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
			//if (winner!=-1) return winner;
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
				emptyCell = board[i][j];
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
				emptyCell = board[j][i];
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
            emptyCell = board[i][i];
        }
        if (board[i][i] == XorO) {
            count++;
        }
        if (count==2 && emptyCell != null) return emptyCell;
        
    }

    count = 0;
    for (let i=board.length-1; i>=0; i--) {
        if (board[(board.length-1)-i][i] == 0) {
            emptyCell = board[(board.length-1)-i][i];
        }
        if (board[(board.length-1)-i][i] == XorO) {
            count++;
        }
        if (count==2 && emptyCell != null) return emptyCell;
    }


	return 0; //0 means there are no winning moves currently.
}




