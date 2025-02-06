import { useState, useEffect, useMemo,useRef } from 'react';
import './App.css';
import Card from './components/Card';

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
  //
  const [cards, setCards] = useState([]);
  const [choices, setChoices] = useState([]);
  //use to save which card is matched
  const matchRef = useRef(new Set());
  const timerId = useRef(-1);
  const cardContainerRef = useRef(null);
  const [remainCard, setRemainCard] = useState(-1);
  const [move, setMove] = useState(0);
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (localStorage.getItem('cards_info')) {
      // getInfo();
      reloadPrevState();
    }
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
  const handleFocus = () => {
    // if (localStorage.getItem('cards_info')) {
    //   getInfo();
    //   reloadPrevState();
    // }
  };

  const handleBlur = () => {
    saveInfo();
  };

  const handleBeforeUnload = () => {
    saveInfo();
  };

  const saveInfo = () => {
    // localStorage.setItem('card_match', JSON.stringify([...matchSet.values()]));
    // localStorage.setItem('cards_info', JSON.stringify(cards.map(card => card.dataset.value)));
    // localStorage.setItem('moves', JSON.stringify(move));
    // localStorage.setItem('times', JSON.stringify(time));
  };

  const getInfo = () => {
    // const savedCardsInfo = JSON.parse(localStorage.getItem('cards_info') || '[]');
    // const savedMatchSet = new Set(JSON.parse(localStorage.getItem('card_match') || '[]'));
    // const savedMove = JSON.parse(localStorage.getItem('moves') || '0') - 1;
    // const savedTime = JSON.parse(localStorage.getItem('times') || '0') - 1;
    // setCards(savedCardsInfo);
    // setMatchSet(savedMatchSet);
    // setMove(savedMove);
    // setTime(savedTime);
  };

  const reloadPrevState = () => {
    // const savedLevel = JSON.parse(localStorage.getItem('level') || '4');
    // setLevel(savedLevel);
    // setCardStyle(localStorage.getItem('card_type') || 'classic');
    // ...existing code...
  };

  const restart = () => {
    // localStorage.clear();
    matchRef.current = new Set();
    setChoices([]);
    // localStorage.setItem('level', JSON.stringify(level));
    // localStorage.setItem('card_type', cardStyle);
    const cards_cur = [];
    //calculate card amount needed
    const card_amount = (level * level) / 2;
    //create cards
    for (let i = 1; i <= card_amount; i++) {
      //create 2 pair and put in array
      const card1 = i;
      const card2 = i;
      cards_cur.push(card1,card2);
    }
    cardContainerRef.current.style.gridTemplateColumns = `repeat(${level}, 1fr)`;
    setRemainCard(card_amount*2)
    //shuffle cards
    cards_cur.sort(() => Math.random() - 0.5);
    setCards(cards_cur);
    //save cards order for the local storage
    // cards_info = cards.map((card) => card.dataset.value);
    //change grid style for card container
    // card_container.style.gridTemplateColumns = `repeat(${level}, 1fr)`;
    // updateUI();
    // cards.forEach((card) => card_container.appendChild(card));
    //reset time and move
    clearInterval(timerId.current);
    updateMove(0);
    updateTime(true);
    //hide game_over_info
    // game_win_info.style.visibility = "hidden";
    timerId.current = setInterval(updateTime, 1000);
    // saveInfo();
  };

  const updateMove = (newMove = -1) => {
    if (newMove !== -1) setMove(newMove);
    else setMove(prevMove => prevMove + 1);
  };

  const updateTime = (restart = false) => {
    if (restart) setTime(0);
    else setTime(prevTime => prevTime + 1);
  };
  const onClickCard = (flipped,card) => {
    if (flipped) {
      let remain = remainCard;
      if (choices.length >= 1) {
        updateMove();
        const first = choices[0];
        const second = card;
        if (first.dataset.value === second.dataset.value) {
          //save match info to local storage later
          matchRef.current.add(first.dataset.value);
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
            clearInterval(timerId.current);
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
        <label>
          Choose level:
          <select value={level} onChange={(e) => setLevel(Number(e.target.value))}>
            <option value="4">Easy</option>
            <option value="6">Medium</option>
            <option value="8">Hard</option>
          </select>
        </label>
        <label>
          Choose card type:
          <select value={cardStyle} onChange={(e) => setCardStyle(e.target.value)}>
            <option value="classic">Classic</option>
            <option value="drawing">Drawing</option>
          </select>
        </label>
        <button onClick={restart}>Start Game</button>
      </div>
      <div id="game_info">
        <p>Move: <span>{move}</span></p>
        <p>Time: <span>{`${Math.floor(time / 60).toString().padStart(2, '0')}:${(time % 60).toString().padStart(2, '0')}`}</span></p>
      </div>
      <div id="cards_container" ref={cardContainerRef}>
        {cards.map((card_i, index) => (
          <Card
            key={index+level}
            indexCard={card_i}
            cardStyle={cardStyle}
            isMatched={matchRef.current.has(card_i)}
            onClick={onClickCard}
          />))}
      </div>

     {remainCard==0 && <div id="game_win_background">
        <div id="game_win_container">
          <h2>Congratulations! You won!</h2>
          <p>Total Moves: <span>{move}</span></p>
          <p>Total Time: <span>{`${Math.floor(time / 60).toString().padStart(2, '0')}:${(time % 60).toString().padStart(2, '0')}`}</span></p>
          <button onClick={restart}>Play Again</button>
        </div>
      </div>}
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
