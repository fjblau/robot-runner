import PropTypes from 'prop-types';
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
        <div className="robot-torso"></div>
        <div className="robot-legs">
          <div className="robot-leg left"></div>
          <div className="robot-leg right"></div>
        </div>
      </div>
    </div>
  );
}

Robot.propTypes = {
  lane: PropTypes.number.isRequired
};

export default Robot;
