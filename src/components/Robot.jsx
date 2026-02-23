import './Game.css';

function Robot({ lane }) {
  const lanePositions = {
    0: '12.5%',
    1: '37.5%',
    2: '62.5%',
    3: '87.5%'
  };

  return (
    <div 
      className="robot" 
      style={{ left: lanePositions[lane] }}
    >
      <div className="robot-body">
        <div className="robot-head"></div>
        <div className="robot-torso-wrapper">
          <div className="robot-arm left"></div>
          <div className="robot-torso"></div>
          <div className="robot-arm right"></div>
        </div>
        <div className="robot-legs">
          <div className="robot-leg left"></div>
          <div className="robot-leg right"></div>
        </div>
      </div>
    </div>
  );
}

export default Robot;
