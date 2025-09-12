// Game variables
let userScore = 0;
let compScore = 0;
let roundCount = 1;
const maxRounds = 20;
let gameActive = true;
let autoPlayInterval = null;

// DOM elements
const choices = document.querySelectorAll(".choice");
const msg = document.querySelector('#msg');
const userScorePara = document.querySelector("#user-score");
const compScorePara = document.querySelector("#comp-score");
const resetBtn = document.querySelector("#reset-btn");
const autoPlayBtn = document.querySelector("#auto-play-btn");
const roundCountElement = document.querySelector("#round-count");
const winnerOverlay = document.querySelector("#winner-overlay");
const winnerText = document.querySelector("#winner-text");
const winnerMessage = document.querySelector("#winner-message");
const playAgainBtn = document.querySelector("#play-again-btn");
const fireworksContainer = document.querySelector("#fireworks-container");

// Generate computer's choice
const genComChoice = () => {
    const options = ["rock", "paper", "scissors"];
    const randIdx = Math.floor(Math.random() * 3);
    return options[randIdx];
};

// Draw game function
const drawGame = (userChoice, comChoice) => {
    msg.innerText = `Game drawn! Both chose ${userChoice}`;
    msg.style.backgroundColor = "#081b31";
};

// Show winner function
const showWinner = (userWin, userChoice, comChoice) => {
    if (userWin) {
        userScore++;
        userScorePara.innerText = userScore;
        msg.innerText = `You Win! ${userChoice} beats ${comChoice}`;
        msg.style.backgroundColor = "green";
    } else {
        compScore++;
        compScorePara.innerText = compScore;
        msg.innerText = `You Lose! ${comChoice} beats ${userChoice}`;
        msg.style.backgroundColor = "red";
    }
};

// Check if game should end
const checkGameEnd = () => {
    if (roundCount >= maxRounds) {
        gameActive = false;
        
        // Show winner overlay
        if (userScore > compScore) {
            winnerText.textContent = "You Win!";
            winnerMessage.textContent = `Congratulations! You won the game ${userScore}-${compScore} after ${maxRounds} rounds.`;
            createFireworks();
        } else if (compScore > userScore) {
            winnerText.textContent = "Computer Wins!";
            winnerMessage.textContent = `The computer won the game ${compScore}-${userScore} after ${maxRounds} rounds.`;
        } else {
            winnerText.textContent = "It's a Tie!";
            winnerMessage.textContent = `The game ended in a tie ${userScore}-${compScore} after ${maxRounds} rounds.`;
        }
        
        winnerOverlay.classList.add('active');
        
        // Disable choices
        choices.forEach(choice => {
            choice.style.pointerEvents = 'none';
            choice.style.opacity = '0.7';
        });
        
        // Stop auto play if active
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
            autoPlayBtn.textContent = "Auto Play";
            autoPlayBtn.style.background = "linear-gradient(to right, #00b09b, #96c93d)";
        }
        
        return true;
    }
    return false;
};

// Create fireworks animation
function createFireworks() {
    // Clear any existing fireworks
    fireworksContainer.innerHTML = '';
    
    // Create multiple fireworks
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            createFirework();
        }, i * 200);
    }
}

function createFirework() {
    const firework = document.createElement('div');
    firework.classList.add('firework');
    
    // Random position
    const posX = Math.random() * window.innerWidth;
    const posY = Math.random() * window.innerHeight;
    
    // Random color
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    firework.style.left = `${posX}px`;
    firework.style.top = `${posY}px`;
    firework.style.backgroundColor = color;
    firework.style.boxShadow = `0 0 10px ${color}, 0 0 20px ${color}`;
    
    fireworksContainer.appendChild(firework);
    
    // Animate the firework
    const size = 5 + Math.random() * 10;
    const moveX = (Math.random() - 0.5) * 100;
    const moveY = (Math.random() - 0.5) * 100;
    
    const keyframes = [
        { transform: 'translate(0, 0) scale(1)', opacity: 1 },
        { transform: `translate(${moveX}px, ${moveY}px) scale(${size})`, opacity: 0 }
    ];
    
    const options = {
        duration: 1000 + Math.random() * 1000,
        easing: 'cubic-bezier(0.1, 0.3, 0.2, 1)'
    };
    
    firework.animate(keyframes, options).onfinish = () => {
        firework.remove();
    };
}

// Main game function
const playGame = (userChoice) => {
    if (!gameActive) return;
    
    // Generate computer choice
    const comChoice = genComChoice();
    
    if (userChoice === comChoice) {
        // Draw game
        drawGame(userChoice, comChoice);
    } else {
        let userWin = true;
        if (userChoice === "rock") {
            // scissors, paper
            userWin = comChoice === "paper" ? false : true;
        } else if (userChoice === "paper") {
            // rock, scissors
            userWin = comChoice === "scissors" ? false : true;
        } else {
            // rock, paper
            userWin = comChoice === "rock" ? false : true;
        }
        showWinner(userWin, userChoice, comChoice);
    }
    
    // Increment round count
    roundCount++;
    roundCountElement.textContent = roundCount;
    
    // Check if game should end
    checkGameEnd();
};

// Auto play function
const toggleAutoPlay = () => {
    if (autoPlayInterval) {
        // Stop auto play
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
        autoPlayBtn.textContent = "Auto Play";
        autoPlayBtn.style.background = "linear-gradient(to right, #00b09b, #96c93d)";
        
        // Enable choices
        choices.forEach(choice => {
            choice.style.pointerEvents = 'auto';
            choice.style.opacity = '1';
        });
    } else {
        // Start auto play
        autoPlayInterval = setInterval(() => {
            if (gameActive) {
                const choices = ["rock", "paper", "scissors"];
                const randomChoice = choices[Math.floor(Math.random() * 3)];
                playGame(randomChoice);
            }
        }, 1000);
        
        autoPlayBtn.textContent = "Stop Auto Play";
        autoPlayBtn.style.background = "linear-gradient(to right, #ff416c, #ff4b2b)";
        
        // Disable choices during auto play
        choices.forEach(choice => {
            choice.style.pointerEvents = 'none';
            choice.style.opacity = '0.7';
        });
    }
};

// Reset game function
const resetGame = () => {
    userScore = 0;
    compScore = 0;
    roundCount = 1;
    gameActive = true;
    
    userScorePara.innerText = userScore;
    compScorePara.innerText = compScore;
    roundCountElement.textContent = roundCount;
    
    msg.innerText = "Play your move";
    msg.style.backgroundColor = "#081b31";
    
    // Enable choices
    choices.forEach(choice => {
        choice.style.pointerEvents = 'auto';
        choice.style.opacity = '1';
    });
    
    // Stop auto play if active
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
        autoPlayBtn.textContent = "Auto Play";
        autoPlayBtn.style.background = "linear-gradient(to right, #00b09b, #96c93d)";
    }
    
    // Hide winner overlay
    winnerOverlay.classList.remove('active');
    
    // Clear fireworks
    fireworksContainer.innerHTML = '';
};

// Event listeners for choices
choices.forEach((choice) => {
    choice.addEventListener("click", () => {
        const userChoice = choice.getAttribute("id");
        playGame(userChoice);
    });
});

// Reset button event listener
resetBtn.addEventListener("click", resetGame);

// Auto play button event listener
autoPlayBtn.addEventListener("click", toggleAutoPlay);

// Play again button event listener
playAgainBtn.addEventListener("click", resetGame);