import { Exercise } from "@/app/types/run-types";

// Dados base
const baseExercises: Exercise[] = [
    {
        id: 1,
        name: "Flexão",
        description: "Descrição tarefa 1",
        duration: 20, // 23
        repetitions: 1,
    },
    {
        id: 2,
        name: "Polichinelo",
        description: "Descrição tarefa 2",
        duration: 4,
        repetitions: 1,
    },
    {
        id: 3,
        name: "Corrida estacionária",
        description: "Descrição tarefa 3",
        duration: 7,
        repetitions: 1,
    },
    {
        id: 4,
        name: "Agachamento",
        description: "Descrição tarefa 4",
        duration: 14,
        repetitions: 1,
    },
];

// Função para embaralhar utilizando Fisher-Yates
const shuffleArray = (array: Exercise[]): Exercise[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

// Função auxiliar para calcular dificuldade
const calculateDifficulty = (room: number) => {
    const durationDifficultyMultiplier = room * 4;
    const repetitionsDifficultyMultiplier = room * 2;

    return baseExercises.map((exercise) => ({
        ...exercise,
        duration: exercise.duration + durationDifficultyMultiplier,
        repetitions: exercise.repetitions + repetitionsDifficultyMultiplier,
    }));
};

// Função para garantir o número necessário de exercícios
const ensureExerciseCount = (selectedCount: number, exercises: Exercise[]): Exercise[] => {
    const shuffledExercises = shuffleArray(exercises);
    let selectedExercises = shuffledExercises.slice(0, selectedCount);

    if (selectedExercises.length < selectedCount) {
        const extraExercises: Exercise[] = [];
        const baseShuffled = shuffleArray(exercises); // Embaralhar novamente para evitar padrões
        let nextId = Math.max(...exercises.map((e) => e.id)) + 1;

        while (selectedExercises.length + extraExercises.length < selectedCount) {
            const originalExercise = baseShuffled[extraExercises.length % baseShuffled.length];
            extraExercises.push({ ...originalExercise, id: nextId++ });
        }

        selectedExercises = [...selectedExercises, ...extraExercises];
    }

    return selectedExercises;
};

// Função principal para gerar exercícios
export const generatePageExercises = (
    room: number,
    setCalculatedExercises: React.Dispatch<React.SetStateAction<Exercise[]>>
) => {
    const exercises = calculateDifficulty(room);

    const roomLogic = (room: number) => {
        // Salas de descanso
        if ([3, 6, 10, 13].includes(room)) {
            setCalculatedExercises([]);
            return;
        }

        // Configuração de quantidade de exercícios por sala
        const roomConfig: Record<number, { min: number; max: number }> = {
            1: { min: 1, max: 2 },
            2: { min: 2, max: 4 },
            4: { min: 3, max: 9 },
            5: { min: 4, max: 6 },
            7: { min: 4, max: 8 },
            8: { min: 5, max: 10 },
            9: { min: 7, max: 11 },
            11: { min: 7, max: 13 },
            12: { min: 8, max: 15 },
            14: { min: 15, max: 20 },
        };

        // Determinar quantidade de exercícios para a sala
        const { min, max } = roomConfig[room] || { min: 1, max: 1 };
        const selectedCount = Math.floor(Math.random() * (max - min + 1)) + min;

        // Garantir exercícios calculados
        setCalculatedExercises(ensureExerciseCount(selectedCount, exercises));
    };

    roomLogic(room);
};
