import { useDeferredValue, useEffect, useRef, useState } from 'react';
import { CustomSelect } from '../../../../components/common/inputs';
import StudentFormModal from '../../shared/StudentFormModal';
import { GRADE_OPTIONS } from '../../shared/gradeOptions';
import {
    useAvailableClassStudentsQuery,
    useClassDetailQuery,
    useCreateClassMutation,
    useUpdateClassMutation,
} from '../classHooks';
import { CURRENT_ACADEMIC_YEAR } from '../classFormConfig';
import './ClassFormModal.scss';

function SearchField({ value, onChange, disabled }) {
    return (
        <div className="class-form-modal__search">
            <i className="bi bi-search" aria-hidden="true" />
            <input
                type="search"
                aria-label="학생 이름 검색"
                placeholder="학생 이름 검색"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                disabled={disabled}
            />
            {value && (
                <button
                    type="button"
                    aria-label="학생 이름 검색 초기화"
                    onClick={() => onChange('')}
                    disabled={disabled}
                >
                    <i className="bi bi-x-lg" aria-hidden="true" />
                </button>
            )}
        </div>
    );
}

function ClassFormModal({ initialClass = null, onClose, onSaved }) {
    const isDetail = Boolean(initialClass?.id);
    const [academicYear, setAcademicYear] = useState(
        initialClass?.academicYear ?? CURRENT_ACADEMIC_YEAR,
    );
    const [grade, setGrade] = useState(String(initialClass?.grade ?? '1'));
    const [className, setClassName] = useState(initialClass?.name ?? '');
    const [studentSearch, setStudentSearch] = useState('');
    const [selectedStudents, setSelectedStudents] = useState([]);
    const deferredStudentSearch = useDeferredValue(studentSearch);
    const detailInitializedRef = useRef(false);

    const detailQuery = useClassDetailQuery(initialClass?.id);
    const candidateQuery = useAvailableClassStudentsQuery({
        grade,
        keyword: deferredStudentSearch,
    });
    const createMutation = useCreateClassMutation();
    const updateMutation = useUpdateClassMutation();
    const saveMutation = isDetail ? updateMutation : createMutation;

    useEffect(() => {
        if (!isDetail || !detailQuery.data || detailInitializedRef.current) return;

        setAcademicYear(detailQuery.data.academicYear);
        setGrade(String(detailQuery.data.grade));
        setClassName(detailQuery.data.name);
        setSelectedStudents(detailQuery.data.students ?? []);
        detailInitializedRef.current = true;
    }, [detailQuery.data, isDetail]);

    const selectedStudentIds = selectedStudents.map(({ id }) => id);
    const availableStudents = (candidateQuery.data ?? []).filter(
        ({ id }) => !selectedStudentIds.includes(id),
    );
    const isDetailLoading = isDetail && detailQuery.isPending;
    const isSaving = saveMutation.isPending;

    const addStudent = (student) => {
        setSelectedStudents((current) => (
            current.some(({ id }) => id === student.id)
                ? current
                : [...current, student]
        ));
    };

    const removeStudent = (studentId) => {
        setSelectedStudents((current) => current.filter(({ id }) => id !== studentId));
    };

    const changeGrade = (nextGrade) => {
        setGrade(nextGrade);
        setStudentSearch('');
        setSelectedStudents([]);
        detailInitializedRef.current = true;
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const trimmedName = className.trim();
        if (!trimmedName || trimmedName.length > 20 || isDetailLoading || detailQuery.isError) return;

        const payload = {
            academicYear,
            grade,
            name: trimmedName,
            studentIds: selectedStudentIds,
        };

        saveMutation.mutate(
            isDetail ? { ...payload, classId: initialClass.id } : payload,
            { onSuccess: onSaved },
        );
    };

    return (
        <StudentFormModal
            title={isDetail ? '반 상세 정보' : '반 만들기'}
            closeLabel={isDetail ? '반 상세 정보 창 닫기' : '반 만들기 창 닫기'}
            onClose={onClose}
            width={920}
        >
            <form className="class-form-modal" onSubmit={handleSubmit}>
                <div className="class-form-modal__fields">
                    <label className="class-form-modal__name-field">
                        <span>학년도</span>
                        <input
                            className="class-form-modal__readonly"
                            value={`${academicYear}학년도`}
                            readOnly
                            aria-readonly="true"
                        />
                    </label>
                    <div className="class-form-modal__select-field">
                        <span>학년</span>
                        <CustomSelect
                            label="반 학년 선택"
                            value={grade}
                            options={GRADE_OPTIONS}
                            onChange={changeGrade}
                            width="100%"
                            disabled={isDetailLoading || isSaving}
                        />
                    </div>
                    <label className="class-form-modal__name-field">
                        <span>반 이름</span>
                        <input
                            type="text"
                            placeholder="예: 1반"
                            maxLength={20}
                            value={className}
                            autoFocus={!isDetail}
                            onChange={(event) => setClassName(event.target.value)}
                            disabled={isDetailLoading || isSaving}
                        />
                    </label>
                </div>

                <section className="class-form-modal__students" aria-labelledby="class-form-students-title">
                    <h3 id="class-form-students-title">반 학생</h3>
                    <div className="class-form-modal__pair">
                        <div className="class-form-modal__source">
                            <SearchField
                                value={studentSearch}
                                onChange={setStudentSearch}
                                disabled={isDetailLoading || isSaving}
                            />
                            <div className="class-form-modal__panel">
                                <div className="class-form-modal__panel-title">
                                    <strong>{grade}학년 학생</strong>
                                    <span>{candidateQuery.isPending ? '-' : `${availableStudents.length}명`}</span>
                                </div>
                                {candidateQuery.isPending && (
                                    <div className="class-form-modal__empty">학생 목록을 불러오는 중입니다.</div>
                                )}
                                {candidateQuery.isError && (
                                    <div className="class-form-modal__request-state" role="alert">
                                        <span>{candidateQuery.error?.message || '학생 목록을 불러오지 못했습니다.'}</span>
                                        <button
                                            type="button"
                                            onClick={() => candidateQuery.refetch()}
                                            disabled={candidateQuery.isFetching}
                                        >
                                            다시 불러오기
                                        </button>
                                    </div>
                                )}
                                {candidateQuery.isSuccess && availableStudents.map((student) => (
                                    <button
                                        type="button"
                                        className="class-form-modal__panel-row"
                                        key={student.id}
                                        aria-label={`${student.name} 추가`}
                                        onClick={() => addStudent(student)}
                                        disabled={isSaving}
                                    >
                                        <span>{student.name}</span>
                                        <i className="bi bi-plus-lg" aria-hidden="true" />
                                    </button>
                                ))}
                                {candidateQuery.isSuccess && availableStudents.length === 0 && (
                                    <div className="class-form-modal__empty">
                                        추가할 수 있는 {grade}학년 학생이 없습니다.
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="class-form-modal__panel class-form-modal__panel--selected">
                            <div className="class-form-modal__panel-title">
                                <strong>선택된 학생</strong>
                                <span>{isDetailLoading ? '-' : `${selectedStudents.length}명`}</span>
                            </div>
                            {isDetailLoading && (
                                <div className="class-form-modal__empty">반 학생을 불러오는 중입니다.</div>
                            )}
                            {detailQuery.isError && (
                                <div className="class-form-modal__request-state" role="alert">
                                    <span>{detailQuery.error?.message || '반 상세 정보를 불러오지 못했습니다.'}</span>
                                    <button
                                        type="button"
                                        onClick={() => detailQuery.refetch()}
                                        disabled={detailQuery.isFetching}
                                    >
                                        다시 불러오기
                                    </button>
                                </div>
                            )}
                            {!isDetailLoading && !detailQuery.isError && selectedStudents.map((student) => (
                                <button
                                    type="button"
                                    className="class-form-modal__panel-row class-form-modal__panel-row--remove"
                                    key={student.id}
                                    aria-label={`${student.name} 제외`}
                                    onClick={() => removeStudent(student.id)}
                                    disabled={isSaving}
                                >
                                    <span>{student.name}<em>{student.grade}학년</em></span>
                                    <i className="bi bi-dash-lg" aria-hidden="true" />
                                </button>
                            ))}
                            {!isDetailLoading && !detailQuery.isError && selectedStudents.length === 0 && (
                                <div className="class-form-modal__empty">왼쪽 목록에서 학생을 선택하세요.</div>
                            )}
                        </div>
                    </div>
                </section>

                {saveMutation.isError && (
                    <p className="class-form-modal__error" role="alert">
                        {saveMutation.error?.message || '반 정보를 저장하지 못했습니다.'}
                    </p>
                )}

                <footer className="student-form-modal__footer">
                    <button
                        type="submit"
                        className="student-form-modal__primary-button"
                        disabled={
                            !className.trim()
                            || isSaving
                            || isDetailLoading
                            || detailQuery.isError
                        }
                    >
                        {isSaving ? '저장 중...' : isDetail ? '저장하기' : '등록하기'}
                    </button>
                </footer>
            </form>
        </StudentFormModal>
    );
}

export default ClassFormModal;
