import { loadHulpvraagTonen } from '../lib/onderwijsSettings';
import type { GameAction } from './gameReducer';

export function eindeAfleveringNaPauzekaart(dispatch: (a: GameAction) => void): void {
  if (loadHulpvraagTonen()) {
    dispatch({ type: 'SET_PHASE', phase: 'hulpvraag' });
  } else {
    dispatch({ type: 'SET_PHASE', phase: 'nabespreking' });
  }
}

export function hulpvraagActief(): boolean {
  return loadHulpvraagTonen();
}