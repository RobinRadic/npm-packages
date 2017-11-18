export interface GitUser {
}
export interface GitGroup {
}
export interface GitRepository {
}
export interface IGitTransformer {
    createRepository(res: any): any;
    listRepositories(res: any): any;
    getUserGroups(res: any): any;
    deleteRepository(res: any): any;
}
