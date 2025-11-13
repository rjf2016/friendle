import { use } from 'react';
import GameClient from './game-client';

export default function GamePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);

  return <GameClient token={token} />;
}
