import { SetMetadata } from '@nestjs/common';

export const SKIP_ACTIVE_CHECK_KEY = 'skipActiveCheck';
export const SkipActiveCheck = () => SetMetadata(SKIP_ACTIVE_CHECK_KEY, true); 