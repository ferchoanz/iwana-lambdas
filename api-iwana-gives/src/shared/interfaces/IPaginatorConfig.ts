export interface IPaginatorConfig {
    helper?: (data: any) => Promise<any>;
    metadata?: Record<string, any>;
    offsetLimit?: boolean;
}
