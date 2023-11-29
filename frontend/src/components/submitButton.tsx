'use client'


import React, { ReactNode } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from './ui/button';


export function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <>
            <Button
                className='bg-slate-800 text-white rounded hover:bg-slate-600'
                type="submit"
                aria-disabled={pending}
                disabled={pending}
            >

                {pending ? "Joining..." : "Join Game!"}
            </Button>
        </>
    );
}