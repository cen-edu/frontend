import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import { sidebarMenus } from '../../config/sidebarMenus';
import './SectionLayout.scss';

function SectionLayout({ section }) {
    const navigation = sidebarMenus[section];
    const { pathname } = useLocation();
    const [isHeaderHidden, setIsHeaderHidden] = useState(false);
    const [isFocusMode, setIsFocusMode] = useState(false);
    const canHideHeader = pathname.startsWith('/learning/weaknesses');

    return (
        <div className={`section-layout ${canHideHeader && isHeaderHidden ? 'section-layout--header-hidden' : ''} ${isFocusMode ? 'section-layout--focus-mode' : ''}`}>
            {!isFocusMode && <Header hideOnWheel={canHideHeader} onHiddenChange={setIsHeaderHidden} />}
            <div className="section-layout__body">
                {!isFocusMode && <Sidebar ariaLabel={navigation.ariaLabel} menus={navigation.menus} />}
                <main className="section-layout__content">
                    <Outlet context={{ setFocusMode: setIsFocusMode }} />
                </main>
            </div>
        </div>
    );
}

export default SectionLayout;
