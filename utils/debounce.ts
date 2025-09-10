import { useRef, useEffect } from 'react';

export function useDebounce<T extends (...args: any[]) => void>(
    fn: T,
    delay = 400
) {
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const cb = (...args: Parameters<T>) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => fn(...args), delay);
    };
    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }, []);
    return cb as T;
}
