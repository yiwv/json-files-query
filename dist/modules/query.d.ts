import type { QueryBuilder, ParsedContent } from '../types';
import type { ContentQueryBuilder, ContentQueryBuilderParams, ContentQueryFetcher } from '../types/query';
interface QueryOptions {
    initialParams?: ContentQueryBuilderParams;
    legacy?: boolean;
}
export declare function createQuery<T = ParsedContent>(fetcher: ContentQueryFetcher<T>, opts: QueryOptions & {
    legacy: true;
}): QueryBuilder<T>;
export declare function createQuery<T = ParsedContent>(fetcher: ContentQueryFetcher<T>, opts: QueryOptions & {
    legacy: false;
}): ContentQueryBuilder<T>;
export {};
