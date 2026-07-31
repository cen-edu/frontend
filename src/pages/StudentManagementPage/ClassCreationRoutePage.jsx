import { useLocation, useNavigate } from 'react-router-dom';
import initialClasses from '../../mocks/classes';
import ClassCreationPage from './components/ClassCreationPage';
import './ClassCreationRoutePage.scss';

function ClassCreationRoutePage() {
    const navigate = useNavigate();
    const location = useLocation();
    const classes = location.state?.classes ?? initialClasses;

    const returnToClassList = (nextClasses = classes) => {
        navigate('/students/classes', { state: { classes: nextClasses } });
    };

    const registerClass = (classItem) => {
        const nextId = Math.max(...classes.map(({ id }) => id), 0) + 1;
        returnToClassList([...classes, { ...classItem, id: nextId }]);
    };

    return (
        <div className="class-creation-route class-creation-route--nested">
            <ClassCreationPage onClose={() => returnToClassList()} onRegister={registerClass} />
        </div>
    );
}

export default ClassCreationRoutePage;
