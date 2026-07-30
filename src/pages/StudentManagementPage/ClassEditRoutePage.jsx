import { useLocation, useNavigate, useParams } from 'react-router-dom';
import initialClasses from '../../mocks/classes';
import ClassCreationPage from './components/ClassCreationPage';
import './ClassCreationRoutePage.scss';

function ClassEditRoutePage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { classId } = useParams();
    const classes = location.state?.classes ?? initialClasses;
    const targetClass = classes.find(({ id }) => id === Number(classId));

    const returnToClassList = (nextClasses = classes) => {
        navigate('/students/classes', { state: { classes: nextClasses } });
    };

    const updateClass = (updatedClass) => {
        const nextClasses = classes.map((classItem) => classItem.id === updatedClass.id ? updatedClass : classItem);
        returnToClassList(nextClasses);
    };

    if (!targetClass) {
        return (
            <main className="class-creation-route class-creation-route--missing">
                <section className="class-creation-route__missing-card">
                    <p>수정할 반을 찾을 수 없습니다.</p>
                    <button type="button" onClick={() => returnToClassList()}>반 목록으로 돌아가기</button>
                </section>
            </main>
        );
    }

    return (
        <main className="class-creation-route">
            <ClassCreationPage
                initialClass={targetClass}
                title="반 수정"
                submitLabel="수정하기"
                onClose={() => returnToClassList()}
                onRegister={updateClass}
            />
        </main>
    );
}

export default ClassEditRoutePage;
