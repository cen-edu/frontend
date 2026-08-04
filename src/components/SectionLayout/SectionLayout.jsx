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
    const canHideHeader = pathname.startsWith('/learning/weaknesses');

    return (
        <div className={`section-layout ${canHideHeader && isHeaderHidden ? 'section-layout--header-hidden' : ''}`}>
            <Header hideOnWheel={canHideHeader} onHiddenChange={setIsHeaderHidden} />
            <div className="section-layout__body">
                <Sidebar ariaLabel={navigation.ariaLabel} menus={navigation.menus} />
                <main className="section-layout__content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default SectionLayout;
