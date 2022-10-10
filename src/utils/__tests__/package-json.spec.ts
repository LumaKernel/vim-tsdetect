import { describe, it, expect } from 'vitest';
import { applyOptionDeclarations } from '../package-json';

describe('applyOptionDeclarations', () => {
  it('should apply changes of options declarations to package json', () => {
    expect(
      applyOptionDeclarations(
        {
          contributes: {
            configuration: {
              type: 'object',
              title: 'Awesome Extension',
              properties: {
                'extension.a': {
                  type: 'string',
                  default: 'abc',
                  markdownDescription: 'Foo bar',
                },
                'extension.b': {
                  type: 'boolean',
                  default: false,
                },
              },
            },
          },
        },
        [
          {
            optionName: 'extension.a',
            descriptionLines: ['Hi', 'Hello'],
          },
          {
            optionName: 'extension.b',
            descriptionLines: ['You should use `true`.'],
          },
        ],
      ),
    ).toEqual({
      contributes: {
        configuration: {
          type: 'object',
          title: 'Awesome Extension',
          properties: {
            'extension.a': {
              type: 'string',
              default: 'abc',
              markdownDescription: 'Hi\nHello',
            },
            'extension.b': {
              type: 'boolean',
              default: false,
              markdownDescription: 'You should use `true`.',
            },
          },
        },
      },
    });
  });

  it('should throw for absent application', () => {
    expect(() =>
      applyOptionDeclarations(
        {
          contributes: {
            configuration: {
              type: 'object',
              title: 'Awesome Extension',
              properties: {
                'extension.c': {
                  type: 'boolean',
                  default: false,
                },
              },
            },
          },
        },
        [
          {
            optionName: 'extension.a',
            descriptionLines: ['Hi'],
          },
        ],
      ),
    ).toThrow();
  });
});
