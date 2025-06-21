class PirateGame {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.gameState = {
            gold: 0,
            curse: 0,
            crew: 1,
            currentIsland: 0,
            inventory: [],
            mapPieces: [],
            exploredAreas: new Set()
        };
        
        this.islands = [
            {
                name: "Skull Cove",
                description: "A mysterious cove where ancient pirates once hid their treasures...",
                treasures: [
                    { 
                        x: 300, y: 200, found: false, value: 50, originalValue: 50, curse: 5,
                        riddle: "Where shadows dance beneath the palm's embrace, seek the treasure in nature's hiding place.",
                        answer: "palm tree",
                        solved: false,
                        hintsUsed: 0
                    },
                    { 
                        x: 500, y: 350, found: false, value: 100, originalValue: 100, curse: 10,
                        riddle: "At the island's heart where all paths meet, the golden prize lies at your feet.",
                        answer: "center",
                        solved: false,
                        hintsUsed: 0
                    }
                ],
                mapPiece: { found: false, riddle: "Where the skull grins at the moon's light" }
            },
            {
                name: "Siren's Rest",
                description: "An enchanted island where mermaids once sang sailors to their doom...",
                treasures: [
                    { 
                        x: 200, y: 300, found: false, value: 75, originalValue: 75, curse: 8,
                        riddle: "Where the ocean kisses the sandy shore, ancient coins rest forevermore.",
                        answer: "shore",
                        solved: false,
                        hintsUsed: 0
                    },
                    { 
                        x: 600, y: 150, found: false, value: 150, originalValue: 150, curse: 15,
                        riddle: "High above where eagles soar, the siren's treasure waits in store.",
                        answer: "high",
                        solved: false,
                        hintsUsed: 0
                    }
                ],
                mapPiece: { found: false, riddle: "Where songs echo through coral caves" }
            },
            {
                name: "Devil's Triangle",
                description: "A cursed island shrouded in perpetual mist and dark magic...",
                treasures: [
                    { 
                        x: 400, y: 250, found: false, value: 200, originalValue: 200, curse: 20,
                        riddle: "In the devil's domain where darkness reigns, the cursed gold breaks mortal chains.",
                        answer: "darkness",
                        solved: false,
                        hintsUsed: 0
                    },
                    { 
                        x: 150, y: 400, found: false, value: 300, originalValue: 300, curse: 25,
                        riddle: "Where the triangle's corner points to doom, the greatest treasure breaks the gloom.",
                        answer: "corner",
                        solved: false,
                        hintsUsed: 0
                    }
                ],
                mapPiece: { found: false, riddle: "Where three points meet in eternal darkness" }
            }
        ];
        
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
                this.gameState.gold += treasure.value;
                this.gameState.curse += treasure.curse;
                
                // Add treasure glow effect
                document.getElementById('gold').classList.add('treasure-found');
                setTimeout(() => {
                    document.getElementById('gold').classList.remove('treasure-found');
                }, 3000);
                
                this.showMessage("Treasure Found! 💰", 
                    `You found ${treasure.value} gold! But the curse grows stronger... (+${treasure.curse}% curse)`);
                
                // Check for map piece
                if (!island.mapPiece.found && Math.random() < 0.5) {
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
            this.showMessage("New Island Discovered! 🏝️", 
                `Welcome to ${island.name}! ${island.description}`);
            
            this.updateUI();
            this.updateRiddlesPanel();
            this.drawIsland();
        } else {
            // Check if player has enough map pieces for final treasure
            if (this.gameState.mapPieces.length >= 2) {
                this.showFinalTreasureModal();
            } else {
                this.showMessage("Need More Map Pieces", 
                    `You need at least 2 map pieces to locate the Heart of Gold. You have ${this.gameState.mapPieces.length}.`);
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
        
        riddlesList.innerHTML = island.treasures.map((treasure, index) => {
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
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
        
        // Add enter key listeners
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
        
        if (userAnswer.includes(treasure.answer) || userAnswer === treasure.answer) {
            treasure.solved = true;
            this.showMessage("Riddle Solved! 🧩", 
                `Brilliant! The ancient spirits approve. You may now dig for the treasure worth ${treasure.value} gold!`);
            this.updateRiddlesPanel();
        } else {
            this.showMessage("Wrong Answer ❌", 
                "The spirits shake their heads. Try again or use a hint!");
        }
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
        
        // Reset islands
        this.islands.forEach(island => {
            island.treasures.forEach(treasure => {
                treasure.found = false;
                treasure.solved = false;
                treasure.hintsUsed = 0;
                treasure.value = treasure.originalValue;
            });
            island.mapPiece.found = false;
        });
        
        // Reset crew
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
        this.showMessage("Welcome, Captain! 🏴‍☠️", 
            "You've discovered a cursed treasure map! Explore islands, dig for treasure, and recruit crew members. But beware - the more gold you collect, the stronger the curse becomes!");
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