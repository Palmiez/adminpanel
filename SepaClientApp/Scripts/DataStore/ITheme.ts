interface ITheme {
    uri: string;
    category: string;
    name: string;
    count: number;
    visible: boolean;
}

interface IThemeLookup {
    id: number;
    category: string;
    theme: string;
    uri: string;
}