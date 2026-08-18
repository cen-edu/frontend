import { useEffect, useMemo, useState } from 'react';
import StudentFormModal from '../../../students/shared/StudentFormModal';
import { CustomSelect } from '../../../../components/common/inputs';
import { useAcademicContextsQuery } from '../../../../components/common/filters';
import { useAssignWorksheetMutation } from '../problemLibraryHooks.js';

const padDatePart = (value) => String(value).padStart(2, '0');

const getDefaultDueAt = () => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    date.setHours(23, 59, 0, 0);

    return [
        date.getFullYear(),
        '-',
        padDatePart(date.getMonth() + 1),
        '-',
        padDatePart(date.getDate()),
        'T',
        padDatePart(date.getHours()),
        ':',
        padDatePart(date.getMinutes()),
    ].join('');
};

const assignmentErrorMessages = {
    INVALID_INPUT_VALUE: '반과 제출 기한을 다시 확인해 주세요.',
    WORKSHEET_DUE_IN_PAST: '제출 기한은 현재보다 미래로 설정해 주세요.',
    WORKSHEET_NOT_FOUND: '학습지를 찾을 수 없거나 출제 권한이 없습니다.',
    WORKSHEET_CLASS_NOT_OWNED: '담당하고 있는 반만 선택할 수 있습니다.',
    WORKSHEET_DUPLICATE_ASSIGNMENT: '이미 같은 반에 출제된 학습지입니다.',
};

function AssignWorksheetModal({ worksheet, onClose, onAssign }) {
    const [classId, setClassId] = useState('');
    const [dueAt, setDueAt] = useState(getDefaultDueAt);
    const [validationError, setValidationError] = useState('');
    const academicContextsQuery = useAcademicContextsQuery();
    const assignMutation = useAssignWorksheetMutation();
    const worksheetGrade = String(worksheet.grade ?? worksheet.gradeId?.replace('middle-', '') ?? '');
    const classOptions = useMemo(() => {
        const academicYears = academicContextsQuery.data?.academicYears ?? [];
        const defaultAcademicYear = String(academicContextsQuery.data?.defaults?.academicYear ?? '');
        const academicYear = academicYears.find(({ year }) => String(year) === defaultAcademicYear)
            ?? academicYears[0];
        const grade = academicYear?.grades.find((item) => String(item.grade) === worksheetGrade);

        return (grade?.classes ?? []).map((item) => ({
            value: String(item.id),
            label: item.name,
        }));
    }, [academicContextsQuery.data, worksheetGrade]);

    useEffect(() => {
        setClassId((current) => (
            classOptions.some((item) => item.value === current)
                ? current
                : classOptions[0]?.value ?? ''
        ));
    }, [classOptions]);

    const selectedClass = classOptions.find((item) => item.value === classId);

    const submit = () => {
        const selectedDueAt = new Date(dueAt);

        if (!classId) {
            setValidationError('출제할 반을 선택해 주세요.');
            return;
        }

        if (Number.isNaN(selectedDueAt.getTime()) || selectedDueAt.getTime() <= Date.now()) {
            setValidationError('제출 기한은 현재보다 미래로 설정해 주세요.');
            return;
        }

        setValidationError('');
        assignMutation.mutate({
            worksheetId: worksheet.id,
            classId,
            dueAt: selectedDueAt.toISOString(),
        }, {
            onSuccess: (assignment) => onAssign({
                ...assignment,
                className: assignment.className ?? selectedClass?.label,
            }),
        });
    };

    const errorMessage = validationError
        || assignmentErrorMessages[assignMutation.error?.code]
        || assignMutation.error?.message;

    return <StudentFormModal title="학습지 출제" closeLabel="출제 창 닫기" onClose={onClose} width={560}>
        <div className="library-modal__content">
            <p><strong>{worksheet.title}</strong>을 출제할 반과 기한을 선택합니다.</p>
            <label>
                <span>반</span>
                <CustomSelect
                    label="출제할 반 선택"
                    value={classId}
                    options={classOptions}
                    onChange={(value) => {
                        setClassId(value);
                        setValidationError('');
                        assignMutation.reset();
                    }}
                    width="100%"
                    disabled={academicContextsQuery.isPending || academicContextsQuery.isError || classOptions.length === 0 || assignMutation.isPending}
                />
            </label>
            {academicContextsQuery.isPending && <p className="library-modal__help">반을 불러오는 중입니다.</p>}
            {academicContextsQuery.isError && <p className="library-modal__error" role="alert">{academicContextsQuery.error?.message || '반을 불러오지 못했습니다.'}</p>}
            {!academicContextsQuery.isPending && !academicContextsQuery.isError && classOptions.length === 0 && <p className="library-modal__error" role="alert">이 학년에서 출제할 수 있는 반이 없습니다.</p>}
            <label>
                <span>제출 기한</span>
                <input
                    type="datetime-local"
                    value={dueAt}
                    onChange={(event) => {
                        setDueAt(event.target.value);
                        setValidationError('');
                        assignMutation.reset();
                    }}
                    disabled={assignMutation.isPending}
                />
            </label>
            {errorMessage && <p className="library-modal__error" role="alert">{errorMessage}</p>}
        </div>
        <footer className="student-form-modal__footer"><button type="button" className="student-form-modal__secondary-button" disabled={assignMutation.isPending} onClick={onClose}>취소</button><button type="button" className="student-form-modal__primary-button" disabled={!classId || !dueAt || academicContextsQuery.isPending || academicContextsQuery.isError || assignMutation.isPending} onClick={submit}>{assignMutation.isPending ? '출제 중...' : '출제'}</button></footer>
    </StudentFormModal>;
}

export default AssignWorksheetModal;
