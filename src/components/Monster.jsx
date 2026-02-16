import './Game.css';

function Monster({ lane, position }) {
  const lanePositions = {
    0: '12.5%',
    1: '37.5%',
    2: '62.5%',
    3: '87.5%'
  };

  return (
    <div 
      className="monster" 
      style={{ 
        left: lanePositions[lane],
        top: `${position}%`
      }}
    >
      <div className="monster-body">
        <div className="monster-eye left-eye"></div>
        <div className="monster-eye right-eye"></div>
        <div className="monster-mouth"></div>
      </div>
    </div>
  );
}

export default Monster;
