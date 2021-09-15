import { parseReadmeMd } from '../readme';

describe('parseReadmeMd', () => {
  it('should parse README Options section', () => {
    expect(
      parseReadmeMd([
        '# Hi',
        '',
        '## Foo',
        '',
        'Blah, blah.',
        '',
        '## Options',
        '',
        '### `extension.a`',
        '',
        'This is...',
        '',
        'Values: `number`',
        'Default:',
        '```json',
        '{',
        '  "extension.a": 0',
        '}',
        '```',
        '',
        '### `extension.b`',
        'B is a good option.',
        'You should use this.',
        '',
        'NOTE: Be careful to use this.',
        'Values: `number`',
        '## Some',
      ]),
    ).toEqual([
      {
        descriptionLines: ['This is...'],
        optionName: 'extension.a',
      },
      {
        descriptionLines: ['B is a good option.', 'You should use this.', '', 'NOTE: Be careful to use this.'],
        optionName: 'extension.b',
      },
    ]);
  });
  it('should throw for illegal heading', () => {
    expect(() => parseReadmeMd(['## Options', '### extension.a'])).toThrow();
  });
});
