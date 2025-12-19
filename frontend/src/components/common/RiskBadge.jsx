import { getRiskColor } from '../../utils/helpers';

const RiskBadge = ({ riskLevel, showScore = false, score = 0 }) => {
  const colorClass = getRiskColor(riskLevel);

  return (
    <span className={`badge border ${colorClass}`}>
      {riskLevel ? riskLevel.toUpperCase() : 'UNKNOWN'}
      {showScore && score > 0 && ` (${score})`}
    </span>
  );
};

export default RiskBadge;