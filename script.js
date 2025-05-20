window.onload = function () {
  function scrollToGameArea() {
    document.getElementById("game-area").scrollIntoView({ behavior: "smooth" });
  }

  document.getElementById("js-btn").addEventListener("click", function () {
    document.getElementById("game-area").innerHTML = `
      <div style="position:relative;height:0;padding-bottom:117.6%;overflow:hidden;">
        <iframe style="position:absolute;top:0;left:0;width:55%;height:50%;" 
        src="https://arcade.makecode.com/---run?id=S49743-14135-85211-11139" 
        allowfullscreen="allowfullscreen" 
        sandbox="allow-popups allow-forms allow-scripts allow-same-origin" 
        frameborder="0"></iframe>
      </div>
    `;
    scrollToGameArea();
  });

  // Python Game (Hangman)
  document.getElementById("Python-btn").addEventListener("click", function () {
    document.getElementById("game-area").innerHTML = `
      <h1>Hangman Game</h1>
      <select id="category-select">
        <option value="">Choose a category</option>
        <option value="animals">Animals</option>
        <option value="fruits">Fruits</option>
        <option value="programming">Programming</option>
        <option value="geography">Geography</option>
        <option value="movies">Movies</option>
        <option value="historical figures">Historical Figures</option>
        <option value="space">Space</option>
        <option value="music">Music</option>
      </select>
      <button onclick="startGame()">Start Game</button>
      <button onclick="resetGame()" style="margin-left:10px;">Reset</button>
      <div id="game-container" style="display: none;">
        <div id="hangman-drawing"></div>
        <div id="word" class="word-display"></div>
        <div id="attempts">Attempts left: 6</div>
        <div id="wrong-guesses">Wrong guesses: </div>
        <div id="input-area">
          <input type="text" id="guess-input" maxlength="1" />
          <button onclick="makeGuess()">Guess</button>
        </div>
      </div>
    `;

    if (!document.getElementById("hangman-style")) {
      const gameStyles = document.createElement("style");
      gameStyles.id = "hangman-style";
      gameStyles.textContent = `
        .word-display {
          font-size: 24px;
          margin: 20px;
          letter-spacing: 5px;
        }
        #hangman-drawing {
          font-family: "Courier New", monospace;
          white-space: pre;
        }
        #category-select {
          margin: 20px;
          padding: 10px;
        }
        #guess-input {
          padding: 5px;
          margin-right: 5px;
        }
      `;
      document.head.appendChild(gameStyles);
    }

    const categories = {
      animals: [
        'chimpanzee', 'aardvark', 'hippopotamus', 'kangaroo', 'elephant',
        'giraffe', 'rhinoceros', 'alligator', 'flamingo', 'porcupine',
        'dolphin', 'armadillo', 'meerkat', 'platypus', 'wolverine'
      ],
      fruits: [
        'pomegranate', 'jackfruit', 'kumquat', 'pineapple', 'blueberry',
        'raspberry', 'watermelon', 'grapefruit', 'cranberry', 'apricot',
        'persimmon', 'dragonfruit', 'lychee', 'tangerine', 'papaya'
      ],
      programming: [
        'asynchronous', 'recursion', 'inheritance', 'polymorphism', 'compilation',
        'algorithm', 'variable', 'expression', 'debugging', 'exception',
        'framework', 'interface', 'iteration', 'abstraction', 'encryption'
      ],
      geography: [
        'antarctica', 'zimbabwe', 'england', 'australia', 'greenland',
        'bangladesh', 'guatemala', 'kazakhstan', 'indonesia', 'switzerland',
        'argentina', 'nicaragua', 'philippines', 'mozambique', 'lithuania'
      ],
      movies: [
        'interstellar', 'inception', 'gladiator', 'titanic', 'avatar',
        'parasite', 'whiplash', 'amelie', 'memento', 'coco',
        'casablanca', 'braveheart', 'goodfellas', 'jaws', 'up'
      ],
      historical_figures: [
        'napoleon', 'galileo', 'cleopatra', 'gandhi', 'einstein',
        'aristotle', 'mandela', 'washington', 'lincoln', 'darwin',
        'shakespeare', 'confucius', 'alexander', 'mariecurie', 'tesla'
      ],
      space: [
        'blackhole', 'galaxy', 'supernova', 'asteroid', 'telescope',
        'comet', 'nebula', 'satellite', 'orbit', 'meteorite',
        'cosmos', 'solarsystem', 'gravity', 'exoplanet', 'eclipse'
      ],
      music: [
        'symphony', 'melancholy', 'orchestra', 'harmonica', 'trombone',
        'violin', 'saxophone', 'bassoon', 'soprano', 'crescendo',
        'tempo', 'vibrato', 'beatboxing', 'improvisation', 'falsetto'
      ]
    };


    const hangmanPics = [
` -----
|   |
     |
     |
     |
     |
=======`,
` -----
|   |
O   |
     |
     |
     |
=======`,
` -----
|   |
O   |
|   |
     |
     |
=======`,
` -----
|   |
O   |
/|   |
     |
     |
=======`,
` -----
|   |
O   |
/|\\  |
     |
     |
=======`,
` -----
|   |
O   |
/|\\  |
/    |
     |
=======`,
` -----
|   |
O   |
/|\\  |
/ \\  |
     |
=======`
    ];

    let word = '';
    let guessedLetters = new Set();
    let guessedWrong = new Set();
    let attemptsLeft = 6;

    window.startGame = async function () {
      const category = document.getElementById('category-select').value;
      if (!category) {
        alert('Please select a category!');
        return;
      }

      try {
        const response = await fetch('http://0.0.0.0:5000/get-word', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category })
        });
        const data = await response.json();
        word = data.word.toLowerCase();
      } catch {
        word = categories[category][Math.floor(Math.random() * categories[category].length)].toLowerCase();
      }

      guessedLetters = new Set();
      guessedWrong = new Set();
      attemptsLeft = 6;

      document.getElementById('input-area').style.display = 'block';
      document.getElementById('game-container').style.display = 'block';
      updateDisplay();
    };

    window.updateDisplay = function () {
      const wordDisplay = [...word].map(l => guessedLetters.has(l) ? l : '_').join(' ');
      document.getElementById('word').textContent = wordDisplay;
      document.getElementById('attempts').textContent = `Attempts left: ${attemptsLeft}`;
      document.getElementById('wrong-guesses').textContent = `Wrong guesses: ${[...guessedWrong].join(', ')}`;
      document.getElementById('hangman-drawing').textContent = hangmanPics[6 - attemptsLeft];
      document.getElementById('guess-input').value = '';
    };

    window.makeGuess = function () {
      const guess = document.getElementById('guess-input').value.toLowerCase();

      if (!guess.match(/[a-z]/)) {
        alert('Please enter a valid letter.');
        return;
      }
      if (guessedLetters.has(guess) || guessedWrong.has(guess)) {
        alert('You\'ve already guessed this letter!');
        return;
      }

      if (word.includes(guess)) {
        guessedLetters.add(guess);
        if ([...word].every(l => guessedLetters.has(l))) {
          document.getElementById('input-area').style.display = 'none';
          updateDisplay();
          showConfetti();
          alert('🎉 Congratulations! You\'ve won!');
        }
      } else {
        guessedWrong.add(guess);
        attemptsLeft--;
        if (attemptsLeft === 0) {
          document.getElementById('input-area').style.display = 'none';
          updateDisplay();
          alert(`Game Over! The word was: ${word}`);
          return;
        }
      }

      updateDisplay();
    };

    window.resetGame = function () {
      document.getElementById('category-select').value = '';
      document.getElementById('game-container').style.display = 'none';
      document.getElementById('input-area').style.display = 'block';
    };

    document.addEventListener('keyup', function (event) {
      if (event.target.id === 'guess-input' && event.key === 'Enter') {
        makeGuess();
      }
    });

    scrollToGameArea();
  });

  // Surprise Panda Button
  document.getElementById("surprise-btn").addEventListener("click", function () {
    document.getElementById("game-area").innerHTML = `
      <div style="text-align: center;">
        <h2>🎈 Panda! 🎉</h2>
        <div style="width:400px;height:300px;position:relative;margin:0 auto;">
          <iframe 
            src="https://giphy.com/embed/SZWVMQz6gRmdG" 
            width="100%" 
            height="100%" 
            style="position:absolute;left:0;right:0;margin:auto;border-radius:20px;" 
            frameborder="0" 
            class="giphy-embed" 
            allowfullscreen>
          </iframe>
        </div>
        <p><a href="https://giphy.com/gifs/panda-real-fu-SZWVMQz6gRmdG" target="_blank">View on GIPHY</a></p>
        <p>You just triggered a Panda surprise!</p>
    `;
    scrollToGameArea();
  });
};
