// Puzzle Database - 100+ riddles organized by difficulty
const PUZZLE_DATABASE = {
    easy: [
        {
            riddle: "I am yellow and bright, I shine in the day, without me plants cannot grow and play.",
            answer: "sun",
            similarAnswers: ["sunshine", "sunlight", "light"]
        },
        {
            riddle: "I fall from the sky when clouds are gray, I help flowers bloom and wash dirt away.",
            answer: "rain",
            similarAnswers: ["water", "raindrops", "precipitation"]
        },
        {
            riddle: "I have hands but cannot clap, I have a face but cannot nap.",
            answer: "clock",
            similarAnswers: ["watch", "timepiece", "timer"]
        },
        {
            riddle: "I am red and round, I grow on a tree, teachers love when you give me for free.",
            answer: "apple",
            similarAnswers: ["fruit", "red fruit"]
        },
        {
            riddle: "I have four legs but cannot walk, I hold your food but cannot talk.",
            answer: "table",
            similarAnswers: ["desk", "furniture"]
        },
        {
            riddle: "I am white and cold, I fall in winter, children catch me on their tongue with a glimmer.",
            answer: "snow",
            similarAnswers: ["snowflake", "ice"]
        },
        {
            riddle: "I have keys but no locks, I have space but no room, you can enter but not go inside.",
            answer: "keyboard",
            similarAnswers: ["computer keyboard", "keys"]
        },
        {
            riddle: "I am tall when young and short when old, I give light when it's dark and cold.",
            answer: "candle",
            similarAnswers: ["flame", "wax candle"]
        },
        {
            riddle: "I have a neck but no head, I wear a cap but have no bed.",
            answer: "bottle",
            similarAnswers: ["container", "jar"]
        },
        {
            riddle: "I fly without wings, I cry without eyes, wherever I go darkness flies.",
            answer: "cloud",
            similarAnswers: ["clouds", "storm cloud"]
        },
        {
            riddle: "I have teeth but cannot bite, I help you look neat and bright.",
            answer: "comb",
            similarAnswers: ["brush", "hair comb"]
        },
        {
            riddle: "I am round like a ball, I bounce up and down, children play with me all around town.",
            answer: "ball",
            similarAnswers: ["toy ball", "rubber ball"]
        },
        {
            riddle: "I have wings but am not a bird, I am colorful and fly without a word.",
            answer: "butterfly",
            similarAnswers: ["moth", "insect"]
        },
        {
            riddle: "I am black and white, I give you news, I am read by many but worn by few.",
            answer: "newspaper",
            similarAnswers: ["news", "paper"]
        },
        {
            riddle: "I have a tail but am not an animal, I help you point but am not a finger.",
            answer: "mouse",
            similarAnswers: ["computer mouse", "cursor"]
        },
        {
            riddle: "I am sweet and brown, I melt in your mouth, I make people happy from north to south.",
            answer: "chocolate",
            similarAnswers: ["candy", "cocoa"]
        },
        {
            riddle: "I have pages but am not a person, I tell stories but make no sound.",
            answer: "book",
            similarAnswers: ["novel", "story"]
        },
        {
            riddle: "I am green and hop, I live near water, I catch flies with my tongue like I oughta.",
            answer: "frog",
            similarAnswers: ["toad", "amphibian"]
        },
        {
            riddle: "I am orange and long, rabbits love to eat me, I help you see better, that's the key.",
            answer: "carrot",
            similarAnswers: ["vegetable", "root vegetable"]
        },
        {
            riddle: "I have stripes black and white, I look like a horse but that's not quite right.",
            answer: "zebra",
            similarAnswers: ["striped horse", "african animal"]
        }
    ],
    medium: [
        {
            riddle: "I speak without a mouth and hear without ears, I have no body but come alive with fears.",
            answer: "echo",
            similarAnswers: ["sound", "reflection", "reverberation"]
        },
        {
            riddle: "The more you take away from me, the bigger I become. What am I?",
            answer: "hole",
            similarAnswers: ["pit", "cavity", "gap"]
        },
        {
            riddle: "I have cities but no houses, forests but no trees, water but no fish. What am I?",
            answer: "map",
            similarAnswers: ["atlas", "chart", "globe"]
        },
        {
            riddle: "I am not alive but I grow, I don't have lungs but I need air, I don't have a mouth but water kills me.",
            answer: "fire",
            similarAnswers: ["flame", "blaze", "inferno"]
        },
        {
            riddle: "I have a golden head and a golden tail, but no golden body. What am I?",
            answer: "coin",
            similarAnswers: ["penny", "money", "currency"]
        },
        {
            riddle: "I am always hungry and will die if not fed, but whatever I touch will soon turn red.",
            answer: "fire",
            similarAnswers: ["flame", "blaze", "ember"]
        },
        {
            riddle: "I have no beginning, middle, or end, and yet I am everywhere you've been.",
            answer: "circle",
            similarAnswers: ["ring", "loop", "round"]
        },
        {
            riddle: "I am lighter than air but a hundred people cannot lift me. What am I?",
            answer: "bubble",
            similarAnswers: ["soap bubble", "air bubble"]
        },
        {
            riddle: "I can be cracked, made, told, and played. What am I?",
            answer: "joke",
            similarAnswers: ["riddle", "pun", "humor"]
        },
        {
            riddle: "I have a heart that doesn't beat, a mouth that doesn't speak, and a bed that doesn't sleep.",
            answer: "river",
            similarAnswers: ["stream", "creek", "waterway"]
        },
        {
            riddle: "I am taken from a mine and shut in a wooden case, from which I am never released, yet I am used by almost everyone.",
            answer: "pencil lead",
            similarAnswers: ["graphite", "pencil", "lead"]
        },
        {
            riddle: "I have branches but no fruit, trunk but no bark, leaves but no roots.",
            answer: "library",
            similarAnswers: ["family tree", "tree diagram"]
        },
        {
            riddle: "I am always coming but never arrive, always present but never here, always future but never now.",
            answer: "tomorrow",
            similarAnswers: ["future", "next day"]
        },
        {
            riddle: "I can travel around the world while staying in a corner. What am I?",
            answer: "stamp",
            similarAnswers: ["postage stamp", "mail stamp"]
        },
        {
            riddle: "I have keys that open no locks, I have space but no room, you can enter but not go inside.",
            answer: "keyboard",
            similarAnswers: ["piano", "computer keyboard"]
        },
        {
            riddle: "I am full of holes but still hold water. What am I?",
            answer: "sponge",
            similarAnswers: ["sea sponge", "kitchen sponge"]
        },
        {
            riddle: "I get wetter the more I dry. What am I?",
            answer: "towel",
            similarAnswers: ["cloth", "rag"]
        },
        {
            riddle: "I have one eye but cannot see, I'm stronger than men but lighter than a feather.",
            answer: "hurricane",
            similarAnswers: ["storm", "cyclone", "typhoon"]
        },
        {
            riddle: "I am born in battle, I am made in war, I am won in victory, I am lost in defeat.",
            answer: "honor",
            similarAnswers: ["glory", "reputation", "pride"]
        },
        {
            riddle: "I have no body, arms, or legs, but I can open doors and climb up walls.",
            answer: "wind",
            similarAnswers: ["breeze", "air", "gust"]
        }
    ],
    hard: [
        {
            riddle: "I am the beginning of eternity, the end of time and space, the beginning of every end, and the end of every place.",
            answer: "e",
            similarAnswers: ["letter e", "the letter e"]
        },
        {
            riddle: "What has roots that nobody sees, is taller than trees, up, up it goes, yet never grows?",
            answer: "mountain",
            similarAnswers: ["peak", "hill", "summit"]
        },
        {
            riddle: "I am not a season, yet I fall. I am not a tree, yet I have leaves. I am not alive, yet I grow. What am I?",
            answer: "book",
            similarAnswers: ["novel", "manuscript", "tome"]
        },
        {
            riddle: "I have no voice yet I speak to you, I tell of all things in the world that people do.",
            answer: "book",
            similarAnswers: ["newspaper", "story", "text"]
        },
        {
            riddle: "I am something people love or hate. I change people's appearances and thoughts. If a person takes care of themselves, I will go up even higher.",
            answer: "age",
            similarAnswers: ["time", "years", "aging"]
        },
        {
            riddle: "I am the black child of a white father, a wingless bird, flying even to the clouds of heaven.",
            answer: "smoke",
            similarAnswers: ["ash", "vapor", "fume"]
        },
        {
            riddle: "I have a cape but am not a superhero, I sleep all day but am not lazy, I hang upside down but am not a bat.",
            answer: "vampire",
            similarAnswers: ["dracula", "bloodsucker"]
        },
        {
            riddle: "I am always old and sometimes new, never sad, sometimes blue, never empty but sometimes full, never pushes, always pulls.",
            answer: "moon",
            similarAnswers: ["lunar", "satellite"]
        },
        {
            riddle: "I have a crown but am not a king, I have scales but am not a fish, I breathe fire but am not a stove.",
            answer: "dragon",
            similarAnswers: ["mythical beast", "serpent"]
        },
        {
            riddle: "I am the ruler of shovels, I have a double, I am as thin as a knife, I have a wife.",
            answer: "king of spades",
            similarAnswers: ["spade", "playing card"]
        },
        {
            riddle: "I am a word of letters three, add two and fewer there will be.",
            answer: "few",
            similarAnswers: ["less", "little"]
        },
        {
            riddle: "I am something that is always behind you but can never be seen or touched.",
            answer: "past",
            similarAnswers: ["history", "yesterday", "memory"]
        },
        {
            riddle: "I am the enemy of flight, the anchor of ships, the burden of age, yet without me, nothing has weight.",
            answer: "gravity",
            similarAnswers: ["weight", "force", "pull"]
        },
        {
            riddle: "I am born of water but die in water, I am precious when rare but worthless when common.",
            answer: "salt",
            similarAnswers: ["crystal", "mineral"]
        },
        {
            riddle: "I am the silence between notes, the pause between words, the space between thoughts.",
            answer: "rest",
            similarAnswers: ["pause", "break", "silence"]
        },
        {
            riddle: "I am the shadow of your thoughts, the echo of your dreams, the reflection of your soul.",
            answer: "conscience",
            similarAnswers: ["mind", "spirit", "consciousness"]
        },
        {
            riddle: "I am the key that opens no door, the light that casts no shadow, the sound that makes no noise.",
            answer: "knowledge",
            similarAnswers: ["wisdom", "understanding", "truth"]
        },
        {
            riddle: "I am the bridge between what is and what could be, the path from here to there, the link between now and then.",
            answer: "possibility",
            similarAnswers: ["potential", "chance", "opportunity"]
        },
        {
            riddle: "I am the question that answers itself, the problem that solves itself, the mystery that reveals itself.",
            answer: "paradox",
            similarAnswers: ["contradiction", "enigma", "puzzle"]
        },
        {
            riddle: "I am the first and last, the alpha and omega, the beginning that has no start, the end that has no finish.",
            answer: "infinity",
            similarAnswers: ["eternity", "forever", "endless"]
        }
    ],
    expert: [
        {
            riddle: "I am the whisper in the wind that speaks of ancient secrets, the shadow in the moonlight that dances with forgotten dreams.",
            answer: "mystery",
            similarAnswers: ["secret", "enigma", "unknown"]
        },
        {
            riddle: "I am the thread that weaves through time, connecting moments that never were to possibilities that might yet be.",
            answer: "fate",
            similarAnswers: ["destiny", "fortune", "chance"]
        },
        {
            riddle: "I am the mirror that shows not your face but your soul, not your form but your essence, not your body but your truth.",
            answer: "reflection",
            similarAnswers: ["contemplation", "introspection", "meditation"]
        },
        {
            riddle: "I am the door that opens inward to worlds unseen, the key that unlocks chambers of the mind, the passage to realms beyond.",
            answer: "imagination",
            similarAnswers: ["creativity", "fantasy", "vision"]
        },
        {
            riddle: "I am the song that has no melody, the dance that has no steps, the poem that has no words, yet I move all hearts.",
            answer: "emotion",
            similarAnswers: ["feeling", "sentiment", "passion"]
        },
        {
            riddle: "I am the treasure that grows when shared, the wealth that multiplies when given, the riches that increase when spent.",
            answer: "love",
            similarAnswers: ["affection", "compassion", "kindness"]
        },
        {
            riddle: "I am the lighthouse in the storm of confusion, the compass in the wilderness of doubt, the star in the darkness of despair.",
            answer: "hope",
            similarAnswers: ["faith", "optimism", "belief"]
        },
        {
            riddle: "I am the phoenix that rises from ashes of failure, the dawn that follows the darkest night, the spring that comes after winter.",
            answer: "renewal",
            similarAnswers: ["rebirth", "resurrection", "revival"]
        },
        {
            riddle: "I am the sculptor of character, the architect of wisdom, the teacher that never speaks but always instructs.",
            answer: "experience",
            similarAnswers: ["life", "time", "hardship"]
        },
        {
            riddle: "I am the guardian of memories, the keeper of moments, the vault where yesterday meets tomorrow in eternal embrace.",
            answer: "mind",
            similarAnswers: ["consciousness", "memory", "thought"]
        },
        {
            riddle: "I am the currency of the soul, the language of the heart, the alphabet of the spirit that spells out truth.",
            answer: "wisdom",
            similarAnswers: ["knowledge", "understanding", "insight"]
        },
        {
            riddle: "I am the artist who paints with time, the musician who composes with moments, the poet who writes with heartbeats.",
            answer: "life",
            similarAnswers: ["existence", "being", "living"]
        },
        {
            riddle: "I am the riddle within the riddle, the question behind the question, the answer that leads to more questions.",
            answer: "truth",
            similarAnswers: ["reality", "fact", "authenticity"]
        },
        {
            riddle: "I am the silence that speaks volumes, the emptiness that contains everything, the nothing that is something.",
            answer: "void",
            similarAnswers: ["nothingness", "emptiness", "space"]
        },
        {
            riddle: "I am the paradox of being, the contradiction of existence, the impossibility that is possible.",
            answer: "consciousness",
            similarAnswers: ["awareness", "being", "existence"]
        },
        {
            riddle: "I am the eternal now, the infinite here, the timeless moment where all possibilities converge.",
            answer: "present",
            similarAnswers: ["now", "moment", "instant"]
        },
        {
            riddle: "I am the dream that dreams itself, the thought that thinks itself, the story that tells itself.",
            answer: "reality",
            similarAnswers: ["existence", "universe", "cosmos"]
        },
        {
            riddle: "I am the question that has no answer, the answer that has no question, the silence between words that speaks loudest.",
            answer: "zen",
            similarAnswers: ["enlightenment", "understanding", "peace"]
        },
        {
            riddle: "I am the first breath and the last sigh, the opening note and the final chord, the alpha point and the omega destination.",
            answer: "journey",
            similarAnswers: ["path", "voyage", "adventure"]
        },
        {
            riddle: "I am the unity in diversity, the harmony in chaos, the order in randomness, the pattern in the patternless.",
            answer: "universe",
            similarAnswers: ["cosmos", "existence", "everything"]
        }
    ]
};

// Difficulty progression system
class PuzzleManager {
    constructor() {
        this.currentDifficulty = 'easy';
        this.solvedCount = 0;
        this.usedPuzzles = new Set();
    }
    
    getDifficultyThresholds() {
        return {
            easy: { min: 0, max: 5 },
            medium: { min: 6, max: 15 },
            hard: { min: 16, max: 30 },
            expert: { min: 31, max: Infinity }
        };
    }
    
    updateDifficulty() {
        const thresholds = this.getDifficultyThresholds();
        
        if (this.solvedCount >= thresholds.expert.min) {
            this.currentDifficulty = 'expert';
        } else if (this.solvedCount >= thresholds.hard.min) {
            this.currentDifficulty = 'hard';
        } else if (this.solvedCount >= thresholds.medium.min) {
            this.currentDifficulty = 'medium';
        } else {
            this.currentDifficulty = 'easy';
        }
    }
    
    getRandomPuzzle() {
        this.updateDifficulty();
        const puzzles = PUZZLE_DATABASE[this.currentDifficulty];
        const availablePuzzles = puzzles.filter((_, index) => 
            !this.usedPuzzles.has(`${this.currentDifficulty}-${index}`)
        );
        
        if (availablePuzzles.length === 0) {
            // Reset used puzzles if all are used
            this.usedPuzzles.clear();
            return puzzles[Math.floor(Math.random() * puzzles.length)];
        }
        
        const selectedPuzzle = availablePuzzles[Math.floor(Math.random() * availablePuzzles.length)];
        const originalIndex = puzzles.indexOf(selectedPuzzle);
        this.usedPuzzles.add(`${this.currentDifficulty}-${originalIndex}`);
        
        return selectedPuzzle;
    }
    
    markSolved() {
        this.solvedCount++;
    }
    
    getDifficultyInfo() {
        const difficultyNames = {
            easy: '🟢 Novice Pirate',
            medium: '🟡 Seasoned Sailor', 
            hard: '🟠 Expert Navigator',
            expert: '🔴 Legendary Captain'
        };
        
        return {
            level: difficultyNames[this.currentDifficulty],
            solved: this.solvedCount,
            difficulty: this.currentDifficulty
        };
    }
    
    reset() {
        this.currentDifficulty = 'easy';
        this.solvedCount = 0;
        this.usedPuzzles.clear();
    }
}