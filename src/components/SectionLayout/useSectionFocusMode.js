import { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

function useSectionFocusMode(enabled) {
    const { setFocusMode } = useOutletContext() ?? {};

    useEffect(() => {
        setFocusMode?.(enabled);

        return () => setFocusMode?.(false);
    }, [enabled, setFocusMode]);
}

export default useSectionFocusMode;
