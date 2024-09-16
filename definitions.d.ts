// Definindo o tipo de opções como um array constante
export const options = ["javascript", "command","keypress","write-text"] as const;

// Definindo o tipo ActionType que é uma união dos valores em options
export type ActionType = typeof options[number];

// Definindo a interface Action com os tipos apropriados
export interface Action {
    label: string;
    type: ActionType;
    value: string;
}

export interface ConfigFile {
    gridTemplate: [x: number, y: number]
    actions: (Action | null)[]
}