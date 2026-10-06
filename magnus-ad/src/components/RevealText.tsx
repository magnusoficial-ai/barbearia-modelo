import React from 'react';
import {enter, soft} from '../lib/anim';
import {useScene} from '../lib/scene';

type Props = {
  text: string;
  start: number;
  /** frames entre uma palavra (ou linha) e a próxima */
  stagger?: number;
  by?: 'word' | 'line';
  style?: React.CSSProperties;
  /** estilo extra por palavra, útil para destacar uma palavra */
  wordStyle?: (word: string, index: number) => React.CSSProperties | undefined;
  distance?: number;
  blur?: number;
  dur?: number;
};

/**
 * Texto que entra por palavra ou por linha: desfoque→nítido e sobe 16px.
 * Use "\n" no texto para forçar quebra de linha.
 */
export const RevealText: React.FC<Props> = ({
  text,
  start,
  stagger = 4,
  by = 'word',
  style,
  wordStyle,
  distance = 16,
  blur = 10,
  dur = 18,
}) => {
  const {f} = useScene();
  const lines = text.split('\n');
  let index = 0;
  return (
    <div style={style}>
      {lines.map((line, li) => {
        const words = line.split(' ');
        const lineStart = start + li * stagger;
        return (
          <div key={li} style={{display: 'block', textWrap: 'balance'}}>
            {words.map((word, wi) => {
              const i = index++;
              const at = by === 'word' ? start + i * stagger : lineStart;
              const p = soft(f, at, dur);
              return (
                <React.Fragment key={wi}>
                  <span
                    style={{
                      display: 'inline-block',
                      ...enter(p, distance, blur),
                      ...wordStyle?.(word, i),
                    }}
                  >
                    {word}
                  </span>
                  {wi < words.length - 1 ? ' ' : null}
                </React.Fragment>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

/** Quantas palavras um texto tem (para encadear animações depois dele). */
export const wordCount = (text: string) => text.split(/\s+/).filter(Boolean).length;
