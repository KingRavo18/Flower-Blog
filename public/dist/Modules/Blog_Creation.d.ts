interface Blog_Data_Submission_Types {
    init: (event: SubmitEvent) => void;
    collect_tags: () => void;
}
export declare class Blog_Data_Submission implements Blog_Data_Submission_Types {
    #private;
    private submit_url;
    private is_blog_update;
    tags: string[];
    tag_input: HTMLInputElement;
    tag_display: HTMLElement;
    constructor(submit_url: string, is_blog_update: boolean);
    init(event: SubmitEvent): void;
    collect_tags(): void;
}
export declare function allow_tab_indentation(): void;
export {};
//# sourceMappingURL=Blog_Creation.d.ts.map