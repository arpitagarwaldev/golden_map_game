class PirateGame {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.puzzleManager = new PuzzleManager();
        this.gameState = {
            gold: 0,
            curse: 0,
            crew: 1,
            currentIsland: 0,
            inventory: [],
            mapPieces: [],
            exploredAreas: new Set()
        };
        
        this.leaderboard = this.loadLeaderboard();
        this.generateIslands();
        
        this.crewMembers = [
            { name: "Captain Redbeard", skill: "Leadership", recruited: true },
            { name: "Navigator Luna", skill: "Map Reading", recruited: false, cost: 200 },
            { name: "Gunner Jack", skill: "Combat", recruited: false, cost: 150 },
            { name: "Cook Martha", skill: "Morale", recruited: false, cost: 100 },
            { name: "Ghost Whisperer Sage", skill: "Curse Protection", recruited: false, cost: 500 }
        ];
        
        this.playerPos = { x: 400, y: 300 };
        this.init();
    }
    
    generateIslands() {
        this.islands = [];
        const islandNames = [
            { name: "Skull Cove", desc: "A mysterious cove where ancient pirates once hid their treasures..." },
            { name: "Siren's Rest", desc: "An enchanted island where mermaids once sang sailors to their doom..." },
            { name: "Devil's Triangle", desc: "A cursed island shrouded in perpetual mist and dark magic..." },
            { name: "Kraken's Lair", desc: "Deep waters where the legendary sea monster guards ancient gold..." },
            { name: "Phantom Isle", desc: "A ghostly island that appears only to the most cursed pirates..." }
        ];
        
        for (let i = 0; i < islandNames.length; i++) {
            const island = {
                name: islandNames[i].name,
                description: islandNames[i].desc,
                treasures: this.generateTreasures(3 + i),
                mapPiece: { found: false, riddle: `Ancient secret of ${islandNames[i].name}` }
            };
            this.islands.push(island);
        }
    }
    
    generateTreasures(count) {
        const treasures = [];
        for (let i = 0; i < count; i++) {
            const puzzle = this.puzzleManager.getRandomPuzzle();
            const treasure = {
                x: 150 + Math.random() * 500,
                y: 150 + Math.random() * 300,
                found: false,
                value: 50 + (i * 25) + Math.floor(Math.random() * 100),
                originalValue: 0,
                curse: 5 + (i * 3),
                riddle: puzzle.riddle,
                answer: puzzle.answer,
                similarAnswers: puzzle.similarAnswers,
                solved: false,
                hintsUsed: 0,
                quit: false
            };
            treasure.originalValue = treasure.value;
            treasures.push(treasure);
        }
        return treasures;
    }
    
    init() {
        this.setupEventListeners();
        this.updateUI();
        this.updateRiddlesPanel();
        this.drawIsland();
        this.showWelcomeMessage();
    }
    
    setupEventListeners() {
        document.getElementById('explore-btn').addEventListener('click', () => this.explore());
        document.getElementById('dig-btn').addEventListener('click', () => this.dig());
        document.getElementById('sail-btn').addEventListener('click', () => this.sail());
        document.getElementById('crew-btn').addEventListener('click', () => this.showCrewModal());
        document.getElementById('leaderboard-btn').addEventListener('click', () => this.showLeaderboardModal());
        document.getElementById('modal-close').addEventListener('click', () => this.closeModal());
        
        // Canvas click for movement
        this.canvas.addEventListener('click', (e) => this.movePlayer(e));
        
        // Touch support for mobile
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            this.movePlayer({ offsetX: x, offsetY: y });
        });
    }
    
    movePlayer(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        this.playerPos.x = (e.offsetX || e.clientX - rect.left) * scaleX;
        this.playerPos.y = (e.offsetY || e.clientY - rect.top) * scaleY;
        
        this.drawIsland();
    }
    
    drawIsland() {
        const ctx = this.ctx;
        const island = this.islands[this.gameState.currentIsland];
        
        // Clear canvas
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw ocean background
        const gradient = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#4682B4');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw island
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.ellipse(400, 300, 350, 250, 0, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw sand
        ctx.fillStyle = '#F4A460';
        ctx.beginPath();
        ctx.ellipse(400, 300, 320, 220, 0, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw palm trees
        this.drawPalmTree(150, 200);
        this.drawPalmTree(650, 180);
        this.drawPalmTree(300, 450);
        this.drawPalmTree(550, 420);
        
        // Draw treasures
        island.treasures.forEach(treasure => {
            if (!treasure.found) {
                ctx.fillStyle = '#FFD700';
                ctx.beginPath();
                ctx.arc(treasure.x, treasure.y, 15, 0, 2 * Math.PI);
                ctx.fill();
                ctx.fillStyle = '#8B4513';
                ctx.beginPath();
                ctx.arc(treasure.x, treasure.y, 10, 0, 2 * Math.PI);
                ctx.fill();
                
                // Add sparkle effect
                ctx.fillStyle = '#FFFF00';
                ctx.fillRect(treasure.x - 2, treasure.y - 8, 4, 4);
                ctx.fillRect(treasure.x + 6, treasure.y - 2, 4, 4);
                ctx.fillRect(treasure.x - 8, treasure.y + 4, 4, 4);
            }
        });
        
        // Draw player
        ctx.fillStyle = '#8B0000';
        ctx.beginPath();
        ctx.arc(this.playerPos.x, this.playerPos.y, 12, 0, 2 * Math.PI);
        ctx.fill();
        
        // Player hat
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(this.playerPos.x, this.playerPos.y - 8, 8, 0, Math.PI, true);
        ctx.fill();
        
        // Skull and crossbones on hat
        ctx.fillStyle = '#FFF';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('☠️', this.playerPos.x, this.playerPos.y - 5);
        
        // Draw exploration radius
        if (this.gameState.exploredAreas.size > 0) {
            ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.arc(this.playerPos.x, this.playerPos.y, 50, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    }
    
    drawPalmTree(x, y) {
        const ctx = this.ctx;
        
        // Trunk
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x - 5, y, 10, 40);
        
        // Leaves
        ctx.fillStyle = '#228B22';
        ctx.beginPath();
        ctx.ellipse(x, y - 10, 25, 15, -0.5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(x, y - 10, 25, 15, 0.5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(x, y - 10, 15, 25, 0, 0, 2 * Math.PI);
        ctx.fill();
    }
    
    explore() {
        const island = this.islands[this.gameState.currentIsland];
        const areaKey = `${Math.floor(this.playerPos.x / 50)}-${Math.floor(this.playerPos.y / 50)}`;
        
        if (!this.gameState.exploredAreas.has(areaKey)) {
            this.gameState.exploredAreas.add(areaKey);
            
            const discoveries = [
                "🦀 You found some ancient crab shells...",
                "🌊 The waves whisper old pirate tales...",
                "🗿 Strange markings on weathered stones...",
                "🐚 Beautiful seashells line the shore...",
                "🌴 Coconuts fall from the palm trees...",
                "⚓ Rusty anchor buried in the sand...",
                "📜 Torn piece of an old ship's log..."
            ];
            
            const discovery = discoveries[Math.floor(Math.random() * discoveries.length)];
            this.showMessage("Exploration", discovery);
            
            // Chance to find items
            if (Math.random() < 0.3) {
                const items = ["🗝️ Rusty Key", "🧭 Broken Compass", "💎 Small Gem", "🍾 Message in Bottle"];
                const item = items[Math.floor(Math.random() * items.length)];
                this.gameState.inventory.push(item);
                this.showMessage("Item Found!", `You discovered: ${item}`);
            }
            
            this.updateUI();
            this.drawIsland();
        } else {
            this.showMessage("Already Explored", "You've already searched this area thoroughly.");
        }
    }
    
    dig() {
        const island = this.islands[this.gameState.currentIsland];
        let foundTreasure = false;
        
        island.treasures.forEach(treasure => {
            const distance = Math.sqrt(
                Math.pow(this.playerPos.x - treasure.x, 2) + 
                Math.pow(this.playerPos.y - treasure.y, 2)
            );
            
            if (distance < 30 && !treasure.found) {
                if (!treasure.solved) {
                    this.showMessage("Riddle Required! 🧩", 
                        "The treasure is protected by an ancient riddle. Check the riddles panel on the left to solve it first!");
                    return;
                }
                
                treasure.found = true;
                foundTreasure = true;
                
                if (treasure.quit) {
                    this.gameState.curse += Math.floor(treasure.curse / 2);
                    this.showMessage("Empty Treasure! 🚫", 
                        `You found the treasure location, but the spirits took the gold as punishment for giving up! (+${Math.floor(treasure.curse / 2)}% curse)`);
                } else {
                    this.gameState.gold += treasure.value;
                    this.gameState.curse += treasure.curse;
                    
                    document.getElementById('gold').classList.add('treasure-found');
                    setTimeout(() => {
                        document.getElementById('gold').classList.remove('treasure-found');
                    }, 3000);
                    
                    this.showMessage("Treasure Found! 💰", 
                        `You found ${treasure.value} gold! But the curse grows stronger... (+${treasure.curse}% curse)`);
                }
                
                const mapChance = treasure.quit ? 0.2 : 0.5;
                if (!island.mapPiece.found && Math.random() < mapChance) {
                    island.mapPiece.found = true;
                    this.gameState.mapPieces.push({
                        island: island.name,
                        riddle: island.mapPiece.riddle
                    });
                    this.showMessage("Map Piece Found! 🗺️", 
                        `You discovered a piece of the legendary map! Riddle: "${island.mapPiece.riddle}"`);
                }
            }
        });
        
        if (!foundTreasure) {
            const messages = [
                "Nothing but sand and shells...",
                "Your shovel hits solid rock.",
                "Just some old bones... probably a fish.",
                "The sand shifts, but no treasure here.",
                "You hear the echo of ancient laughter..."
            ];
            this.showMessage("No Treasure", messages[Math.floor(Math.random() * messages.length)]);
        }
        
        this.updateUI();
        this.updateRiddlesPanel();
        this.drawIsland();
        this.checkCurseEffects();
    }
    
    sail() {
        if (this.gameState.currentIsland < this.islands.length - 1) {
            this.gameState.currentIsland++;
            this.playerPos = { x: 400, y: 300 };
            this.gameState.exploredAreas.clear();
            
            const island = this.islands[this.gameState.currentIsland];
            island.treasures = this.generateTreasures(3 + this.gameState.currentIsland);
            
            this.showMessage("New Island Discovered! 🏝️", 
                `Welcome to ${island.name}! ${island.description}`);
            
            this.updateUI();
            this.updateRiddlesPanel();
            this.drawIsland();
        } else {
            if (this.gameState.mapPieces.length >= 3) {
                this.showFinalTreasureModal();
            } else {
                this.showMessage("Need More Map Pieces", 
                    `You need at least 3 map pieces to locate the Heart of Gold. You have ${this.gameState.mapPieces.length}.`);
            }
        }
    }
    
    showCrewModal() {
        const modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = `
            <h2>🏴‍☠️ Recruit Crew Members</h2>
            <div style="max-height: 400px; overflow-y: auto;">
                ${this.crewMembers.map(member => `
                    <div style="margin: 1rem 0; padding: 1rem; background: rgba(255,215,0,0.1); border-radius: 8px;">
                        <h4>${member.name} ${member.recruited ? '✅' : ''}</h4>
                        <p><strong>Skill:</strong> ${member.skill}</p>
                        ${!member.recruited ? `
                            <p><strong>Cost:</strong> ${member.cost} gold</p>
                            <button onclick="game.recruitCrew('${member.name}')" 
                                    ${this.gameState.gold < member.cost ? 'disabled' : ''}>
                                Recruit
                            </button>
                        ` : '<p style="color: #90EE90;">Already recruited!</p>'}
                    </div>
                `).join('')}
            </div>
        `;
        this.showModal();
    }
    
    recruitCrew(memberName) {
        const member = this.crewMembers.find(m => m.name === memberName);
        if (member && !member.recruited && this.gameState.gold >= member.cost) {
            member.recruited = true;
            this.gameState.gold -= member.cost;
            this.gameState.crew++;
            
            this.showMessage("Crew Member Recruited! ⚓", 
                `${member.name} has joined your crew! Their ${member.skill} skill will help you on your journey.`);
            
            this.updateUI();
            this.closeModal();
        }
    }
    
    checkCurseEffects() {
        if (this.gameState.curse >= 50) {
            document.getElementById('curse').classList.add('cursed');
            
            if (this.gameState.curse >= 75 && Math.random() < 0.3) {
                this.showMessage("Ghost Attack! 👻", 
                    "Ancient pirate spirits attack! You lose some gold but your crew fights them off!");
                this.gameState.gold = Math.max(0, this.gameState.gold - 50);
                this.updateUI();
            }
        }
    }
    
    showFinalTreasureModal() {
        const modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = `
            <h2>🏆 The Heart of Gold</h2>
            <p>You've collected enough map pieces to locate the legendary Heart of Gold!</p>
            <p><strong>Your Journey:</strong></p>
            <ul>
                <li>Gold Collected: ${this.gameState.gold}</li>
                <li>Curse Level: ${this.gameState.curse}%</li>
                <li>Crew Members: ${this.gameState.crew}</li>
                <li>Map Pieces: ${this.gameState.mapPieces.length}</li>
            </ul>
            <p>The final treasure awaits, but beware - claiming it will test your resolve!</p>
            <button onclick="game.claimFinalTreasure()" style="padding: 1rem 2rem; font-size: 1.2rem; margin-top: 1rem;">
                Claim the Heart of Gold! 💎
            </button>
        `;
        this.showModal();
    }
    
    claimFinalTreasure() {
        const finalGold = 1000;
        const curseReduction = Math.min(50, this.gameState.crew * 10);
        
        this.gameState.gold += finalGold;
        this.gameState.curse = Math.max(0, this.gameState.curse - curseReduction);
        
        const modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = `
            <h2>🎉 Victory!</h2>
            <p>Congratulations, Captain! You've claimed the Heart of Gold!</p>
            <p><strong>Final Stats:</strong></p>
            <ul>
                <li>Total Gold: ${this.gameState.gold}</li>
                <li>Final Curse: ${this.gameState.curse}%</li>
                <li>Loyal Crew: ${this.gameState.crew}</li>
            </ul>
            <p>${this.gameState.curse < 25 ? 
                "Your crew's loyalty helped break the curse! You sail into legend!" : 
                "The curse still lingers, but you've proven yourself a true pirate!"}</p>
            <button onclick="game.resetGame()" style="padding: 1rem 2rem; margin-top: 1rem;">
                Start New Adventure
            </button>
        `;
    }
    
    updateRiddlesPanel() {
        const riddlesList = document.getElementById('riddles-list');
        const island = this.islands[this.gameState.currentIsland];
        const diffInfo = this.puzzleManager.getDifficultyInfo();
        
        riddlesList.innerHTML = `
            <div style="background: rgba(255,215,0,0.1); padding: 1rem; margin-bottom: 1rem; border-radius: 8px; text-align: center;">
                <div style="color: #ffd700; font-weight: bold; margin-bottom: 0.5rem;">${diffInfo.level}</div>
                <div style="color: #ddd; font-size: 0.9rem;">Puzzles Solved: ${diffInfo.solved}</div>
                <div style="color: #ddd; font-size: 0.8rem;">Difficulty: ${diffInfo.difficulty.toUpperCase()}</div>
            </div>
        ` + island.treasures.map((treasure, index) => {
            if (treasure.found) return '';
            
            return `
                <div class="riddle-item ${treasure.solved ? 'solved' : ''}">
                    <div class="riddle-text">"${treasure.riddle}"</div>
                    <div class="riddle-value">💰 Value: ${treasure.value} gold ${treasure.hintsUsed > 0 ? '(reduced)' : ''}</div>
                    <div class="riddle-status">
                        ${treasure.solved ? '✅ Solved - Ready to dig!' : '🔒 Unsolved'}
                    </div>
                    ${!treasure.solved ? `
                        <input type="text" class="riddle-input" id="answer-${index}" placeholder="Enter your answer...">
                        <div class="riddle-buttons">
                            <button class="riddle-btn solve-btn" onclick="game.solveRiddle(${index})">
                                🔍 Solve
                            </button>
                            <button class="riddle-btn hint-btn" onclick="game.getHint(${index})">
                                💡 Hint (-20% value)
                            </button>
                            <button class="riddle-btn choice-btn" onclick="game.showMultipleChoice(${index})">
                                🎲 Multiple Choice (40% Gold)
                            </button>
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
        
        island.treasures.forEach((treasure, index) => {
            if (!treasure.found && !treasure.solved) {
                const input = document.getElementById(`answer-${index}`);
                if (input) {
                    input.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') {
                            this.solveRiddle(index);
                        }
                    });
                }
            }
        });
    }
    
    solveRiddle(treasureIndex) {
        const island = this.islands[this.gameState.currentIsland];
        const treasure = island.treasures[treasureIndex];
        const userAnswer = document.getElementById(`answer-${treasureIndex}`).value.toLowerCase().trim();
        
        const isCorrect = userAnswer === treasure.answer || 
                         userAnswer.includes(treasure.answer) ||
                         treasure.similarAnswers.some(similar => 
                             userAnswer === similar || userAnswer.includes(similar)
                         );
        
        if (isCorrect) {
            treasure.solved = true;
            this.puzzleManager.markSolved();
            const diffInfo = this.puzzleManager.getDifficultyInfo();
            this.showMessage("Riddle Solved! 🧩", 
                `Brilliant! The ancient spirits approve. You may now dig for the treasure worth ${treasure.value} gold!\n\n🎆 You are now: ${diffInfo.level}`);
            this.updateRiddlesPanel();
        } else {
            this.showMessage("Wrong Answer ❌", 
                "The spirits shake their heads. Try again, use a hint, or quit to see the answer!");
        }
    }
    
    showMultipleChoice(treasureIndex) {
        const island = this.islands[this.gameState.currentIsland];
        const treasure = island.treasures[treasureIndex];
        
        // Generate 3 wrong answers + 1 correct answer
        const wrongAnswers = this.generateWrongAnswers(treasure.answer);
        const allChoices = [...wrongAnswers, treasure.answer];
        
        // Shuffle the choices
        for (let i = allChoices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allChoices[i], allChoices[j]] = [allChoices[j], allChoices[i]];
        }
        
        const modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = `
            <h2>🎲 Multiple Choice Challenge</h2>
            <div style="background: rgba(255,215,0,0.1); padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                <p style="font-style: italic; color: #ffd700; font-size: 1.1em;">"${treasure.riddle}"</p>
            </div>
            <p>Choose the correct answer to earn 40% of the treasure's gold:</p>
            <div style="margin: 1.5rem 0;">
                ${allChoices.map((choice, index) => `
                    <button onclick="game.checkMultipleChoice(${treasureIndex}, '${choice}', '${treasure.answer}')" 
                            style="display: block; width: 100%; margin: 0.5rem 0; padding: 1rem; font-size: 1rem; 
                                   background: rgba(139,69,19,0.3); color: #fff; border: 2px solid #ffd700; 
                                   border-radius: 8px; cursor: pointer; text-align: left;"
                            onmouseover="this.style.background='rgba(139,69,19,0.5)'"
                            onmouseout="this.style.background='rgba(139,69,19,0.3)'">
                        ${String.fromCharCode(65 + index)}. ${choice}
                    </button>
                `).join('')}
            </div>
            <button onclick="game.closeModal()" 
                    style="padding: 0.8rem 1.5rem; background: #8B4513; color: white; border: none; border-radius: 5px; cursor: pointer;">
                Cancel
            </button>
        `;
        this.showModal();
    }
    
    generateWrongAnswers(correctAnswer) {
        const wrongAnswerPool = {
            "sun": ["star", "light", "fire"],
            "rain": ["water", "drops", "storm"],
            "clock": ["time", "watch", "timer"],
            "apple": ["fruit", "cherry", "berry"],
            "table": ["desk", "surface", "platform"],
            "snow": ["ice", "frost", "crystal"],
            "keyboard": ["typewriter", "piano", "keys"],
            "candle": ["flame", "light", "torch"],
            "bottle": ["container", "vessel", "flask"],
            "cloud": ["mist", "fog", "vapor"],
            "comb": ["brush", "rake", "teeth"],
            "ball": ["sphere", "globe", "orb"],
            "butterfly": ["moth", "bird", "insect"],
            "newspaper": ["magazine", "journal", "paper"],
            "mouse": ["rat", "cursor", "pointer"],
            "chocolate": ["candy", "sweet", "cocoa"],
            "book": ["novel", "story", "text"],
            "frog": ["toad", "lizard", "amphibian"],
            "carrot": ["vegetable", "root", "orange"],
            "zebra": ["horse", "donkey", "animal"],
            "echo": ["sound", "voice", "reflection"],
            "hole": ["gap", "space", "void"],
            "map": ["chart", "guide", "atlas"],
            "fire": ["flame", "heat", "blaze"],
            "coin": ["money", "token", "disc"],
            "circle": ["ring", "round", "loop"],
            "bubble": ["sphere", "foam", "air"],
            "joke": ["riddle", "humor", "story"],
            "river": ["stream", "water", "flow"],
            "pencil lead": ["graphite", "carbon", "lead"],
            "library": ["bookstore", "archive", "collection"],
            "tomorrow": ["future", "next", "later"],
            "stamp": ["seal", "mark", "label"],
            "sponge": ["foam", "absorber", "pad"],
            "towel": ["cloth", "fabric", "dryer"],
            "hurricane": ["storm", "cyclone", "wind"],
            "honor": ["pride", "respect", "dignity"],
            "wind": ["air", "breeze", "gust"],
            "e": ["letter", "vowel", "character"],
            "mountain": ["hill", "peak", "summit"],
            "book": ["pages", "story", "text"],
            "age": ["time", "years", "life"],
            "smoke": ["vapor", "mist", "gas"],
            "vampire": ["bat", "monster", "creature"],
            "moon": ["satellite", "orb", "sphere"],
            "dragon": ["beast", "monster", "serpent"],
            "king of spades": ["card", "king", "spade"],
            "few": ["little", "some", "less"],
            "past": ["history", "before", "yesterday"],
            "gravity": ["force", "pull", "weight"],
            "salt": ["mineral", "crystal", "seasoning"],
            "rest": ["pause", "break", "stop"],
            "conscience": ["mind", "soul", "spirit"],
            "knowledge": ["wisdom", "learning", "understanding"],
            "possibility": ["chance", "potential", "maybe"],
            "paradox": ["puzzle", "mystery", "contradiction"],
            "infinity": ["forever", "endless", "eternal"],
            "mystery": ["secret", "unknown", "puzzle"],
            "fate": ["destiny", "fortune", "luck"],
            "reflection": ["mirror", "thought", "image"],
            "imagination": ["creativity", "fantasy", "vision"],
            "emotion": ["feeling", "heart", "passion"],
            "love": ["affection", "heart", "care"],
            "hope": ["faith", "belief", "trust"],
            "renewal": ["rebirth", "fresh", "new"],
            "experience": ["life", "knowledge", "learning"],
            "mind": ["brain", "thought", "consciousness"],
            "wisdom": ["knowledge", "understanding", "insight"],
            "life": ["existence", "living", "being"],
            "truth": ["reality", "fact", "honest"],
            "void": ["empty", "nothing", "space"],
            "consciousness": ["awareness", "mind", "thought"],
            "present": ["now", "current", "today"],
            "reality": ["truth", "existence", "actual"],
            "zen": ["peace", "calm", "balance"],
            "journey": ["trip", "path", "voyage"],
            "universe": ["cosmos", "world", "everything"]
        };
        
        const pool = wrongAnswerPool[correctAnswer] || ["choice", "answer", "solution"];
        return pool.slice(0, 3);
    }
    
    checkMultipleChoice(treasureIndex, selectedAnswer, correctAnswer) {
        const island = this.islands[this.gameState.currentIsland];
        const treasure = island.treasures[treasureIndex];
        
        treasure.solved = true;
        
        if (selectedAnswer === correctAnswer) {
            // Correct answer - give 40% of gold
            treasure.value = Math.floor(treasure.originalValue * 0.4);
            treasure.quit = false;
            this.puzzleManager.markSolved();
            const diffInfo = this.puzzleManager.getDifficultyInfo();
            
            this.showMessage("Correct Choice! 🎆", 
                `Well done! You chose the right answer and earned ${treasure.value} gold (40% of original value).\n\n🎆 You are now: ${diffInfo.level}`);
        } else {
            // Wrong answer - no gold
            treasure.value = 0;
            treasure.quit = true;
            
            this.showMessage("Wrong Choice! ❌", 
                `Sorry, the correct answer was "${correctAnswer}". You may find the treasure but get no gold.`);
        }
        
        this.updateRiddlesPanel();
    }
    
    getHint(treasureIndex) {
        const island = this.islands[this.gameState.currentIsland];
        const treasure = island.treasures[treasureIndex];
        
        if (treasure.hintsUsed >= 2) {
            this.showMessage("No More Hints! 🚫", 
                "The spirits have given you all the help they can. You must solve this yourself!");
            return;
        }
        
        treasure.hintsUsed++;
        treasure.value = Math.floor(treasure.value * 0.8); // Reduce by 20%
        
        const hints = {
            "palm tree": [
                "🌴 Look for something tall and green that sways...",
                "🌴 It bears coconuts and provides shade on tropical islands..."
            ],
            "center": [
                "🎯 Think about the middle, the heart of something...",
                "🎯 Where all paths converge, the focal point..."
            ],
            "shore": [
                "🌊 Where two elements meet and dance together...",
                "🌊 The boundary between land and sea..."
            ],
            "high": [
                "⬆️ Think elevation, think above ground level...",
                "⬆️ Where birds fly and mountains reach..."
            ],
            "darkness": [
                "🌑 The absence of light, where shadows rule...",
                "🌑 What comes when the sun sets and light fades..."
            ],
            "corner": [
                "📐 Think edges, think where lines meet...",
                "📐 The point where two sides come together..."
            ]
        };
        
        const hintText = hints[treasure.answer][treasure.hintsUsed - 1];
        this.showMessage(`Hint ${treasure.hintsUsed}/2 💡`, 
            `${hintText}\n\n⚠️ Treasure value reduced to ${treasure.value} gold!`);
        
        this.updateRiddlesPanel();
    }
    
    loadLeaderboard() {
        const saved = localStorage.getItem('pirateGameLeaderboard');
        return saved ? JSON.parse(saved) : [];
    }
    
    saveLeaderboard() {
        localStorage.setItem('pirateGameLeaderboard', JSON.stringify(this.leaderboard));
    }
    
    calculateScore() {
        const diffInfo = this.puzzleManager.getDifficultyInfo();
        const baseScore = this.gameState.gold;
        const puzzleBonus = diffInfo.solved * 10;
        const crewBonus = this.gameState.crew * 50;
        const mapBonus = this.gameState.mapPieces.length * 100;
        const cursePenalty = Math.floor(this.gameState.curse * 2);
        
        return Math.max(0, baseScore + puzzleBonus + crewBonus + mapBonus - cursePenalty);
    }
    
    saveScore() {
        const score = this.calculateScore();
        const diffInfo = this.puzzleManager.getDifficultyInfo();
        
        const modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = `
            <h2>💾 Save Your Score</h2>
            <p><strong>Current Score:</strong> ${score}</p>
            <p><strong>Rank:</strong> ${diffInfo.level}</p>
            <p><strong>Puzzles Solved:</strong> ${diffInfo.solved}</p>
            <div style="margin: 1rem 0;">
                <input type="text" id="player-name" placeholder="Enter your pirate name..." 
                       style="padding: 0.8rem; width: 100%; border-radius: 5px; border: 2px solid #ffd700; background: rgba(0,0,0,0.7); color: #fff; font-size: 1rem;" maxlength="20">
            </div>
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button onclick="game.confirmSaveScore()" 
                        style="padding: 0.8rem 1.5rem; background: #228B22; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    🏆 Save Score
                </button>
                <button onclick="game.closeModal()" 
                        style="padding: 0.8rem 1.5rem; background: #8B4513; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Cancel
                </button>
            </div>
        `;
        this.showModal();
        
        setTimeout(() => {
            document.getElementById('player-name').focus();
        }, 100);
    }
    
    confirmSaveScore() {
        const playerName = document.getElementById('player-name').value.trim();
        if (!playerName) {
            alert('Please enter your pirate name!');
            return;
        }
        
        const score = this.calculateScore();
        const diffInfo = this.puzzleManager.getDifficultyInfo();
        
        const entry = {
            name: playerName,
            score: score,
            rank: diffInfo.level,
            puzzlesSolved: diffInfo.solved,
            date: new Date().toLocaleDateString()
        };
        
        this.leaderboard.push(entry);
        this.leaderboard.sort((a, b) => b.score - a.score);
        this.leaderboard = this.leaderboard.slice(0, 10); // Keep top 10
        
        this.saveLeaderboard();
        
        this.showMessage('Score Saved! 🏆', 
            `Congratulations, ${playerName}! Your score of ${score} has been added to the leaderboard.`);
    }
    
    showLeaderboardModal() {
        const modalBody = document.getElementById('modal-body');
        const leaderboardContent = this.leaderboard.length === 0 ? 
            '<div style="text-align: center; color: #888; font-style: italic; padding: 2rem;">No scores yet - be the first!</div>' :
            this.leaderboard.map((entry, index) => {
                const rankEmoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
                return `
                    <div class="leaderboard-entry">
                        <span class="leaderboard-rank">${rankEmoji}</span>
                        <span class="leaderboard-name" title="${entry.name} - ${entry.date}">${entry.name}</span>
                        <span class="leaderboard-score">${entry.score}</span>
                    </div>
                `;
            }).join('');
        
        modalBody.innerHTML = `
            <h2>🏆 Leaderboard</h2>
            <div style="max-height: 400px; overflow-y: auto; margin: 1rem 0;">
                ${leaderboardContent}
            </div>
            <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 1.5rem;">
                <button onclick="game.saveScore()" 
                        style="padding: 0.8rem 1.5rem; background: #228B22; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    💾 Save Current Score
                </button>
                <button onclick="game.closeModal()" 
                        style="padding: 0.8rem 1.5rem; background: #8B4513; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Close
                </button>
            </div>
        `;
        this.showModal();
    }
    
    resetGame() {
        this.gameState = {
            gold: 0,
            curse: 0,
            crew: 1,
            currentIsland: 0,
            inventory: [],
            mapPieces: [],
            exploredAreas: new Set()
        };
        
        this.puzzleManager.reset();
        this.generateIslands();
        
        this.crewMembers.forEach(member => {
            member.recruited = member.name === "Captain Redbeard";
        });
        
        this.playerPos = { x: 400, y: 300 };
        this.closeModal();
        this.updateUI();
        this.updateRiddlesPanel();
        this.drawIsland();
        this.showWelcomeMessage();
    }
    
    showWelcomeMessage() {
        const modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = `
            <h2>🏴‍☠️ Welcome, Captain!</h2>
            <div style="max-height: 400px; overflow-y: auto; text-align: left;">
                <h3>🎯 Your Mission</h3>
                <p>Solve 100+ ancient riddles, collect treasures, and find the legendary Heart of Gold!</p>
                
                <h3>🎮 Basic Controls</h3>
                <ul>
                    <li><strong>Move:</strong> Click/tap anywhere on the island</li>
                    <li><strong>Explore:</strong> 🗺️ Search areas for items and clues</li>
                    <li><strong>Dig:</strong> ⛏️ Collect treasures (after solving riddles)</li>
                    <li><strong>Sail:</strong> ⛵ Travel between islands</li>
                    <li><strong>Crew:</strong> 👥 Recruit helpful crew members</li>
                </ul>
                
                <h3>🧩 Riddle System (Left Panel)</h3>
                <ol>
                    <li><strong>Read:</strong> Each treasure has a protective riddle</li>
                    <li><strong>Answer:</strong> Type in the input field (accepts similar words)</li>
                    <li><strong>Solve:</strong> 🔍 Submit or press Enter</li>
                    <li><strong>Hint:</strong> 💡 Get clues (-20% treasure value)</li>
                    <li><strong>Quit:</strong> 🏳️ See answer (but get no gold)</li>
                </ol>
                
                <h3>🎆 Difficulty Progression</h3>
                <ul>
                    <li>🟢 <strong>Novice Pirate</strong> (0-5 solved): Easy riddles</li>
                    <li>🟡 <strong>Seasoned Sailor</strong> (6-15 solved): Medium puzzles</li>
                    <li>🟠 <strong>Expert Navigator</strong> (16-30 solved): Hard challenges</li>
                    <li>🔴 <strong>Legendary Captain</strong> (31+ solved): Expert riddles</li>
                </ul>
                
                <h3>⚙️ Game Mechanics</h3>
                <ul>
                    <li><strong>Gold:</strong> Earn by solving riddles and digging treasures</li>
                    <li><strong>Curse:</strong> Increases with treasures (ghost attacks at high levels)</li>
                    <li><strong>Crew:</strong> Recruit to reduce curse effects</li>
                    <li><strong>Map Pieces:</strong> Collect 3+ to unlock final treasure</li>
                </ul>
                
                <h3>🎨 Strategy Tips</h3>
                <ul>
                    <li>Use hints wisely - they reduce treasure value</li>
                    <li>Quit strategically when stuck on hard puzzles</li>
                    <li>Recruit crew early to manage curse effects</li>
                    <li>Explore thoroughly before sailing to next island</li>
                    <li>Balance risk: More treasures = more gold but higher curse</li>
                </ul>
                
                <h3>🏆 Victory Conditions</h3>
                <ul>
                    <li>Collect 3+ map pieces from different islands</li>
                    <li>Survive curse effects with crew's help</li>
                    <li>Find and claim the Heart of Gold</li>
                    <li>Achieve Legendary Captain rank!</li>
                </ul>
            </div>
            <button onclick="game.closeModal()" style="padding: 1rem 2rem; margin-top: 1rem; font-size: 1.1rem; background: #228B22; color: white; border: none; border-radius: 5px; cursor: pointer;">
                ⚔️ Start Adventure!
            </button>
        `;
        this.showModal();
    }
    
    showMessage(title, message) {
        const modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = `
            <h2>${title}</h2>
            <p>${message}</p>
            <button onclick="game.closeModal()" style="padding: 0.5rem 1rem; margin-top: 1rem;">
                Continue
            </button>
        `;
        this.showModal();
    }
    
    showModal() {
        document.getElementById('modal-overlay').classList.remove('hidden');
    }
    
    closeModal() {
        document.getElementById('modal-overlay').classList.add('hidden');
    }
    
    updateUI() {
        document.getElementById('gold').textContent = `💰 Gold: ${this.gameState.gold}`;
        document.getElementById('curse').textContent = `👻 Curse: ${this.gameState.curse}%`;
        document.getElementById('crew').textContent = `⚓ Crew: ${this.gameState.crew}`;
        
        const island = this.islands[this.gameState.currentIsland];
        document.getElementById('island-name').textContent = island.name;
        document.getElementById('island-description').textContent = island.description;
        
        // Update inventory
        const itemsList = document.getElementById('items-list');
        itemsList.innerHTML = this.gameState.inventory.map(item => 
            `<div class="item">${item}</div>`
        ).join('');
        
        // Update map pieces
        const mapCollection = document.getElementById('map-collection');
        mapCollection.innerHTML = this.gameState.mapPieces.map(piece => 
            `<div class="map-piece" title="${piece.riddle}">📜 ${piece.island}</div>`
        ).join('');
    }
}

// Initialize game when page loads
let game;
window.addEventListener('load', () => {
    game = new PirateGame();
});