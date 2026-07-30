import { NavLink } from 'react-router-dom';
import './StudentSidebar.scss';

const menus = [
    { label: '학생 관리', path: '/students', end: true },
    { label: '반 관리', path: '/students/classes' },
];

function StudentSidebar() {
    return (
        <aside className="student-sidebar">
            <nav className="student-sidebar__navigation" aria-label="학생 관리 메뉴">
                {menus.map(({ label, path, end }) => (
                    <NavLink
                        key={path}
                        to={path}
                        end={end}
                        className={({ isActive }) =>
                            `student-sidebar__menu${isActive ? ' student-sidebar__menu--active' : ''}`
                        }
                    >
                        {label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}

export default StudentSidebar;
