//Checks to ensure that AI is not running before Making NewTable
var running = false;
function NewTable() {
	checks = 0;
	document.getElementById("steps").value = 0;
	if (!running) {
		do {
			createTable(/*getSize(15));//*/
			getSize(20));
			tableArr = TabletoArray(table);
			checks++;
			rebuildTable(tableArr);
		} while (!checkPuzzle()/*&& checks < 10*/
		);

		rebuildTable(tableArr);
		//testing code here:
		//checkPossible();
		//return;
		//end of testing code
	}
}
//Checks if the slow checkbox is checked
window.checked = false;
checkbox = document.getElementById("slow");
checkbox.addEventListener('change', function() {
	if (this.checked) {
		//window.checked = true;
		window.speed = 1000;
		//console.log("Checkbox is checked..");
	} else {
		window.speed = 0;
		//window.checked = false;
		//console.log("Checkbox is not checked..");
	}
});

//Creates the starting state for the game
goalArr = [];
table = document.getElementById("gameTable");
function getSize(size=0) {
	nm = [];
	nm[0] = Math.max(3, Math.round(Math.random() * size));
	nm[1] = Math.max(3, Math.round(Math.random() * size));

	return nm;
}

function getSpecificSize(size=0) {
	nm = [];
	nm[0] = Math.max(3, size);
	nm[1] = Math.max(3, size);

	return nm;
}
//creates a puzzle using dimensions passed in array
function createTable(sizeArr=[3, 3]) {
	table.innerHTML = '';
	intCells = sizeArr[0] * sizeArr[1];
	arr = [];
	goalArr = [[]];
	value = null;
	//adds all [0, n*m) to an array
	for (let i = 0; i < intCells; i++) {
		arr[i] = i;
	}
	for (let i = 0; i < sizeArr[1]; i++) {
		goalArr[i] = [];
		for (let j = 0; j < sizeArr[0]; j++) {
			if (intCells == (j + 1 + (i * sizeArr[0])))
				goalArr[i][j] = "0";
			else
				goalArr[i][j] = "" + (j + 1 + (i * sizeArr[0]));
		}
	}
	//goalArr[goalArr.length-1][goalArr[0].length-1] = 0;
	//goalArr[goalArr.length] = 0;
	//Sets the cells to random values within array and removes them after
	for (let i = 0; i < sizeArr[0]; i++) {
		row = '<tr>';
		for (let j = 0; j < sizeArr[1]; j++) {
			//gets random index in arr
			iValue = Math.floor(Math.random() * arr.length);
			//saves value at index and removes item from array
			value = arr[iValue];
			arr.splice(iValue, 1);
			if (value != 0)
				row += '<td id="c' + value + '" onclick="moveTile(this)" index="' + [i, j] + '">' + (value) + '</td>';
			else
				row += '<td id="c' + value + '" onclick="moveTile(this)" index="' + [i, j] + '"></td>';
		}
		row += '</tr>';
		table.innerHTML += row;
		//table.style = "width:"+(sizeArr[0]*80)+"px; text-align:center;";
	}
}
//calls the createTable function
//createTable(getSize(9));

//checks if tile has been select, 
//if selected -> moves tile to open location
//else saves selected tile
function moveTile(obj) {
	temp = [];
tile1 = document.getElementById('c0');
	tile2 = obj;
	if (obj == tile1) {
		return;
	}//ensures that tile has valid move
	//swaps selected tiles
	else if (tile1 != null && validMove(tile1, tile2)) {
		temp[0] = obj.innerHTML;
		temp[1] = obj.id;
		obj.innerHTML = tile1.innerHTML;
		obj.id = tile1.id;
		tile1.innerHTML = temp[0];
		tile1.id = temp[1];
		tile1 = null;
	}//saves obj to tile1
	if (TabletoArray() == goalArr)
		console.log("WIN");
}
//Checks if the tiles passed are neighbors
function validMove(location1, location2) {
	let l1 = "";
	let l2 = "";

	try {
		l1 = (location1.getAttribute("index")).split(",");
		l1[0] = (l1[0] * 1);
		l1[1] = (l1[1] * 1);
		l2 = (location2.getAttribute("index")).split(",");
		l2[0] = (l2[0] * 1);
		l2[1] = (l2[1] * 1);
	} catch (e) {
		l1 = location1;
		l2 = location2;
	}
	//console.log(l1[0]-l2[0],l1[0]-l2[1],l1[1]-l2[0],l1[1]-l2[1])
	horizontal = false;
	vertical = false;
	if ((Math.abs(l1[1] - l2[1]) == 1 && Math.abs(l1[0] - l2[0]) == 0) || (Math.abs(l1[0] - l2[0]) == 1 && Math.abs(l1[1] - l2[1]) == 0)) {
		return true;
	}
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
				arrTable[i] = [t.rows[i].cells[j].id.replace("c", "") * 1];
			} else {
				arrTable[i][j] = t.rows[i].cells[j].id.replace("c", "") * 1;
			}
		}
	}
	return arrTable;
}
//rebuilds the table using passed array
function rebuildTable(arr=[[1, 2, 3], [4, 5, 6], [7, 8, 0]]) {
	table.innerHTML = "";
	value = null;
	for (let i = 0; i < arr.length; i++) {
		row = '<tr>';
		for (let j = 0; j < arr[0].length; j++) {
			//saves value at index and removes item from array
			value = arr[i][j];
			//console.log(arr);
			if (value != 0)
				row += '<td id="c' + value + '" onclick="moveTile(this)" index="' + [i, j] + '">' + (value) + '</td>';
			else
				row += '<td id="c' + value + '" onclick="moveTile(this)" index="' + [i, j] + '"></td>';
		}
		row += '</tr>';
		table.innerHTML += row;
	}
}
//This section ensures that the new table is able to be solved
tempTABLE = [];
//Checks each place of the puzzle for if a swap is required to place tile in correct location
//Returns true if there are an even number of swaps required/otherwise returns false
function checkPuzzle() {
	tempTABLE = TabletoArray();
	//console.log(tempTABLE);
	swaps = 0;
	while (tfindTile()[0] < tempTABLE.length - 1) {
		tswap(3);
		//console.log(tempTABLE);
	}
	while (tfindTile()[1] < tempTABLE[0].length - 1) {
		tswap(2);
		//console.log(tempTABLE);
	}
	for (let i = 1; i < tempTABLE[0].length * tempTABLE.length; i++) {
		if (tcorrectPlace(i)[0] != tfindTile(i)[0] || tcorrectPlace(i)[1] != tfindTile(i)[1]) {
			tswapTiles(tcorrectPlace(i), tfindTile(i));
			swaps++;
		}
		//console.log(swaps, tempTABLE);
	}
	if (swaps % 2 == 0)
		return true;
	return false;
}
//Swap that works on tempTABLE
//swap that moves the openspace
//1 - Up	3 - Down
//2 - Right	4 - Left
function tswap(direction) {
	OpenTile = tfindTile();
	if (OpenTile[0] + Math.abs((direction + 1) % 4 - 2) - 1 > tempTABLE.length - 1 || OpenTile[0] + Math.abs((direction + 1) % 4 - 2) - 1 < 0 || OpenTile[1] + Math.abs((direction + 2) % 4 - 2) - 1 > tempTABLE[0].length - 1 || OpenTile[1] + Math.abs((direction + 2) % 4 - 2) - 1 < 0)
		return;
	temp = tempTABLE[OpenTile[0] + Math.abs((direction + 1) % 4 - 2) - 1][OpenTile[1] + Math.abs((direction + 2) % 4 - 2) - 1];
	tempTABLE[OpenTile[0] + Math.abs((direction + 1) % 4 - 2) - 1][OpenTile[1] + Math.abs((direction + 2) % 4 - 2) - 1] = tempTABLE[OpenTile[0]][OpenTile[1]];
	tempTABLE[OpenTile[0]][OpenTile[1]] = temp;
}
//Swap tiles that works on tempTABLE
//swaps the tiles at locations passed
function tswapTiles(Tile1, Tile2) {
	temp = tempTABLE[Tile1[0]][Tile1[1]];
	tempTABLE[Tile1[0]][Tile1[1]] = tempTABLE[Tile2[0]][Tile2[1]];
	tempTABLE[Tile2[0]][Tile2[1]] = temp;
}
//Findtile that works on tempTABLE
//looks for location of tile passed
function tfindTile(number=0, arrt=tempTABLE) {
	arr = []
	tempTABLE.forEach(function(x, i) {
		if (x.includes(number)) {
			arr = [i, x.indexOf(number)];
		}
	});
	return arr;
}
//CorrectPlace that works on tempTABLE
//Looks for correctplace within table
function tcorrectPlace(number=1) {
	for (let i = 0; i < tempTABLE.length; i++) {
		for (let j = 0; j < tempTABLE[0].length; j++) {
			if (j + 1 + (i * (tempTABLE[0].length)) == number) {
				return [i, j];
			}
		}
	}
}
