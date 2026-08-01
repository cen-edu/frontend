function StudentOptionalFields({ form, onChange }) {
    return (
        <>
            <label className="student-form-modal__field">
                <span>학생 연락처</span>
                <input name="studentPhone" value={form.studentPhone} type="tel" placeholder="숫자만 입력" onChange={onChange} />
            </label>
            <label className="student-form-modal__field">
                <span>학부모 연락처</span>
                <input name="parentPhone" value={form.parentPhone} type="tel" placeholder="숫자만 입력" onChange={onChange} />
            </label>
            <label className="student-form-modal__field">
                <span>학생 생년월일</span>
                <div className="student-form-modal__icon-input">
                    <i className="bi bi-calendar3" aria-hidden="true" />
                    <input name="birthDate" value={form.birthDate} inputMode="numeric" placeholder="YYYY.MM.DD" onChange={onChange} />
                </div>
            </label>
            <label className="student-form-modal__field">
                <span>학생 이메일</span>
                <input name="email" value={form.email} type="email" placeholder="예시 : student@math.com" onChange={onChange} />
            </label>
            <label className="student-form-modal__field">
                <span>집 주소</span>
                <input name="address" value={form.address} placeholder="주소 입력" onChange={onChange} />
            </label>
            <label className="student-form-modal__field">
                <span>집 전화</span>
                <input name="homePhone" value={form.homePhone} type="tel" placeholder="숫자만 입력" onChange={onChange} />
            </label>
            <label className="student-form-modal__field student-form-modal__field--wide">
                <span>비고 및<br />학생 특이사항</span>
                <textarea
                    name="note"
                    value={form.note}
                    placeholder="학생 지도에 참고할 내용을 입력하세요.&#10;예: 문제를 빨리 풀어 실수가 잦음"
                    onChange={onChange}
                />
            </label>
        </>
    );
}

export default StudentOptionalFields;
