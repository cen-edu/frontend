import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import { sidebarMenus } from '../../config/sidebarMenus';
import './SectionLayout.scss';

function SectionLayout({ section }) {
    const navigation = sidebarMenus[section];

    return (
        <div className="section-layout">
            <Header />
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
