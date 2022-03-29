//Blake's addition
checkbox = document.getElementById("check");
window.checked = false;
window.isAITurn = false;
checkbox.addEventListener('change', function() {
	window.checked = this.checked;
	window.isAITurn = this.checked;
	AIchar = (move=='X') ? 1 : 2;
	playerChar = 2-(AIchar-1);
	if (this.checked)
	playMove(think());
});
//End of addition

//Creates a table for TicTacToe
winElement = document.getElementById('win');
function createTable(sizeArr=[3, 3]) {
	Final = false;
	move = 'X';
	winElement.hidden = true;
	checkbox.checked = false;
	table = document.getElementById('gameTable');
	table.innerHTML = '';
	for (let i = 0; i < sizeArr[0]; i++) {
		row = '<tr>';
		for (let j = 0; j < sizeArr[1]; j++) {
			row += '<td id="c' + (j+i*sizeArr[0]) + '" onclick="playMove(this)" index="' + [i, j] + '"></td>';
		}
		row += '</tr>';
		table.innerHTML += row;
	}
	if (window.checked) {
		AIchar = (move=='X') ? 1 : 2;
		playerChar = 2-(AIchar-1);
		playMove(think());
	}
}
//Checks to see if move is possible and continues if so...
//If game is Final -> Play no longer possible
move = 'X'
Final = false;
function playMove(obj) {
	tableArr = TabletoArray();
	if (Array.isArray(obj) && window.isAITurn) {
		if (obj!=null) {
			tableArr[obj[0]][obj[1]] = move;
			defineBoard(tableArr);
			rebuildTable(tableArr);
			move = (move=='X') ? 'O' : 'X';
			window.isAITurn = false;
		}
	} else if(validMove(obj) && !Final){
		if (window.checked) window.isAITurn = true;
		obj.innerHTML = move;
		tableArr = TabletoArray();
		defineBoard([...tableArr]);

		rebuildTable(tableArr);
		move = (move=='X') ? 'O' : 'X';

		//check if player won.
		Final = winCheck()[0];

		if (window.isAITurn && window.checked && !Final) {
			let AImove = think();
			tableArr[AImove[0]][AImove[1]] = move;
			rebuildTable(tableArr);
			defineBoard([...tableArr]);

			Final = winCheck()[0];
			move = (move=='X') ? 'O' : 'X';
		}
	}
	
}
//Checks for a possible wins
function winCheck(){
	endText = winElement.childNodes[0];
	tableArr = TabletoArray();
	options = ['X','O'];
	for(let l = 0; l < options.length; l++){
		x = options[l];
		//Checks Horizontally for a Win
		for(let i = 0; i < tableArr.length; i++){
			countH = 0
			for(let j = 0; j < tableArr[0].length; j++){
				if(tableArr[i][j] == x)
					countH++;
				if(countH >= 3){
					endText.innerHTML = "Player "+x+" Wins";
					winElement.hidden = false
					return [true, x];
				}
			}
		}
		//Checks Vertically for a Win
		for(let i = 0; i < tableArr[0].length; i++){
			countV = 0;
			for(let j = 0; j < tableArr.length; j++){
					if(tableArr[j][i] == x)
						countV++;
					if(countV >= 3){
						endText.innerHTML = "Player "+x+" Wins";
						winElement.hidden = false
						return [true, x];
					}
			}
		}
		//Checks Diagonally for a Win
		countD1 = 0;
		for(let i = 0; i < tableArr[0].length; i++){
			if(tableArr[i][i] == x)
				countD1++;
			if(countD1 >= 3){
				endText.innerHTML = "Player "+x+" Wins";
				winElement.hidden = false;
				return [true, x];
			}
		}
		countD2 = 0;
		for(let i = 0;i < tableArr.length; i++){;
			if(tableArr[i][(tableArr.length-1)-i] == x)
				countD2++;
			if(countD2 >= 3){
				endText.innerHTML = "Player "+x+" Wins";
				winElement.hidden = false
				return [true, x];
			}
		}
		//Checks for Tie game
		noEmpty = true;
		for(let i = 0; i < tableArr.length; i++){
			for(let j = 0; j < tableArr[0].length; j++){
				if(tableArr[i][j] == '')
					noEmpty = false;
			}
		}
		if (noEmpty && x == 'O'){
			endText.innerHTML = "No Winner!";
			winElement.hidden = false
			return [true, null];
		}
	}
	return false;
}
//Checks if the tiles passed are neighbors
function validMove(obj) {
	if(obj.innerHTML == "")
		return true;
	return false;
}
//gets an array that represents passed table
function TabletoArray(t=table) {
	numR = t.rows.length;
	numC = t.rows[0].cells.length;
	arrTable = [];
	for (let i = 0; i < numR; i++) {
		for (let j = 0; j < numC; j++) {
			if (j == 0) {
				arrTable[i] = [t.rows[i].cells[j].innerHTML];
			} else {
				arrTable[i][j] = t.rows[i].cells[j].innerHTML;
			}
		}
	}
	return arrTable;
}
//rebuilds the table using passed array
function rebuildTable(arr=[[0, 0, 0], [0, 0, 0], [0, 0, 0]]) {
	table.innerHTML = "";
	value = null;
	for (let i = 0; i < arr.length; i++) {
		row = '<tr>';
		for (let j = 0; j < arr[0].length; j++) {
			//saves value at index and removes item from array
			value = arr[i][j];
			if (value != '')
				row += '<td id="c' + (j+(i*arr[0].length)) + '" onclick="playMove(this)" index="' + [i, j] + '">' + (value) + '</td>';
			else
				row += '<td id="c' + (j+(i*arr[0].length)) + '" onclick="playMove(this)" index="' + [i, j] + '"></td>';
		}
		row += '</tr>';
		table.innerHTML += row;
	}
}
