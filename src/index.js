module.exports = function solveSudoku(matrix) {
	//inner functions
	function getAllTwosCombinations() {
		let ans = [];
		for(let i = 1; i <= 9; i++) {
			for(let j = 1; j <= 9; j++) {
				if(i == j) {
					continue;
				}
				ans.push([i, j]);
			}
		}
		return ans;
	}

	function getAllThreeCombitations() {
		let ans = [];
		for(let i = 1; i <= 9; i++) {
			for(let j = 1; j <= 9; j++) {
				for(let k = 1; k <= 9; k++) {
					if(i == j || j == k || i == k) {
						continue;
					}
					ans.push([i, j, k]);
				}
			}
		}
		return ans;
	}

	function getAllFourCombinations() {
		let ans = [];
		for(let i = 1; i <= 9; i++) {
			for(let j = 1; j <= 9; j++) {
				for(let k = 1; k <= 9; k++) {
					for(let l = 1; l <= 9; l++) {
						if(i == j || j == k || i == k || i == l || j == l || k == l) {
							continue;
						}
						ans.push([i, j, k, l]);
					}
				}
			}
		}
		return ans;
	}

	let TWOS = getAllTwosCombinations();
	let THREES = getAllThreeCombitations();
	let FOURS = getAllFourCombinations();


	function findOnes(extMatrix) {
		let flag = false;
		for(let i = 0; i < 9; i++) {
			for(let j = 0; j < 9; j++) {
				if(extMatrix[i][j].value == 0 && extMatrix[i][j].possible.length == 1) {
					setExactValue(extMatrix, extMatrix[i][j].possible[0], i, j);
					flag = true;
				}
			}
		}
		return flag;
	}

	function getRowPositions(i) {
		let ans = [];
		for(let k = 0; k < 9; k++) {
			ans.push([i, k]);
		}
		return ans;
	}

	function getColumnPositions(j) {
		let ans = [];
		for(let k = 0; k < 9; k++) {
			ans.push([k, j]);
		}
		return ans;
	}

	function getBlockPositions(i, j) {
		let ans = [];
		for(let cur_i = Math.floor(i/3)*3, i_ = cur_i; i_ < cur_i + 3; i_++) {
			for(let cur_j = Math.floor(j/3)*3, j_ = cur_j; j_ < cur_j +3; j_++) {
				ans.push([i_, j_]);
			}
		}
		return ans;
	}

	function findHiddenOnes(extMatrix) {
		let flag = false;
		for(let i = 0; i < 9; i++) {
			for(let j = 0; j < 9; j++) {
				if(extMatrix[i][j].value == 0) {
					if(checkOne(extMatrix, getRowPositions(i), i, j) 
						|| checkOne(extMatrix, getColumnPositions(j), i, j)
						|| checkOne(extMatrix, getBlockPositions(i, j), i, j)) {
						flag = true;
					}
				}
			}
		}
		return flag;
	}

	function solveIteration(extMatrix) {
		let updated = false;
		if(findOnes(extMatrix)) {
			return true;
		}
		if(findHiddenOnes(extMatrix)) {
			return true;
		}
		if(checkOpen(extMatrix, TWOS)) {
			return true;
		}
		if(checkHidden(extMatrix, TWOS)) {
			return true;
		}
		if(checkOpen(extMatrix, THREES)) {
			return true;
		}
		if(checkHidden(extMatrix, THREES)) {
			return true;
		}
		if(checkOpen(extMatrix, FOURS)) {
			return true;
		}
		if(checkHidden(extMatrix, FOURS)) {
			return true;
		}
		return false;
	}

	function checkOne(extMatrix, positions, i, j) {
		let flag = false;
		for(let k = 0; k < extMatrix[i][j].possible.length; k++) {
			let isOne = true;
			let oneOf = extMatrix[i][j].possible[k];
			for(let k_ = 0; k_ < positions.length; k_++) {
				let x = positions[k_][0];
				let y = positions[k_][1];
				if((x == i && y == j) || extMatrix[x][y].value != 0) {
					continue;
				}
				isOne &= (extMatrix[x][y].possible.indexOf(oneOf) == -1);
			}
			if(isOne) {
				setExactValue(extMatrix, oneOf, i, j);
				flag = true;
			}
		}
		return flag;
	}

	function createExtMatrix(matrix) {
		let extMatrix = [];
		for(let i = 0; i < matrix.length; i++) {
			extRow = [];
			for(let j = 0; j < matrix.length; j++) {
				let elem = { value: matrix[i][j], possible: []};
				extRow.push(elem);
			}
			extMatrix.push(extRow);
		}
		return extMatrix;
	}

	function fillPossibles(matrix, extMatrix, i, j) {
		extMatrix[i][j].possible = [1, 2, 3, 4, 5, 6, 7, 8, 9];
		for(let k = 0; k < matrix.length; k++) {
			if(k != j && matrix[i][k] != 0) {
				extMatrix[i][j].possible = extMatrix[i][j].possible.filter(item => item != matrix[i][k]);
			}
			if(k != i && matrix[k][j] != 0) {
				extMatrix[i][j].possible = extMatrix[i][j].possible.filter(item => item != matrix[k][j]);
			}
		}
		for(let cur_i = Math.floor(i/3)*3, i_ = cur_i; i_ < cur_i + 3; i_++) {
			for(let cur_j = Math.floor(j/3)*3, j_ = cur_j; j_ < cur_j +3; j_++) {
				if(i == i_ && j == j_) {
					continue;
				}
				extMatrix[i][j].possible = extMatrix[i][j].possible.filter(item => item != matrix[i_][j_]);
			}
		}
	}

	function setExactValue(extMatrix, value, i, j) {
		extMatrix[i][j].value = value;
		for(let k = 0; k < extMatrix.length; k++) {
			if(k != j) {
				extMatrix[i][k].possible = extMatrix[i][k].possible.filter(item => item != extMatrix[i][j].value);
			}
			if(k != i) {
				extMatrix[k][j].possible = extMatrix[k][j].possible.filter(item => item != extMatrix[i][j].value);
			}
		}
		for(let cur_i = Math.floor(i/3)*3, i_ = cur_i; i_ < cur_i + 3; i_++) {
			for(let cur_j = Math.floor(j/3)*3, j_ = cur_j; j_ < cur_j +3; j_++) {
				if(i == i_ && j == j_) {
					continue;
				}
				extMatrix[i_][j_].possible = extMatrix[i_][j_].possible.filter(item => item != extMatrix[i][j].value);
			}
		}
	}

	function checkArrayEquals(first, second) {
		if(first.length != second.length) {
			return false;
		}
		for(let i = 0; i < first.length; i++) {
			if(first[i] != second[i]) 
				return false;
		}
		return true;
	}

	function checkArrayNotContains(array, subarray) {
		for(let i = 0; i < subarray.length; i++) {
			if(array.indexOf(subarray[i]) != -1)
				return true;
		}
		return false;
	}

	function checkArrayContains(array, subarray) {
		for(let i = 0; i < subarray.length; i++) {
			if(array.indexOf(subarray[i]) == -1)
				return false;
		}
		return true;
	}

	function checkHiddenCombination(extMatrix, possibles, combination) {
		let equalsCount = 0;
		let candidates = 0;
		let open_ = 0;
		let cont = 0;
		for(let i = 0; i < possibles.length; i++) {
			let x = possibles[i][0];
			let y = possibles[i][1];
			if(extMatrix[x][y].value == 0) {
				candidates++;
				if(checkArrayContains(extMatrix[x][y].possible, combination)) {
					cont++;
				}
				if(!checkArrayNotContains(extMatrix[x][y].possible, combination)) {
					equalsCount++;
				}
				if(checkArrayEquals(extMatrix[x][y].possible, combination)) {
					open_++;
				}
			}
		}
		return false;
		if(equalsCount != 0 && equalsCount == candidates - combination.length && open_ != cont) {
			filterHiddenCombinations(extMatrix, possibles, combination);
			debugger;
			return true;
		}
		return false;
	}

	function filterHiddenCombinations(extMatrix, possibles, combination) {
		for(let k = 0; k < possibles.length; k++) {
			let x = possibles[k][0];
			let y = possibles[k][1];
			if(extMatrix[x][y].value != 0 || !checkArrayContains(extMatrix[x][y].possible, combination)) {
				continue;
			}
			extMatrix[x][y].possible = combination;
		}
	}

	function checkHidden(extMatrix, combinations) {
		let flag = false;
		for(let k = 0; k < combinations.length; k++) {
			let combination = combinations[k];
			for(let i = 0; i < 9; i++) {
				if(checkHiddenCombination(extMatrix, getRowPositions(i), combination)
					|| checkHiddenCombination(extMatrix, getColumnPositions(i), combination)
					|| checkHiddenCombination(extMatrix, getBlockPositions(Math.floor(i/3)*3, (i%3)*3), combination)
					) {
					flag = true;
				}
			}
		}
		return flag;
	}

	function checkOpenCombination(extMatrix, possibles, combination) {
		let equalsCount = 0;
		let candidates = 0;
		for(let i = 0; i < possibles.length; i++) {
			let x = possibles[i][0];
			let y = possibles[i][1];
			if(extMatrix[x][y].value == 0) {
				if(checkArrayNotContains(extMatrix[x][y].possible, combination)) {
					candidates++;
				}
				if(checkArrayEquals(extMatrix[x][y].possible, combination)) {
					equalsCount++;
				}
			}
		}

		if(equalsCount == combination.length && candidates != equalsCount) {
			filterOpenCombinations(extMatrix, possibles, combination);
			return true;
		}
		return false;
	}

	function filterOpenCombinations(extMatrix, possibles, combination) {
		for(let k = 0; k < possibles.length; k++) {
			let x = possibles[k][0];
			let y = possibles[k][1];
			if(extMatrix[x][y].value != 0 || checkArrayEquals(extMatrix[x][y].possible, combination)) {
				continue;
			}
			for(let i = 0; i < combination.length; i++) {
				extMatrix[x][y].possible = extMatrix[x][y].possible.filter(item => item != combination[i]);
			}
		}
	}

	function checkOpen(extMatrix, combinations) {
		let flag = false;
		for(let k = 0; k < combinations.length; k++) {
			let combination = combinations[k];
			for(let i = 0; i < 9; i++) {
				if(checkOpenCombination(extMatrix, getRowPositions(i), combination)
					|| checkOpenCombination(extMatrix, getColumnPositions(i), combination)
					|| checkOpenCombination(extMatrix, getBlockPositions(Math.floor(i/3)*3, (i%3)*3), combination)
					) {
					flag = true;
				}
			}
		}
		return flag;
	}

	function checkIsSolved(extMatrix) {
		rows = [];
		cols = [];
		blocks = [];
		for(let i = 0; i < 9; i++) {
			rows.push([]);
			cols.push([]);
			blocks.push([]);
		}
		for(let i = 0; i < 9; i++) {
			for(let j = 0; j < 9; j++) {
				rows[i].push(extMatrix[i][j].value);
				cols[j].push(extMatrix[i][j].value);
				blocks[Math.floor(i/3)*3 + Math.floor(j/3)].push(extMatrix[i][j].value);
			}
		}
		for(let i = 0; i < 9; i++) {
			rows[i] = rows[i].sort(function(a, b) {return a - b;});
			cols[i] = cols[i].sort(function(a, b) {return a - b;});
			blocks[i] = blocks[i].sort(function(a, b) {return a - b;});
			for(let j = 0; j < 9; j++) {
				if(rows[i][j] != j+1 || cols[i][j] != j+1 || blocks[i][j] != j+1) {
					return false;
				}
			}
		}
		return true;
	}

	function lastTry(extMatrix) {
		let indexes = [];
		for(let i = 0; i < extMatrix.length; i++) {
			for(let j = 0; j < extMatrix.length; j++) {
				if(extMatrix[i][j].value == 0 && extMatrix[i][j].possible.length <= 2) {
					indexes.push([i, j]);
				}
			}
		}
		for(let i = 0; i < 5; i++) {
			indexes.sort(() => Math.random() - 0.5);
			let new_ind = indexes.slice(0, 4);
			let sol = trySolve(extMatrix, new_ind);
			if(sol != false) {
				return sol;
			}
		}
		return false;
	}

	function trySolve(extMatrix, i_5) {
		for(let _1 = 0; _1 < extMatrix[i_5[0][0]][i_5[0][1]].possible.length; _1++) {
			for(let _2 = 0; _2 < extMatrix[i_5[1][0]][i_5[1][1]].possible.length; _2++) {
				for(let _3 = 0; _3 < extMatrix[i_5[2][0]][i_5[2][1]].possible.length; _3++) {
					for(let _4 = 0; _4 < extMatrix[i_5[3][0]][i_5[3][1]].possible.length; _4++) {
							let ext_ = [];
							for(let i = 0; i < extMatrix.length; i++) {
								let extRow = [];
								for(let j = 0; j < extMatrix.length; j++) {
									let elem = { value: extMatrix[i][j].value, possible: extMatrix[i][j].possible};
									extRow.push(elem);
								}
								ext_.push(extRow);
							}
							setExactValue(ext_, extMatrix[i_5[0][0]][i_5[0][1]].possible[_1], i_5[0][0], i_5[0][1]);
							setExactValue(ext_, extMatrix[i_5[1][0]][i_5[1][1]].possible[_2], i_5[1][0], i_5[1][1]);
							setExactValue(ext_, extMatrix[i_5[2][0]][i_5[2][1]].possible[_3], i_5[2][0], i_5[2][1]);
							setExactValue(ext_, extMatrix[i_5[3][0]][i_5[3][1]].possible[_4], i_5[3][0], i_5[3][1]);
							
							let flag = true;
							while(flag) {
								flag = solveIteration(ext_);
							}
							if(checkIsSolved(ext_)) {
								return ext_;
							}
						
					}
				}
			}
		}
		return false;
	}
	
	
	let flag = true;
	let matrix_ = createExtMatrix(matrix);
	for(let i = 0; i < 9; i++) {
		for(let j = 0; j < 9; j++) {
			fillPossibles(matrix, matrix_, i, j);
		}
	}
	
	while(flag) {
		flag = solveIteration(matrix_);
	}
	if(!checkIsSolved(matrix_)) {
		let last_ans = lastTry(matrix_);
		if(last_ans != false) {
			matrix_ = last_ans;
		}
	}
	let ans = [];
	for(let i = 0; i < 9; i++) {
		let row = [];
		for(let j = 0; j < 9; j++) {
			row.push(matrix_[i][j].value);
		}
		ans.push(row);
	}
	return ans;
}
