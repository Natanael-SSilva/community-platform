import { useState, useEffect } from 'react';

/**
 * @description
 * Um Custom Hook que implementa a lógica de "debouncing".
 * Ele recebe um valor (que muda rapidamente, como um texto de busca)
 * e um atraso em milissegundos. Ele retorna uma versão "atrasada" desse valor,
 * que só é atualizada depois que o valor original para de mudar pelo tempo do atraso.
 *
 * @param {T} value O valor a ser "debounceado".
 * @param {number} delay O atraso em milissegundos.
 * @returns {T} O valor "debounceado".
 */
function useDebounce<T>(value: T, delay: number): T {
  // Estado para guardar o valor "debounceado"
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Configura um timer para atualizar o valor "debounceado" após o 'delay'
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Função de limpeza: Isso é crucial. Ela cancela o timer anterior
    // toda vez que o 'value' muda, reiniciando a contagem.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // O efeito só é re-executado se o valor ou o atraso mudarem

  return debouncedValue;
}

export default useDebounce;
