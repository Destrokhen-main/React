import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
	let cl = "square "+(props.isRed ? "active" : "")
	
	return (
		<button
			className={cl}
			onClick={props.onClick}
		>
			{props.value}
		</button>
	);
}

  
class Board extends React.Component {
	renderSquare(x) {
		return (
			<Square 
				key={x}
				value={this.props.squares[x].value}
				isRed={this.props.squares[x].isRed}
				onClick={()=> this.props.onClick(x)}
			/>
		);
	}

	render() {
		let row = [];

		for(let i = 0 ; i != 9; i+=3){
			row[i] = (<div className="board-row">
				{this.renderSquare(i)}
				{this.renderSquare(i+1)}
				{this.renderSquare(i+2)}
			</div>)
		}

		return (
			<div>
				{row}
			</div>
		);
	}
}

class sq{
	constructor (value,isRed){
		this.value = value;
		this.isRed = isRed;
	}
}

class Game extends React.Component {
	// Добавляю состояние для всей игры
	constructor(props) {
		super(props);

		let ar = [];
		for(let i = 0; i != 9;i++){
			ar.push(new sq(null,false));
		}

		this.state = {
			history : [{
				squares : ar,
				lastIndex: null,
			}],
			xIsNext: true,
			stepNumber: 0,
			isDone:false,
		}
	}

	handleClick(i) {
		const history = this.state.history.slice(0,this.state.stepNumber+1);
		const current = history[history.length-1];
		let squares = current.squares.slice();

		let check = calculateWinner(squares);

		if (check || squares[i].value) return;

		squares[i].value = this.state.xIsNext === true ? "X" : "O";
		this.setState({
			history : history.concat([{
				squares,
				lastIndex:i,
			}]),
			xIsNext : !this.state.xIsNext,
			stepNumber : history.length,
		});
	}

	jumpTo(step){
		this.setState({
			stepNumber: step,
			xIsNext: (step % 2) === 0,
		});
	}

	render() { 
		
		const history = this.state.history;
		//console.log(history);
		const current = history[this.state.stepNumber];
		let status = 'Next player:' + (this.state.xIsNext ? "X" : "O");
		const winner = calculateWinner(current.squares);

		const moves = history.map((step, move) => {
			const desc = move ? "Перейти к ходу №"+ move : "К началу игры";
			let row = Math.floor(step.lastIndex / 3)+1;
			let col = Math.abs((step.lastIndex - Math.floor(step.lastIndex / 3) * 3)) +1;
			return (
				<li key={move}>
					<span>{desc != "К началу игры" ? "#"+row+"/"+col : ""}</span>
					<button onClick={()=> this.jumpTo(move)}>{desc}</button>
				</li>
			)
		}) 

		if(winner) {
			status = "Win player: "+winner[0];

			if(!this.state.isDone) {
				for(let i = 0 ; i != winner[1].length;++i){
					history[this.state.stepNumber].squares[winner[1][i]].isRed = true;
				}

				this.setState({
					history : history,
					isDone : true,
				});
			}
			//this.state.history[this.state.history.length-1].squares = current;
		}

		return (
		<div className="game">
			<div className="game-board">
			<Board 
				squares={current.squares}
				onClick={(i)=> this.handleClick(i)}
			/>
			</div>
			<div className="game-info">
					<div>Номер хода: {this.state.stepNumber}</div>
			<div>{status}</div>
			<ol>{moves}</ol>
			</div>
		</div>
		);
	}
}
  
// ========================================
  
ReactDOM.render(
    <Game />,
    document.getElementById('root')
);


function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a].value && squares[a].value === squares[b].value && squares[a].value === squares[c].value) {
      return [squares[a].value , [a,b,c]];
    }
  }
  return null;
}