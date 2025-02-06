import { useState, useEffect, useRef } from 'react';
import './App.css';
import Card from './components/Card/Card';
import DropDown from './components/DropDown/DropDown';
import GameResult from './components/GameResult/GameResult';
import toTimeString from './tool/toTimeString';

const audio_correct = document.createElement("audio");
audio_correct.src =
  "https://cdn.pixabay.com/audio/2023/07/05/audio_ea7208a779.mp3";
const audio_flip = document.createElement("audio");
audio_flip.src =
  "https://cdn.pixabay.com/audio/2022/03/15/audio_e385f1aa0d.mp3";
const audio_gameover = document.createElement("audio");
audio_gameover.src =
  "https://cdn.pixabay.com/audio/2023/04/10/audio_b837c83014.mp3";
const audio_incorect = document.createElement("audio");
audio_incorect.src =
  "https://cdn.pixabay.com/audio/2022/03/10/audio_6b59debae7.mp3";


function App() {
  const [level, setLevel] = useState(4);
  const [cardStyle, setCardStyle] = useState('classic');
  const [cards, setCards] = useState([]);
  const [choices, setChoices] = useState([]);
  const [started, setStart] = useState(false);
  //use to save which card is matched
  const matchRef = useRef(new Set());
  const timerIdRef = useRef(-1);
  const cardContainerRef = useRef(null);
  const cardIdRef = useRef(0);
  const [remainCard, setRemainCard] = useState(-1);
  const [move, setMove] = useState(0);
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (localStorage.getItem('cards_info')) {
      getInfo();
      reloadPrevState();
    }
    // window.addEventListener('focus', handleFocus);
    // return () => {
    //   window.removeEventListener('focus', handleFocus);
    //   localStorage.setItem('moves', JSON.stringify(move));
    //   localStorage.setItem('times', JSON.stringify(time));
    // };
  }, []);


  const handleFocus = () => {
    if (localStorage.getItem('cards_info')) {
      getInfo();
      reloadPrevState();
    }
  };


  // const saveInfo = () => {
    // localStorage.setItem('card_match', JSON.stringify([...matchRef.current.values()]));
    // localStorage.setItem('cards_info', JSON.stringify(cards));
    // localStorage.setItem('times', JSON.stringify(time));
  // };

  const getInfo = () => {
    const savedCardsInfo = JSON.parse(localStorage.getItem('cards_info') || '[]');
    const savedMatchSet = new Set(JSON.parse(localStorage.getItem('card_match') || '[]'));
    const savedMove = JSON.parse(localStorage.getItem('moves') || '0');
    const savedTime = JSON.parse(localStorage.getItem('times') || '0');
    console.log(savedMove);
    console.log(savedTime);
    setCards(savedCardsInfo);
    matchRef.current = savedMatchSet;
    setMove(savedMove);
    setTime(savedTime);
  };

  const reloadPrevState = () => {
    const savedLevel = JSON.parse(localStorage.getItem('level') || '4');
    setLevel(savedLevel);
    setCardStyle(localStorage.getItem('card_type') || 'classic');
    cardContainerRef.current.style.gridTemplateColumns = `repeat(${savedLevel}, 1fr)`;
    let countRemain = 0;
    for (let i = 0; i < cards.length; i++) {
      const num = cards[i];
      if (!matchRef.current.has(num)) {
        countRemain++;
      }
      //create a card from card info
    }
    cardIdRef.current++;
    updateMove();
    updateTime();
    clearInterval(timerIdRef.current);
    setStart(true);
    setRemainCard(countRemain);
    timerIdRef.current = setInterval(updateTime,1000);
  };

  const restart = () => {
    localStorage.clear();
    matchRef.current = new Set();
    setChoices([]);
    localStorage.setItem('level', JSON.stringify(level));
    localStorage.setItem('card_type', cardStyle);
    const cards_cur = [];
    //calculate card amount needed
    const card_amount = (level * level) / 2;
    //create cards
    for (let i = 1; i <= card_amount; i++) {
      //create 2 pair and put in array
      cards_cur.push(i,i);
    }
    cardContainerRef.current.style.gridTemplateColumns = `repeat(${level}, 1fr)`;
    setRemainCard(card_amount*2);
    cardIdRef.current +=1;
    //shuffle cards
    cards_cur.sort(() => Math.random() - 0.5);
    setCards(cards_cur);
    //reset time and move
    clearInterval(timerIdRef.current);
    updateMove(0);
    updateTime(true);
    timerIdRef.current = setInterval(updateTime, 1000);
    localStorage.setItem('cards_info', JSON.stringify(cards_cur));
  };

  const updateMove = (newMove = -1) => {
    if (newMove !== -1) setMove(newMove);
    else setMove(prevMove => prevMove + 1);
    localStorage.setItem('moves', JSON.stringify(move));
  };

  const updateTime = (restart = false) => {
    if (restart) setTime(0);
    else setTime(prevTime => prevTime + 1);
    localStorage.setItem('times', JSON.stringify(time));
  };
  const onClickCard = (flipped,card) => {
    if (flipped) {
      let remain = remainCard;
      if (choices.length >= 1) {
        updateMove();
        const first = choices[0];
        const second = card;
        //on match
        if (first.dataset.value === second.dataset.value) {
          //save match info to local storage later
          matchRef.current.add(first.dataset.value);
          localStorage.setItem('card_match', JSON.stringify([...matchRef.current.values()]));
          //set matched to true
          first.dataset.matched = true;
          second.dataset.matched = true;
          //add matched class
          first.classList.add("matched");
          second.classList.add("matched");
          //add effect to card matched
          addEffectCardMatched(first);
          addEffectCardMatched(second);
          //reset choices
          setChoices([])
          remain -= 2;
          //check if all cards are matched
          if (remain <= 0) {
            audio_gameover.play();
            clearInterval(timerIdRef.current);
          }
          setRemainCard(remain);
        } else {
          //add effect to card incorrect
          addEffectCardIncorrect(first);
          addEffectCardIncorrect(second);
          //wait for 1 second then flip back
          setTimeout(() => {
            first.classList.remove("flipped");
            second.classList.remove("flipped");
          }, 1000);
          setChoices([]);
        }
      }
      else{
        setChoices(prev=>[...prev,card])
      }
    }
    // call is flip back, pop the choice
    else {
      choices.pop();
    }
  };
  return (
    <div id="game_container">
      <h1>Memory Game</h1>
      <div id="game_controls">
        <DropDown title="Choose level:" optionsTitle={["Easy","Medium","Hard"]} optionsValue={[4,6,8]} onChange={(val)=>setLevel(val)} value={level}/>
        <DropDown title="Choose card type:" optionsTitle={["Classic","Drawing"]} optionsValue={["classic","drawing"]} onChange={(val)=>setCardStyle(val)} value={cardStyle}/>
        <button onClick={restart}>Start Game</button>
      </div>
      <div id="game_info">
        <p>Move: <span>{move}</span></p>
        <p>Time: <span>{toTimeString(time)}</span></p>
      </div>
      <div id="cards_container" ref={cardContainerRef}>
        {cards.map((card_i, index) => (
          <Card
            key={index}
            cardKey={index+""+cardIdRef.current}
            indexCard={card_i}
            cardStyle={cardStyle}
            isMatched={matchRef.current.has(card_i)}
            onClick={onClickCard}
          />))}
      </div>
      
     {/* {remainCard === 0 && <GameResult moves={move} time={time} onClickRestart={restart}/>} */}
    </div>
  );
}

/**
 * Plays the correct match audio and adds a visual effect to the matched card.
 * @param {HTMLElement} card - The card element that was matched.
 */
function addEffectCardMatched(card) {
  const card_img_effect = window.document.createElement("div");
  card_img_effect.classList.add("card_img_correct");
  card.querySelector(".card_inner").appendChild(card_img_effect);
  audio_correct.play();
}

/**
 * Plays the incorrect match audio and adds a visual effect to the incorrect card.
 * @param {HTMLElement} card - The card element that was incorrectly matched.
 */
function addEffectCardIncorrect(card) {
  const card_img_effect = window.document.createElement("div");
  const card_inner = card.querySelector(".card_inner");
  card_img_effect.classList.add("card_img_incorrect");
  card_inner.appendChild(card_img_effect);
  setTimeout(() => {
    card_inner.removeChild(card_img_effect);
  }, 600);
  audio_incorect.play();
}

export default App;
