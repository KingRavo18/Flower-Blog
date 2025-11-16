export interface Retrieve_Class_Types{
    init: () => void;
}
export interface Ui_Change_Types extends Retrieve_Class_Types{}

export interface Submit_Class_Types{
    init: (event: SubmitEvent) => void;
}