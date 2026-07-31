import { NavLink } from 'react-router-dom';
import './Sidebar.scss';

function Sidebar({ ariaLabel, menus }) {
    return (
        <aside className="sidebar">
            <nav className="sidebar__navigation" aria-label={ariaLabel}>
                {menus.map(({ label, path, end }) => (
                    <NavLink
                        key={path}
                        to={path}
                        end={end}
                        className={({ isActive }) =>
                            `sidebar__menu${isActive ? ' sidebar__menu--active' : ''}`
                        }
                    >
                        {label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}

export default Sidebar;
