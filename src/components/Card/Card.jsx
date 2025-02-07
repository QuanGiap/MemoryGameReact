import { useRef } from "react";
import "./Card.css"

const Card = ({ indexCard, cardStyle, alreadyMatched, onClick = () => {}, cardKey }) => {
  const cardRef = useRef(null);
  const onCardClick = () => {
    if (cardRef.current.dataset.matched==='true') return;
    const flipped = cardRef.current.classList.toggle("flipped");
    onClick(flipped, cardRef.current);
  };
  return (
    <div key={cardKey} ref={cardRef} className={`card ${alreadyMatched ? "matched" : ""}`} data-value={indexCard} data-matched={false}>
      <div className="card_inner" onClick={onCardClick}>
        <div className="card_front">
          <img src={`images/${cardStyle}/card_back.jpg`} alt="card back" className="card_image" />
        </div>
        <div className="card_back">
          <img src={`images/${cardStyle}/${indexCard}.png`} alt="card front" className="card_image" />
        </div>
        {/* avoid applying double correct style */}
        {(alreadyMatched && cardRef.current?.dataset.matched==='false') && <div className='card_img_correct no_animation'></div>}
      </div>
    </div>
  );
};

export default Card;