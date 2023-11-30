import React from 'react';
import { UserGroupIcon } from '@heroicons/react/24/solid'

export default function LoadingSpinner() {
    return (
        <div className="flex justify-center items-center flex-col">
            <div className="animate-pulse h-24 w-24 text-slate-900">
                <UserGroupIcon />
            </div>
            <p>Waiting for other players...</p>
        </div>
    )
}