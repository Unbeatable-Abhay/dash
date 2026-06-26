import { useCountUp } from '../hooks/useCountUp';
import { formatNumber } from '../utils/format';

export default function CountUpNumber({ value, versionKey, suffix = '' }) {
  const animated = useCountUp(value, versionKey);
  return <>{formatNumber(animated)}{suffix}</>;
}
