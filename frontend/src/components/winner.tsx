import { TrophyIcon } from '@heroicons/react/24/solid';
import React from 'react';

export function Winner({winner}: {winner: string}) {
    return <div className="flex justify-center items-center flex-col">
        <div className="h-24 w-24 text-amber-400">
            <TrophyIcon />
        </div>
        <p>{winner} has won the game!</p>
    </div>;
}