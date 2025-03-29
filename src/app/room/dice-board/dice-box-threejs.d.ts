declare module "@3d-dice/dice-box-threejs" {
    interface DiceBoxConfig {
        theme_customColorset?: {
            background: string;
            foreground: string;
            texture: "marble" | "wood" | "glitter";
            material: "metal" | "glass" | "plastic" | "wood";
        };
        light_intensity?: number;
        gravity_multiplier?: number;
        baseScale?: number;
        strength?: number;
        sounds?: boolean;
        assetPath?: string;
        framerate?: number;
        volume?: number;
        color_spotlight?: number;
        shadows?: boolean;
        theme_surface?: string;
        sound_dieMaterial?: string;
        theme_colorset?: string;
        theme_texture?: string;
        theme_material?: string;
        iterationLimit?: number;
        onRerollComplete?: () => void;
        onAddDiceComplete?: () => void;
        onRemoveDiceComplete?: () => void;
        enableDiceSelection?: boolean;
        onDiceHover?: () => void;
        onDiceClick?: () => void;
        onRollComplete?: (results: any) => void;
    }

    export default class DiceBox {
        constructor(selector: string, config: DiceBoxConfig);
        initialize(): Promise<void>;
        updateConfig(config: Partial<DiceBoxConfig>): void;
        roll(notation: string): void;

        add(notation: string): void;

        reroll(diceIds: string[]): void;

        remove(diceIds: string[]): void;
    }
}
