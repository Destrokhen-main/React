import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
	return (
		<button
			className="square"
			onClick={props.onClick}
		>
			{props.value}
		</button>
	);
}

  
class Board extends React.Component {
	renderSquare(i) {
			return (
				<Square 
					key={i}
					value={this.props.squares[i]}
					onClick={()=> this.props.onClick(i)}
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

class Game extends React.Component {
	// Добавляю состояние для всей игры
	constructor(props) {
		super(props);

		this.state = {
			history : [{
				squares : Array(9).fill(null),
				lastIndex: null,
			}],
			xIsNext: true,
			stepNumber: 0,
		}
	}

	handleClick(i) {
		const history = this.state.history.slice(0,this.state.stepNumber+1);
		const current = history[history.length-1];
		let squares = current.squares.slice();

		if (calculateWinner(squares) || squares[i]) return;

		squares[i] = this.state.xIsNext === true ? "X" : "O";
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
		status = "Win player: "+winner;
	}

    return (
    <div className="game">
        <div className="game-board">
        <Board 
					squares={current.squares}
					isRed={current.isRed}
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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}