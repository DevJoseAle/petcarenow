import Ionicons from '@react-native-vector-icons/ionicons';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
}

export default function AdaptativeIcon({ name, size = 28, color = 'black' }: IconProps) {
  return (
    <Ionicons name={name as any} size={size} color={color} />
  );
}