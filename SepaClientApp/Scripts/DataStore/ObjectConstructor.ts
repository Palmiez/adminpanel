interface ObjectConstructor {
    keys(o: any): string[];
    values<T>(o: { [s: string]: T }): T[];
    values(o: any): any[];
    entries<T>(o: { [s: string]: T }): [string, T][];
    entries(o: any): [string, any][];
}