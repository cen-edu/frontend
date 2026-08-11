import { QueryClient } from '@tanstack/react-query';

const STALE_TIME_MS = 30 * 1000;
const GC_TIME_MS = 5 * 60 * 1000;

const shouldRetryQuery = (failureCount, error) => {
    const isClientError = error?.status >= 400 && error?.status < 500;

    return !isClientError && failureCount < 1;
};

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: STALE_TIME_MS,
            gcTime: GC_TIME_MS,
            retry: shouldRetryQuery,
            refetchOnWindowFocus: false,
        },
        mutations: {
            retry: false,
        },
    },
});

export default queryClient;
