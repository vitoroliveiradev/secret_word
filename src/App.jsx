import "./App.css";

import { useCallback, useEffect, useState } from "react";

import { wordsList } from "./data/words";

import { StartScreen } from "./components/StartScreen";
import { Game } from "./components/Game";
import { GameOver } from "./components/GameOver";

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
];

const guessesQty = 3;

export const App = () => {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);
  // Palavra sorteada
  const [pickedWord, setPickedWord] = useState("");
  // Categoria sorteada.
  const [pickedCategory, setPicketCategory] = useState("");
  // array das letras
  const [letters, setLetters] = useState([]);

  // Letras adivinhadas
  const [guessedLetters, setGuessedLetters] = useState([]);
  // Letras erradas
  const [wrongLetters, setWrongLetters] = useState([]);
  // tentativas do user;
  const [guesses, setGuesses] = useState(3);
  // Pontuação
  const [score, setScore] = useState(0);

  const pickWordAndCategory = useCallback(() => {
    // pegando categorias
    const categories = Object.keys(words);
    // Pegando uma categoria aleatoria.
    const category =
      categories[Math.floor(Math.random() * Object.keys(categories).length)];

    // Pegando uma palavra aleatoria.
    const word =
      words[category][Math.floor(Math.random() * words[category].length)];

    return { word, category };
  }, [words]);

  const startGame = useCallback(() => {

    // Limpando os estados antes de começar.
    clearLetterStates();

    // Sortear letra e categoria
    const { word, category } = pickWordAndCategory();

    // Criar um array com as letras
    let wordLetters = word.split("");

    // Colocando todas as letras em minúsculo.
    wordLetters = wordLetters.map((l) => l.toLowerCase());

    // Preenchendo estados.
    setPickedWord(word);
    setPicketCategory(category);
    setLetters(wordLetters);

    // Alterando o estágio do jogo.
    setGameStage(stages[1].name);
  }, [pickWordAndCategory]);

  const verifyLetter = (letter) => {
    // Padronizando a letra digitada.
    const normalizedLetter = letter.toLowerCase();

    // Validando se a letra ja foi usada.
    if (
      guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)
    ) {
      return;
    }

    // Verificando se a letra digitada existe dentro da array de letra sorteada.
    if(letters.includes(normalizedLetter)) {
      // Vai pegar tudo que tem no array de letras corretas e adiciona a letra digitada agora.
      setGuessedLetters(actualGuessedLetters => [
        ...actualGuessedLetters,
        normalizedLetter
      ])
    } else {
      // Vai pegar tudo que tem no array de letras erradas e adiciona a letra digitada agora.
      setWrongLetters(actualWrongLetters => [
        ...actualWrongLetters,
        normalizedLetter
      ])
      setGuesses(actualGuesses => actualGuesses - 1);
    }
  };

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  }

  // Condição de derrota.
  useEffect(() => {
    if(guesses <= 0) {
      // Resetar todos os estados.
      clearLetterStates();

      // Mudando o estagio do jogo.
      setGameStage(stages[2].name) 
    }
  }, [guesses, letters, startGame])

  // Condição de vitória.
  useEffect(() => {

    // Criando lista de letras unicas.
    const uniqueLetters = [... new Set(letters)];
    
    // Condição de vitoria quando as letras certas serem iguais ao array de palavras unicas.
    if(guessedLetters.length === uniqueLetters.length) {

      // Adicionando pontos.
      setScore(actualScore => actualScore += 100);

      // Restartar jogo com uma nova palavra.
      startGame();
    }

  }, [guessedLetters])

  const retry = () => {
    setScore(0);
    setGuesses(guessesQty);

    setGameStage(stages[0].name);
  };

  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame={startGame} />}
      {gameStage === "game" && (
        <Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {gameStage === "end" && <GameOver retry={retry} score={score} />}
    </div>
  );
};
