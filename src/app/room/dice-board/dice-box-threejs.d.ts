declare module "@3d-dice/dice-box-threejs" {
    interface DiceBoxConfig {
        theme_customColorset: {
            background: string;
            foreground: string;
            texture: "marble" | "wood" | "glitter";
            material: "metal" | "glass" | "plastic" | "wood";
        };
        light_intensity: number;
        gravity_multiplier: number;
        baseScale: number;
        strength: number;
        onRollComplete: (results: any) => void;
    }

    export default class DiceBox {
        constructor(selector: string, config: DiceBoxConfig);
        initialize(): Promise<void>;
        updateConfig(config: Partial<DiceBoxConfig>): void;
        roll(notation: string): void;
    }
}
