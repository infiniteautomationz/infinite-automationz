import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

export default [
  {
    ignores: [
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      'client-projects/**',
      '_legacy_static_site/**',
    ],
  },
  ...nextVitals,
  ...nextTs,
  {
    files: ['src/**/*.{ts,tsx,js,jsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            'client-projects/*',
            '../client-projects/*',
            '../../client-projects/*',
            '../../../client-projects/*',
          ],
        },
      ],
    },
  },
];
