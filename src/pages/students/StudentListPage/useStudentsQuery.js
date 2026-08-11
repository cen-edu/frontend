import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getStudents } from '../../../api/students/studentsApi.js';

const studentQueryKeys = {
    all: ['teacher', 'students'],
    list: (params) => [...studentQueryKeys.all, 'list', params],
};

const useStudentsQuery = (params) => useQuery({
    queryKey: studentQueryKeys.list(params),
    queryFn: ({ signal }) => getStudents({ ...params, signal }),
    placeholderData: keepPreviousData,
});

export default useStudentsQuery;
