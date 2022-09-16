import './App.css';
import blue from './images/BlueCandy.png'
import green from './images/GreenCandy.png'
import orange from './images/orangeCandy.png'
import purple from './images/purpleCandy.png'
import red from './images/redCandy.png'
import yellow from './images/yellowCandy.png'
import Blank from "./images/blank.png"

import {useState, useEffect} from 'react';

const width = 8;
const candyColors = [
  blue,
  green,
  orange,
  purple,
  red,
  yellow
]

const App = () => {


 const [colorArrangement, setColorArrangement] = useState([]);
 const [squareBeingDragged, setSquareBeingDragged] = useState(null);
 const [squareBeingReplaced, setSquareBeingReplaced] = useState(null);

 const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
 const [score, setScore] = useState(0);
 const[count, setCount] = useState(0);

 const checkForColumnofFour = () => {
  for (let i = 0; i <= 39; i++) {
    const columnOfFour = [i, i + width, i + width * 2, i + width * 3];
    const decidedColor = colorArrangement[i];
    const isBlank = colorArrangement[i] === Blank;

    if (columnOfFour.every(square => colorArrangement[square] === decidedColor) && !isBlank) {
      columnOfFour.forEach(num => colorArrangement[num] = Blank)
      setScore((score) => score + 4)
      return true;
    }
  }
 }

 const checkForRowofFour = () => {
  for (let i = 0; i < 64; i++) {
    const rowOfFour = [i, i + 1, i + 2, i +3];
    const decidedColor = colorArrangement[i];
    const isBlank = colorArrangement[i] === Blank;

    const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 
      38, 39, 46, 47, 53, 54, 55, 62, 63, 64];

    if (notValid.includes(i)) continue;

    if (rowOfFour.every(square => colorArrangement[square] === decidedColor) && !isBlank) {
      rowOfFour.forEach(num => colorArrangement[num] = Blank)
      setScore((score) => score + 4)
      return true;
    }
  }
 }



 const checkForColumnofThree = () => {
  for (let i = 0; i <= 47; i++) {
    const columnOfThree = [i, i + width, i + width * 2];
    const decidedColor = colorArrangement[i];
    const isBlank = colorArrangement[i] === Blank;


    if (columnOfThree.every(square => colorArrangement[square] === decidedColor) && !isBlank) {
      columnOfThree.forEach(num => colorArrangement[num] = Blank)
      setScore((score) => score + 3)
      return true;
    }
  }
 }

 

 const checkForRowofThree = () => {
  for (let i = 0; i < 64; i++) {
    const rowOfThree = [i, i + 1, i + 2];
    const decidedColor = colorArrangement[i];
    const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64];
    const isBlank = colorArrangement[i] === Blank;

    if (notValid.includes(i)) continue;

    if (rowOfThree.every(square => colorArrangement[square] === decidedColor) && !isBlank) {
      rowOfThree.forEach(num => colorArrangement[num] = Blank)
      setScore((score) => score + 3)
      return true;
    }
  }
 }

  const moveCandiesDown = () => {
    for (let i = 0; i <= 55; i++) {

      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
      const isFirstRow = firstRow.includes(i)

      if (isFirstRow && colorArrangement[i] === Blank) {
        let randColor = Math.floor(candyColors.length*Math.random());
        colorArrangement[i] = candyColors[randColor];
      }

      if (colorArrangement[i + width] === Blank) {
        colorArrangement[i + width] = colorArrangement[i];
        colorArrangement[i] = Blank;
      }

    }
  }

  const dragStart = (e) => {
    setSquareBeingDragged(e.target)
  }

  const dragDrop = (e) => {
    setSquareBeingReplaced(e.target)
  }

  const dragEnd = () => {
    const draggedID = parseInt(squareBeingDragged.getAttribute('data-id'))
    const replacedID = parseInt(squareBeingReplaced.getAttribute('data-id'))
    colorArrangement[replacedID] = squareBeingDragged.getAttribute('src');
    colorArrangement[draggedID] = squareBeingReplaced.getAttribute('src');

    const validMoves = [draggedID - 1, draggedID - width, draggedID + 1, draggedID + width]
    const validMove = validMoves.includes(replacedID);

    const cF = checkForColumnofFour();
    const cT =checkForColumnofThree();
    const rF =checkForRowofFour();
    const rT =checkForRowofThree();

    if (replacedID && validMove && (cF || cT || rF || rT)) {
      setSquareBeingDragged(null)
      setSquareBeingReplaced(null)
    } else {
      colorArrangement[replacedID] = squareBeingReplaced.getAttribute('src');;
      colorArrangement[draggedID] = squareBeingDragged.getAttribute('src');
      setColorArrangement([...colorArrangement])
    }
  }


  const createBoard = () => {
    const randColorArr = [];

    for (let i = 0; i < 64; i++) {
      const randomColor = candyColors[Math.floor(Math.random() * candyColors.length)]
      randColorArr.push(randomColor);
    }
    setColorArrangement(randColorArr);
 }



 useEffect(() => {
    createBoard()
    setScore(0)
    setMinutes(2);
    setSeconds(0)
 }, [])

 

 useEffect(() => {
  const timer = setInterval(() => {
  checkForColumnofThree();
  checkForColumnofFour();
  checkForRowofThree();
  checkForRowofFour();
  moveCandiesDown();
  setColorArrangement([...colorArrangement])
  setCount((count) => count + 1)
  if (seconds > 0 && count == 10) {
    setSeconds(seconds - 1);
    setCount(0)
  }
  if (seconds === 0 && count == 10) {
    if (minutes === 0) {
      setScore(0)
      clearInterval(timer)
    } else {
      setMinutes(minutes - 1)
      setSeconds(59)
      setCount(0)
    }
  }
  }, 100)
  return(() => clearInterval(timer))

  

 }, [checkForColumnofFour, checkForRowofFour, moveCandiesDown, 
  checkForRowofThree, checkForColumnofThree, colorArrangement])

  let finished = minutes === 0 && seconds === 0;

  

  return (
    <div className="App">
      <div className="game">
      
        {colorArrangement.map((candyColor, index) => (
          <img key={index} 
          src={candyColor}
          alt={candyColor} 
          data-id={index} 
          draggable={true}
          onDragStart={dragStart} 
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={(e) => e.preventDefault()}
          onDragLeave={(e) => e.preventDefault()}
          onDrop={dragDrop}
          onDragEnd={dragEnd}
          ></img>
        )
        )}
      {!finished && <h1 style={{fontSize: "25px", marginRight: '3rem'}}>Kakao Score: {score}</h1>}
      
      <h1 style={{fontSize: "25px"}}>Time Left: {minutes} : {seconds < 10 ?
      `0${seconds}` : seconds}</h1>
      <button className="button-32" onClick={() => window.location.reload(false)}>Reset</button>
      </div>
        
    </div>
  );
}

export default App;
