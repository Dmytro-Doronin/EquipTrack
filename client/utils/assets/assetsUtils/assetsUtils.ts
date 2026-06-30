import axios from 'axios';

import { getErrorMessage } from '@/utils/ErrorUtil';

export const getCreateAssetErrorMessage = (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 403) {
        return 'Only organization owners and admins can create assets.';
    }

    return getErrorMessage(error);
};
