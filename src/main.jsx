import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom";
import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css'
import '@kfonts/hakgyoansim-bunpil'
import './index.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
)
