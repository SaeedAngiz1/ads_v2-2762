import {useMutation} from '@tanstack/react-query';
import {orpc} from '../lib/api';
export function useSubmitEnquiry(){return useMutation(orpc.enquiries.submit.mutationOptions())}
