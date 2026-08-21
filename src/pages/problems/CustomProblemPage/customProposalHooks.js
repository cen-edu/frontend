import { useQuery } from '@tanstack/react-query';
import { getStudentReissueProposal } from '../../../api/analysis/analysisApi.js';

export const customProposalQueryKeys = {
    proposal: (assignmentId, studentId) => [
        'teacher',
        'analysis',
        'assignment',
        String(assignmentId),
        'student',
        String(studentId),
        'reissue-proposal',
    ],
};

export const useStudentReissueProposalQuery = (assignmentId, studentId) => useQuery({
    queryKey: customProposalQueryKeys.proposal(assignmentId, studentId),
    queryFn: ({ signal }) => getStudentReissueProposal({ assignmentId, studentId, signal }),
    enabled: Boolean(assignmentId && studentId),
});
