import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query';
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom";
import queryClient from './api/queryClient';
import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css'
import '@kfonts/hakgyoansim-bunpil'
import './index.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { DialogProvider } from './components/common/feedback';

createRoot(document.getElementById('root')).render(
    <QueryClientProvider client={queryClient}>
        <DialogProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </DialogProvider>
    </QueryClientProvider>
)
