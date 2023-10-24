import type { ContentQueryResponse } from '../../types/api';
import type { ContentQueryBuilder } from '../../types/query';
export declare function createPipelineFetcher<T>(getContentsList: () => Promise<T[]>): (query: ContentQueryBuilder<T>) => Promise<ContentQueryResponse<T>>;
