const board = document.getElementById('board');
let table;

let position;
let hands = [[], []]; //각 플레이어가 잡은 기물들

let turn = 1;

let selecting = 0; //이동 준비 여부
let selected = null; //선택된 기물
let originRow, originCol; //이동 시작점의 좌표

const defaultPosition = [
	[['향차', -1], ['계마', -1], ['은장', -1], ['금장', -1], ['왕장', -1], ['금장', -1], ['은장', -1], ['계마', -1], ['향차', -1]],
	[null, ['비차', -1], null, null, null, null, null, ['각행', -1], null],
	[['보병', -1], ['보병', -1], ['보병', -1], ['보병', -1], ['보병', -1], ['보병', -1], ['보병', -1], ['보병', -1], ['보병', -1]],
	[null, null, null, null, null, null, null, null, null],
	[null, null, null, null, null, null, null, null, null],
	[null, null, null, null, null, null, null, null, null],
	[['보병', 1], ['보병', 1], ['보병', 1], ['보병', 1], ['보병', 1], ['보병', 1], ['보병', 1], ['보병', 1], ['보병', 1]],
	[null, ['각행', 1], null, null, null, null, null, ['비차', 1], null],
	[['향차', 1], ['계마', 1], ['은장', 1], ['금장', 1], ['왕장', 1], ['금장', 1], ['은장', 1], ['계마', 1], ['향차', 1]]
];
const movingRules = {
    보병: [[1, 0]],
    계마: [[2, -1], [2, 1]]
} 

function reset(){
    //테이블 초기화
    position = structuredClone(defaultPosition);
    board.innerHTML = '';
    
    //빈 테이블 생성
    table = document.createElement('table');
    for(let i=0;i<9;i++){
        let row = document.createElement('tr');
        for(let j=0;j<9;j++){
            const cell = document.createElement('td');
            cell.dataset.row = i;
            cell.dataset.col = j;
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    board.appendChild(table);
    
    //테이블 기물 배치
    for(let i=0;i<9;i++){
        for(let j=0;j<9;j++){
            //(i,j)에 해당하는 기물 배치
            const pieceInfo = position[i][j];
            if(pieceInfo != null){
                const piece = document.createElement('img');
                piece.src = `https://raw.githubusercontent.com/jedenzero/pantesa/refs/heads/main/%EC%87%BC%EA%B8%B0/imgs/${encodeURIComponent(pieceInfo[0])}.png`;
																
                if(pieceInfo[1] == -1){
                    piece.classList.add('reversed');
                }
                table.rows[i].cells[j].appendChild(piece);
            }
        }
    }
    
    //td 이벤트 할당
    table.onclick = function(event){
        const cell = event.target.closest('td');
        const row = Number(cell.dataset.row);
        const col = Number(cell.dataset.col);
        if(selecting == 0 && cell.innerHTML != '' && position[row][col][1] == turn){
            originRow = row;
            originCol = col;
            find(row, col);
            selecting = 1;
            selected = cell.firstChild;
        }
        else{
            if(cell.classList.contains('reachable')){
                const player = turn == 1 ? 1 : 2;
                if(cell.innerHTML != ''){
                    position[row][col][1] = turn;
                    hands[player].push(position[row][col]);
                    const hand = document.getElementById(`hand${player}`);
                    hand.appendChild(cell.firstChild);
                }
                position[row][col] = position[originRow][originCol];
                position[originRow][originCol] = null;
                cell.appendChild(selected);
                turn *= -1;
            }
            const reachables = document.querySelectorAll('.reachable');
            reachables.forEach(el=>{
                el.classList.remove('reachable');
            });
            selecting = 0;
            selected = null;
        }
    }
}

function find(row, col){
    movingRules[position[row][col][0]].forEach(diff=>{
        const newRow = row - diff[0] * turn;
        const newCol = col + diff[1];
        if(rangeCheck(newRow) && rangeCheck(newCol) && (position[newRow][newCol] == null || position[newRow][newCol][1] != turn)){
            table.rows[newRow].cells[newCol].classList.add('reachable');
        }
    });
}

function rangeCheck(n){
    return (0 <= n && n < 9);
}

reset();