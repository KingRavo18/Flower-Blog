export declare class Blog_Creation {
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
//# sourceMappingURL=Blog_Creation.d.ts.map